import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  type GraphQLFieldConfig,
} from 'graphql'
import type { GraphQLContext } from '../../../context.ts'
import { getUserByEmailWithPassword } from '../../user/repositories/get-user-by-email-with-password.ts'
import { invalidCredentialsError } from '../errors.ts'
import { verifyPassword } from '../password.ts'
import { signToken } from '../token.ts'
import { AuthPayloadType, type AuthPayload } from '../type.ts'

type LoginArgs = {
  input: {
    email: string
    password: string
  }
}

const LoginInputType = new GraphQLInputObjectType({
  name: 'LoginInput',
  fields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
})

export const login: GraphQLFieldConfig<unknown, GraphQLContext, LoginArgs> = {
  type: new GraphQLNonNull(AuthPayloadType),
  args: {
    input: { type: new GraphQLNonNull(LoginInputType) },
  },
  resolve: async (_parent, { input }, { db, config }): Promise<AuthPayload> => {
    const found = await getUserByEmailWithPassword(db, input.email)

    if (!found || !(await verifyPassword(input.password, found.password))) {
      throw invalidCredentialsError()
    }

    const { password: _password, ...user } = found

    return { token: signToken(user._id.toString(), config), user }
  },
}
