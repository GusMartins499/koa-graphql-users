import { MongoMemoryServer } from 'mongodb-memory-server'

let mongod: MongoMemoryServer

export const globalSetup = async () => {
  mongod = await MongoMemoryServer.create()
  process.env.MONGO_TEST_URI = mongod.getUri()
}

export const globalTeardown = async () => {
  await mongod.stop()
}
