import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestApp } from '../../../helpers.ts'
import { adaInput, CREATE_USER, USER_FIELDS, type UserPayload } from '../fixtures.ts'

const USER = /* GraphQL */ `
  query User($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`

describe('user', () => {
  it('returns the user by id', async () => {
    const { gql } = await setupTestApp()
    const created = await gql<{ createUser: UserPayload }>(CREATE_USER, {
      input: adaInput,
    })

    const result = await gql<{ user: UserPayload }>(USER, {
      id: created.data?.createUser.id,
    })

    assert.deepEqual(result.data?.user, created.data?.createUser)
  })

  it('returns null for an unknown or malformed id', async () => {
    const { gql } = await setupTestApp()

    const unknown = await gql<{ user: UserPayload | null }>(USER, {
      id: '507f1f77bcf86cd799439011',
    })
    const malformed = await gql<{ user: UserPayload | null }>(USER, { id: 'nope' })

    assert.equal(unknown.errors, undefined)
    assert.equal(unknown.data?.user, null)
    assert.equal(malformed.errors, undefined)
    assert.equal(malformed.data?.user, null)
  })
})
