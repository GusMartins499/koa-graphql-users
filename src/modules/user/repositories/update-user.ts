import { isValidObjectId } from 'mongoose'
import type { Db } from '../../../db/connection.ts'
import type { NewUser, User } from '../../../db/models/user.ts'

export const updateUser = async (
  db: Db,
  id: string,
  values: Partial<NewUser>,
): Promise<User | null> =>
  isValidObjectId(id)
    ? db.User.findByIdAndUpdate(id, values, {
        returnDocument: 'after',
        runValidators: true,
      }).lean<User>()
    : null
