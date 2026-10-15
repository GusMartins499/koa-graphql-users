import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestApp, testConfig } from '../../../helpers.ts'
import { verifyToken } from '../../../../src/modules/auth/token.ts'
import { adaInput, CREATE_USER, type UserPayload } from '../../user/fixtures.ts'

const LOGIN = /* GraphQL */ `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
      }
    }
  }
`

type LoginPayload = {
  login: { token: string; user: { id: string; email: string } }
}

describe('login', () => {
  it('returns a token for the user with valid credentials', async () => {
    const { gql } = await setupTestApp()
    const created = await gql<{ createUser: UserPayload }>(CREATE_USER, {
      input: adaInput,
    })

    const result = await gql<LoginPayload>(LOGIN, {
      input: { email: 'ADA@example.com', password: adaInput.password },
    })

    assert.equal(result.errors, undefined)
    assert.equal(result.data?.login.user.id, created.data?.createUser.id)
    assert.equal(
      verifyToken(result.data?.login.token ?? '', testConfig),
      created.data?.createUser.id,
    )
  })

  it('with a wrong password or an unknown email, returns the same INVALID_CREDENTIALS error', async () => {
    const { gql } = await setupTestApp()
    await gql(CREATE_USER, { input: adaInput })

    const wrongPassword = await gql(LOGIN, {
      input: { email: adaInput.email, password: 'wrong-password' },
    })
    const unknownEmail = await gql(LOGIN, {
      input: { email: 'ghost@example.com', password: adaInput.password },
    })

    assert.equal(wrongPassword.data, null)
    assert.equal(wrongPassword.errors?.[0]?.extensions?.code, 'INVALID_CREDENTIALS')
    assert.deepEqual(unknownEmail.errors, wrongPassword.errors)
  })
})
