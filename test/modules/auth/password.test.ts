import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  hashPassword,
  verifyPassword,
} from '../../../src/modules/auth/password.ts'

describe('password', () => {
  it('hashes with a random salt so the same password yields different hashes', async () => {
    const first = await hashPassword('s3cret-pass')
    const second = await hashPassword('s3cret-pass')

    assert.notEqual(first, second)
    assert.equal(first.includes('s3cret-pass'), false)
  })

  it('verifies the right password and rejects a wrong one', async () => {
    const hash = await hashPassword('s3cret-pass')

    assert.equal(await verifyPassword('s3cret-pass', hash), true)
    assert.equal(await verifyPassword('wrong-pass', hash), false)
  })

  it('rejects a malformed hash', async () => {
    assert.equal(await verifyPassword('s3cret-pass', 'garbage'), false)
  })
})
