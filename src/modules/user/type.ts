import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import type { GraphQLContext } from '../../context.ts'
import type { User } from '../../db/models/user.ts'

export const UserType = new GraphQLObjectType<User, GraphQLContext>({
  name: 'User',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (user) => user._id.toString(),
    },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.createdAt.toISOString(),
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (user) => user.updatedAt.toISOString(),
    },
  },
})
