import type { Db } from '../../../db/connection.ts'
import type { NewUser, User } from '../../../db/models/user.ts'

export const insertUser = async (db: Db, values: NewUser): Promise<User> => {
  const { password: _password, ...user } = (await db.User.create(values)).toObject()

  return user
}
