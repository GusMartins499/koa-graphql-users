import { Router } from '@koa/router'
import Koa from 'koa'
import type { AppConfig } from './config.ts'
import type { Db } from './db/connection.ts'
import { authenticate } from './modules/auth/middleware.ts'
import { me } from './modules/user/routes/me.ts'
import { createGraphQLHandler } from './yoga.ts'

export const createApp = (db: Db, config: AppConfig) => {
  const app = new Koa()
  const router = new Router()
  const yoga = createGraphQLHandler(db, config)

  router.get('/me', authenticate(db, config), me)

  router.all('/graphql', async (ctx) => {
    const response = await yoga.handleNodeRequestAndResponse(ctx.req, ctx.res, {
      ctx,
    })

    ctx.status = response.status
    response.headers.forEach((value, key) => {
      ctx.append(key, value)
    })
    ctx.body = response.body
  })

  app.use(router.routes()).use(router.allowedMethods())

  return app
}
