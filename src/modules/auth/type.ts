import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import type { GraphQLContext } from '../../context.ts'
import type { User } from '../../db/models/user.ts'
import { UserType } from '../user/type.ts'

export type AuthPayload = {
  token: string
  user: User
}

export const AuthPayloadType = new GraphQLObjectType<AuthPayload, GraphQLContext>({
  name: 'AuthPayload',
  fields: {
    token: { type: new GraphQLNonNull(GraphQLString) },
    user: { type: new GraphQLNonNull(UserType) },
  },
})
