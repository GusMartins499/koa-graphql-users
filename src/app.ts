import { Router } from '@koa/router'
import Koa from 'koa'
import { createGraphQLHandler } from './yoga.ts'

export const createApp = () => {
  const app = new Koa()
  const router = new Router()
  const yoga = createGraphQLHandler()

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
