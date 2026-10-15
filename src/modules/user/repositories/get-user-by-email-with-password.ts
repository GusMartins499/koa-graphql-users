import type { Db } from '../../../db/connection.ts'
import type { UserWithPassword } from '../../../db/models/user.ts'

export const getUserByEmailWithPassword = (
  db: Db,
  email: string,
): Promise<UserWithPassword | null> =>
  db.User.findOne({ email: email.trim().toLowerCase() })
    .select('+password')
    .lean<UserWithPassword>()
