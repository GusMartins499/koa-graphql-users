import { GraphQLList, GraphQLNonNull, type GraphQLFieldConfig } from 'graphql'
import type { GraphQLContext } from '../../../context.ts'
import { listUsers } from '../repositories/list-users.ts'
import { UserType } from '../type.ts'

export const users: GraphQLFieldConfig<unknown, GraphQLContext> = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
  resolve: (_parent, _args, { db }) => listUsers(db),
}
