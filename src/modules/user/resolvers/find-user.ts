import { GraphQLID, GraphQLNonNull, type GraphQLFieldConfig } from 'graphql'
import type { GraphQLContext } from '../../../context.ts'
import { getUserById } from '../repositories/get-user-by-id.ts'
import { UserType } from '../type.ts'

type FindUserArgs = {
  id: string
}

export const user: GraphQLFieldConfig<unknown, GraphQLContext, FindUserArgs> = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: (_parent, { id }, { db }) => getUserById(db, id),
}
