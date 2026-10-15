import { invalidUserInputError } from './errors.ts'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

type UserInput = {
  name?: string | null
  email?: string | null
  password?: string | null
}

export const validateUserInput = (input: UserInput) => {
  if (input.name !== undefined && !input.name?.trim()) {
    throw invalidUserInputError('Name must not be empty')
  }

  if (input.email !== undefined && !EMAIL_PATTERN.test(input.email?.trim() ?? '')) {
    throw invalidUserInputError('Email is invalid')
  }

  if (
    input.password !== undefined &&
    (input.password?.length ?? 0) < MIN_PASSWORD_LENGTH
  ) {
    throw invalidUserInputError(
      `Password must have at least ${MIN_PASSWORD_LENGTH} characters`,
    )
  }
}
