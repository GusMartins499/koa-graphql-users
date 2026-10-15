import type { Db } from '../../../db/connection.ts'
import type { User } from '../../../db/models/user.ts'

export const listUsers = (db: Db): Promise<User[]> =>
  db.User.find().sort({ createdAt: -1 }).lean<User[]>()
