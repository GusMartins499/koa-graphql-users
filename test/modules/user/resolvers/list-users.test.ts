import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestApp } from '../../../helpers.ts'
import { adaInput, CREATE_USER, USERS, type UserPayload } from '../fixtures.ts'

describe('users', () => {
  it('returns an empty list when there are no users', async () => {
    const { gql } = await setupTestApp()

    const result = await gql<{ users: UserPayload[] }>(USERS)

    assert.deepEqual(result.data?.users, [])
  })

  it('returns the created users newest first', async () => {
    const { gql } = await setupTestApp()

    await gql(CREATE_USER, { input: adaInput })
    await gql(CREATE_USER, {
      input: { name: 'Alan Turing', email: 'alan@example.com', password: 'enigma-machine' },
    })
    const result = await gql<{ users: UserPayload[] }>(USERS)

    assert.deepEqual(
      result.data?.users.map((user) => user.name),
      ['Alan Turing', 'Ada Lovelace'],
    )
  })
})
