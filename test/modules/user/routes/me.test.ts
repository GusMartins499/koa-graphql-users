import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestApp, testConfig } from '../../../helpers.ts'
import { signToken } from '../../../../src/modules/auth/token.ts'
import { adaInput, CREATE_USER, type UserPayload } from '../fixtures.ts'

const LOGIN = /* GraphQL */ `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
    }
  }
`

const setupLoggedInUser = async () => {
  const app = await setupTestApp()
  const created = await app.gql<{ createUser: UserPayload }>(CREATE_USER, {
    input: adaInput,
  })
  const login = await app.gql<{ login: { token: string } }>(LOGIN, {
    input: { email: adaInput.email, password: adaInput.password },
  })

  return {
    ...app,
    user: created.data?.createUser,
    token: login.data?.login.token ?? '',
  }
}

describe('GET /me', () => {
  it('returns the authenticated user without the password', async () => {
    const { baseUrl, token, user } = await setupLoggedInUser()

    const response = await fetch(`${baseUrl}/me`, {
      headers: { authorization: `Bearer ${token}` },
    })
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.deepEqual(body, user)
  })

  it('without a token, returns 401', async () => {
    const { baseUrl } = await setupTestApp()

    const response = await fetch(`${baseUrl}/me`)

    assert.equal(response.status, 401)
    assert.equal(response.headers.get('www-authenticate'), 'Bearer')
  })

  it('with an invalid token, returns 401', async () => {
    const { baseUrl } = await setupTestApp()

    const response = await fetch(`${baseUrl}/me`, {
      headers: { authorization: 'Bearer not.a.token' },
    })

    assert.equal(response.status, 401)
  })

  it('with a token signed by another secret, returns 401', async () => {
    const { baseUrl, user } = await setupLoggedInUser()
    const forged = signToken(user?.id ?? '', { jwtSecret: 'attacker-secret' })

    const response = await fetch(`${baseUrl}/me`, {
      headers: { authorization: `Bearer ${forged}` },
    })

    assert.equal(response.status, 401)
  })

  it('with a valid token for a deleted user, returns 401', async () => {
    const { baseUrl, gql, token, user } = await setupLoggedInUser()
    await gql('mutation ($id: ID!) { deleteUser(id: $id) }', { id: user?.id })

    const response = await fetch(`${baseUrl}/me`, {
      headers: { authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 401)
  })

  it('with a valid token for a non existing user id, returns 401', async () => {
    const { baseUrl } = await setupTestApp()
    const token = signToken('507f1f77bcf86cd799439011', testConfig)

    const response = await fetch(`${baseUrl}/me`, {
      headers: { authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 401)
  })
})
