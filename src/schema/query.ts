import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import type { GraphQLContext } from '../context.ts'
import { user } from '../modules/user/resolvers/find-user.ts'
import { users } from '../modules/user/resolvers/list-users.ts'

export const QueryType = new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'Query',
  fields: {
    ping: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: () => 'pong',
    },
    users,
    user,
  },
})
