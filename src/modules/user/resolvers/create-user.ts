import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  type GraphQLFieldConfig,
} from 'graphql'
import type { GraphQLContext } from '../../../context.ts'
import { hashPassword } from '../../auth/password.ts'
import { emailAlreadyInUseError, isDuplicateKeyError } from '../errors.ts'
import { insertUser } from '../repositories/insert-user.ts'
import { UserType } from '../type.ts'
import { validateUserInput } from '../validation.ts'

type CreateUserArgs = {
  input: {
    name: string
    email: string
    password: string
  }
}

const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
})

export const createUser: GraphQLFieldConfig<
  unknown,
  GraphQLContext,
  CreateUserArgs
> = {
  type: new GraphQLNonNull(UserType),
  args: {
    input: { type: new GraphQLNonNull(CreateUserInputType) },
  },
  resolve: async (_parent, { input }, { db }) => {
    validateUserInput(input)

    try {
      return await insertUser(db, {
        name: input.name,
        email: input.email,
        password: await hashPassword(input.password),
      })
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw emailAlreadyInUseError()
      }

      throw error
    }
  },
}
