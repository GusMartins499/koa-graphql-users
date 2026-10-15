import { isValidObjectId } from 'mongoose'
import type { Db } from '../../../db/connection.ts'

export const deleteUser = async (db: Db, id: string): Promise<boolean> => {
  if (!isValidObjectId(id)) {
    return false
  }

  const { deletedCount } = await db.User.deleteOne({ _id: id })

  return deletedCount === 1
}
