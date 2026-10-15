import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  type GraphQLFieldConfig,
} from 'graphql'
import type { GraphQLContext } from '../../../context.ts'
import { userNotFoundError } from '../errors.ts'
import { deleteUser as deleteUserRecord } from '../repositories/delete-user.ts'

type DeleteUserArgs = {
  id: string
}

export const deleteUser: GraphQLFieldConfig<
  unknown,
  GraphQLContext,
  DeleteUserArgs
> = {
  type: new GraphQLNonNull(GraphQLBoolean),
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_parent, { id }, { db }) => {
    if (!(await deleteUserRecord(db, id))) {
      throw userNotFoundError()
    }

    return true
  },
}
