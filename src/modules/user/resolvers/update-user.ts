import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  type GraphQLFieldConfig,
} from 'graphql'
import type { GraphQLContext } from '../../../context.ts'
import type { NewUser } from '../../../db/models/user.ts'
import { hashPassword } from '../../auth/password.ts'
import {
  emailAlreadyInUseError,
  isDuplicateKeyError,
  userNotFoundError,
} from '../errors.ts'
import { updateUser as updateUserRecord } from '../repositories/update-user.ts'
import { UserType } from '../type.ts'
import { validateUserInput } from '../validation.ts'

type UpdateUserArgs = {
  id: string
  input: {
    name?: string | null
    email?: string | null
    password?: string | null
  }
}

const UpdateUserInputType = new GraphQLInputObjectType({
  name: 'UpdateUserInput',
  fields: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
})

export const updateUser: GraphQLFieldConfig<
  unknown,
  GraphQLContext,
  UpdateUserArgs
> = {
  type: new GraphQLNonNull(UserType),
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    input: { type: new GraphQLNonNull(UpdateUserInputType) },
  },
  resolve: async (_parent, { id, input }, { db }) => {
    validateUserInput(input)

    const values: Partial<NewUser> = {}

    if (input.name) {
      values.name = input.name
    }

    if (input.email) {
      values.email = input.email
    }

    if (input.password) {
      values.password = await hashPassword(input.password)
    }

    try {
      const user = await updateUserRecord(db, id, values)

      if (!user) {
        throw userNotFoundError()
      }

      return user
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw emailAlreadyInUseError()
      }

      throw error
    }
  },
}
