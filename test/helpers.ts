import { once } from 'node:events'
import type { AddressInfo } from 'node:net'
import { after } from 'node:test'
import { createApp } from '../src/app.ts'

type GraphQLResponse<T> = {
  data?: T
  errors?: { message: string; extensions?: Record<string, unknown> }[]
}

export const setupTestApp = async () => {
  const server = createApp().listen(0)
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

  return { baseUrl, gql }
}
