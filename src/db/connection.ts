import mongoose from 'mongoose'
import { userSchema } from './models/user.ts'

export const createDb = async (uri: string) => {
  const connection = await mongoose.createConnection(uri).asPromise()
  const User = connection.model('User', userSchema)
  await User.init()

  return { connection, User }
}

export type Db = Awaited<ReturnType<typeof createDb>>
