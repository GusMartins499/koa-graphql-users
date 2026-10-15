import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestDb } from '../../../helpers.ts'
import { getUserById } from '../../../../src/modules/user/repositories/get-user-by-id.ts'
import { insertUser } from '../../../../src/modules/user/repositories/insert-user.ts'

describe('getUserById', () => {
  it('returns the user without the password', async () => {
    const db = await setupTestDb()
    const inserted = await insertUser(db, {
      name: 'Ada',
      email: 'ada@example.com',
      password: 'hashed',
    })

    const user = await getUserById(db, inserted._id.toString())

    assert.equal(user?.email, 'ada@example.com')
    assert.equal(user && 'password' in user, false)
  })

  it('returns null for an unknown id', async () => {
    const db = await setupTestDb()

    assert.equal(await getUserById(db, '507f1f77bcf86cd799439011'), null)
  })

  it('returns null for a malformed id', async () => {
    const db = await setupTestDb()

    assert.equal(await getUserById(db, 'not-an-object-id'), null)
  })
})
