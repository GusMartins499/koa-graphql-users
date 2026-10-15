import { createApp } from './app.ts'
import { createDb } from './db/connection.ts'

const port = Number(process.env.PORT ?? 3333)
const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not set')
}

const db = await createDb(
  process.env.MONGO_URI ?? 'mongodb://localhost:27017/koa-graphql-users',
)

createApp(db, { jwtSecret }).listen(port, () => {
  console.log(`http://localhost:${port}/graphql`)
})
