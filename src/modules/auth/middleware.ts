import type { Middleware } from 'koa'
import type { AppConfig } from '../../config.ts'
import type { Db } from '../../db/connection.ts'
import type { User } from '../../db/models/user.ts'
import { getUserById } from '../user/repositories/get-user-by-id.ts'
import { verifyToken } from './token.ts'

export type AuthState = {
  user: User
}

const BEARER_PATTERN = /^Bearer\s+(\S+)$/i

export const authenticate =
  (db: Db, config: AppConfig): Middleware<AuthState> =>
  async (ctx, next) => {
    const token = BEARER_PATTERN.exec(ctx.get('authorization'))?.[1]
    const userId = token ? verifyToken(token, config) : null
    const user = userId ? await getUserById(db, userId) : null

    if (!user) {
      return ctx.throw(401, 'Unauthorized', {
        headers: { 'WWW-Authenticate': 'Bearer' },
      })
    }

    ctx.state.user = user
    await next()
  }
