import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { signToken, verifyToken } from '../../../src/modules/auth/token.ts'

const config = { jwtSecret: 'test-secret' }

describe('token', () => {
  it('signs a token whose subject is the user id', () => {
    const token = signToken('user-id', config)

    assert.equal(verifyToken(token, config), 'user-id')
  })

  it('rejects a token signed with another secret', () => {
    const token = signToken('user-id', { jwtSecret: 'other-secret' })

    assert.equal(verifyToken(token, config), null)
  })

  it('rejects an expired token', () => {
    const token = signToken('user-id', { ...config, jwtExpiresIn: -1 })

    assert.equal(verifyToken(token, config), null)
  })

  it('rejects garbage', () => {
    assert.equal(verifyToken('not.a.token', config), null)
  })
})
