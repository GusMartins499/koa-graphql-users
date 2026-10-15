import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestApp } from '../../../helpers.ts'
import { adaInput, CREATE_USER, USERS, type UserPayload } from '../fixtures.ts'

const DELETE_USER = /* GraphQL */ `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`

describe('deleteUser', () => {
  it('deletes the user', async () => {
    const { gql } = await setupTestApp()
    const created = await gql<{ createUser: UserPayload }>(CREATE_USER, {
      input: adaInput,
    })

    const result = await gql<{ deleteUser: boolean }>(DELETE_USER, {
      id: created.data?.createUser.id,
    })
    const list = await gql<{ users: UserPayload[] }>(USERS)

    assert.equal(result.data?.deleteUser, true)
    assert.equal(list.data?.users.length, 0)
  })

  it('for an unknown id, returns USER_NOT_FOUND', async () => {
    const { gql } = await setupTestApp()

    const result = await gql(DELETE_USER, { id: '507f1f77bcf86cd799439011' })

    assert.equal(result.errors?.[0]?.extensions?.code, 'USER_NOT_FOUND')
  })
})
