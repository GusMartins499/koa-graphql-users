import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestApp } from '../../../helpers.ts'
import { verifyPassword } from '../../../../src/modules/auth/password.ts'
import { getUserByEmailWithPassword } from '../../../../src/modules/user/repositories/get-user-by-email-with-password.ts'
import { adaInput, CREATE_USER, USER_FIELDS, type UserPayload } from '../fixtures.ts'

const UPDATE_USER = /* GraphQL */ `
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`

describe('updateUser', () => {
  it('updates only the given fields', async () => {
    const { gql } = await setupTestApp()
    const created = await gql<{ createUser: UserPayload }>(CREATE_USER, {
      input: adaInput,
    })

    const result = await gql<{ updateUser: UserPayload }>(UPDATE_USER, {
      id: created.data?.createUser.id,
      input: { name: 'Augusta Ada King' },
    })

    assert.equal(result.errors, undefined)
    assert.equal(result.data?.updateUser.name, 'Augusta Ada King')
    assert.equal(result.data?.updateUser.email, adaInput.email)
  })

  it('stores a new password hashed', async () => {
    const { db, gql } = await setupTestApp()
    const created = await gql<{ createUser: UserPayload }>(CREATE_USER, {
      input: adaInput,
    })

    await gql(UPDATE_USER, {
      id: created.data?.createUser.id,
      input: { password: 'difference-engine' },
    })
    const stored = await getUserByEmailWithPassword(db, adaInput.email)

    assert.equal(await verifyPassword('difference-engine', stored?.password ?? ''), true)
  })

  it('with an email already used by another user, returns EMAIL_ALREADY_IN_USE', async () => {
    const { gql } = await setupTestApp()
    await gql(CREATE_USER, { input: adaInput })
    const alan = await gql<{ createUser: UserPayload }>(CREATE_USER, {
      input: { name: 'Alan Turing', email: 'alan@example.com', password: 'enigma-machine' },
    })

    const result = await gql(UPDATE_USER, {
      id: alan.data?.createUser.id,
      input: { email: adaInput.email },
    })

    assert.equal(result.errors?.[0]?.extensions?.code, 'EMAIL_ALREADY_IN_USE')
  })

  it('with invalid input, returns BAD_USER_INPUT', async () => {
    const { gql } = await setupTestApp()
    const created = await gql<{ createUser: UserPayload }>(CREATE_USER, {
      input: adaInput,
    })

    const result = await gql(UPDATE_USER, {
      id: created.data?.createUser.id,
      input: { password: 'short' },
    })

    assert.equal(result.errors?.[0]?.extensions?.code, 'BAD_USER_INPUT')
  })

  it('for an unknown id, returns USER_NOT_FOUND', async () => {
    const { gql } = await setupTestApp()

    const result = await gql(UPDATE_USER, {
      id: '507f1f77bcf86cd799439011',
      input: { name: 'Nobody' },
    })

    assert.equal(result.data, null)
    assert.equal(result.errors?.[0]?.extensions?.code, 'USER_NOT_FOUND')
  })
})
