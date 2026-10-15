import { isValidObjectId } from 'mongoose'
import type { Db } from '../../../db/connection.ts'
import type { User } from '../../../db/models/user.ts'

export const getUserById = async (db: Db, id: string): Promise<User | null> =>
  isValidObjectId(id) ? db.User.findById(id).lean<User>() : null
