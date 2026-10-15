import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestDb } from '../../../helpers.ts'
import { insertUser } from '../../../../src/modules/user/repositories/insert-user.ts'
import { updateUser } from '../../../../src/modules/user/repositories/update-user.ts'

describe('updateUser', () => {
  it('updates only the given fields and returns the updated user', async () => {
    const db = await setupTestDb()
    const inserted = await insertUser(db, {
      name: 'Ada',
      email: 'ada@example.com',
      password: 'hashed',
    })

    const user = await updateUser(db, inserted._id.toString(), { name: 'Ada Lovelace' })

    assert.equal(user?.name, 'Ada Lovelace')
    assert.equal(user?.email, 'ada@example.com')
  })

  it('returns null for an unknown or malformed id', async () => {
    const db = await setupTestDb()

    assert.equal(await updateUser(db, '507f1f77bcf86cd799439011', { name: 'X' }), null)
    assert.equal(await updateUser(db, 'not-an-object-id', { name: 'X' }), null)
  })
})
