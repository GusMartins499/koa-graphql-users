import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestApp } from '../../../helpers.ts'
import { verifyPassword } from '../../../../src/modules/auth/password.ts'
import { getUserByEmailWithPassword } from '../../../../src/modules/user/repositories/get-user-by-email-with-password.ts'
import { adaInput, CREATE_USER, USERS, type UserPayload } from '../fixtures.ts'

describe('createUser', () => {
  it('creates a user and never exposes the password', async () => {
    const { gql } = await setupTestApp()

    const result = await gql<{ createUser: UserPayload }>(CREATE_USER, {
      input: adaInput,
    })

    assert.equal(result.errors, undefined)
    assert.ok(result.data?.createUser.id)
    assert.equal(result.data?.createUser.name, 'Ada Lovelace')
    assert.equal(result.data?.createUser.email, 'ada@example.com')
    assert.equal('password' in (result.data?.createUser ?? {}), false)
  })

  it('stores the password hashed', async () => {
    const { db, gql } = await setupTestApp()

    await gql(CREATE_USER, { input: adaInput })
    const stored = await getUserByEmailWithPassword(db, adaInput.email)

    assert.notEqual(stored?.password, adaInput.password)
    assert.equal(await verifyPassword(adaInput.password, stored?.password ?? ''), true)
  })

  it('with an email already in use, returns an error and creates nothing', async () => {
    const { gql } = await setupTestApp()

    await gql(CREATE_USER, { input: adaInput })
    const second = await gql<{ createUser: UserPayload }>(CREATE_USER, {
      input: { ...adaInput, email: 'ADA@example.com' },
    })
    const list = await gql<{ users: UserPayload[] }>(USERS)

    assert.equal(second.data, null)
    assert.equal(second.errors?.[0]?.extensions?.code, 'EMAIL_ALREADY_IN_USE')
    assert.equal(list.data?.users.length, 1)
  })

  it('with an invalid email, a short password or an empty name, returns BAD_USER_INPUT', async () => {
    const { gql } = await setupTestApp()

    const invalidInputs = [
      { ...adaInput, email: 'not-an-email' },
      { ...adaInput, password: 'short' },
      { ...adaInput, name: '   ' },
    ]

    const results = await Promise.all(
      invalidInputs.map((input) => gql(CREATE_USER, { input })),
    )

    for (const result of results) {
      assert.equal(result.errors?.[0]?.extensions?.code, 'BAD_USER_INPUT')
    }

    const list = await gql<{ users: UserPayload[] }>(USERS)
    assert.equal(list.data?.users.length, 0)
  })
})
