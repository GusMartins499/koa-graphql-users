import { GraphQLError } from 'graphql'

export const emailAlreadyInUseError = () =>
  new GraphQLError('This email is already in use', {
    extensions: { code: 'EMAIL_ALREADY_IN_USE' },
  })

export const userNotFoundError = () =>
  new GraphQLError('User not found', {
    extensions: { code: 'USER_NOT_FOUND' },
  })

export const invalidUserInputError = (message: string) =>
  new GraphQLError(message, {
    extensions: { code: 'BAD_USER_INPUT' },
  })

export const isDuplicateKeyError = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  error.code === 11000
