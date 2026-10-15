import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import type { GraphQLContext } from '../context.ts'

export const QueryType = new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'Query',
  fields: {
    ping: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: () => 'pong',
    },
  },
})
