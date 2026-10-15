import { GraphQLObjectType } from 'graphql'
import type { GraphQLContext } from '../context.ts'
import { login } from '../modules/auth/resolvers/login.ts'
import { createUser } from '../modules/user/resolvers/create-user.ts'
import { deleteUser } from '../modules/user/resolvers/delete-user.ts'
import { updateUser } from '../modules/user/resolvers/update-user.ts'

export const MutationType = new GraphQLObjectType<unknown, GraphQLContext>({
  name: 'Mutation',
  fields: {
    login,
    createUser,
    updateUser,
    deleteUser,
  },
})
