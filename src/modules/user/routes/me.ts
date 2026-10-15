import type { Middleware } from 'koa'
import type { AuthState } from '../../auth/middleware.ts'

export const me: Middleware<AuthState> = (ctx) => {
  const { user } = ctx.state

  ctx.body = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}
