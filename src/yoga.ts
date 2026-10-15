import type { Context } from 'koa'
import { createYoga } from 'graphql-yoga'
import type { GraphQLContext } from './context.ts'
import { schema } from './schema/schema.ts'

export const createGraphQLHandler = () =>
  createYoga<{ ctx: Context }, GraphQLContext>({
    schema,
    graphqlEndpoint: '/graphql',
    context: () => ({}),
  })
