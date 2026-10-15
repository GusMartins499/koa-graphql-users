export type UserPayload = {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export const USER_FIELDS = /* GraphQL */ `
  fragment UserFields on User {
    id
    name
    email
    createdAt
    updatedAt
  }
`

export const CREATE_USER = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`

export const USERS = /* GraphQL */ `
  query Users {
    users {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`

export const adaInput = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  password: 'analytical-engine',
}
