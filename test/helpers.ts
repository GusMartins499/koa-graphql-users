import { randomUUID } from 'node:crypto'
import { once } from 'node:events'
import type { AddressInfo } from 'node:net'
import { after } from 'node:test'
import { createApp } from '../src/app.ts'
import { createDb, type Db } from '../src/db/connection.ts'

type GraphQLResponse<T> = {
  data?: T
  errors?: { message: string; extensions?: Record<string, unknown> }[]
}

export const setupTestDb = async (): Promise<Db> => {
  const uri = process.env.MONGO_TEST_URI

  if (!uri) {
    throw new Error('MONGO_TEST_URI is not set, run tests with npm test')
  }

  const db = await createDb(uri.replace(/\/?(\?|$)/, `/test-${randomUUID()}$1`))

  after(async () => {
    await db.connection.dropDatabase()
    await db.connection.close()
  })

  return db
}

export const setupTestApp = async () => {
  const db = await setupTestDb()
  const server = createApp(db).listen(0)
  await once(server, 'listening')
  after(() => server.close())

  const { port } = server.address() as AddressInfo
  const baseUrl = `http://localhost:${port}`

  const gql = async <T>(
    query: string,
    variables?: Record<string, unknown>,
    headers?: Record<string, string>,
  ): Promise<GraphQLResponse<T>> => {
    const response = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify({ query, variables }),
    })

    return response.json() as Promise<GraphQLResponse<T>>
  }

  return { db, baseUrl, gql }
}
