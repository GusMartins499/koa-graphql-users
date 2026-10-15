import type { Context } from 'koa'
import { createYoga } from 'graphql-yoga'
import type { AppConfig } from './config.ts'
import type { GraphQLContext } from './context.ts'
import type { Db } from './db/connection.ts'
import { schema } from './schema/schema.ts'

export const createGraphQLHandler = (db: Db, config: AppConfig) =>
  createYoga<{ ctx: Context }, GraphQLContext>({
    schema,
    graphqlEndpoint: '/graphql',
    context: () => ({ db, config }),
  })
