import { GraphQLError } from 'graphql'

export const invalidCredentialsError = () =>
  new GraphQLError('Invalid email or password', {
    extensions: { code: 'INVALID_CREDENTIALS' },
  })
