import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestDb } from '../../../helpers.ts'
import { deleteUser } from '../../../../src/modules/user/repositories/delete-user.ts'
import { getUserById } from '../../../../src/modules/user/repositories/get-user-by-id.ts'
import { insertUser } from '../../../../src/modules/user/repositories/insert-user.ts'

describe('deleteUser', () => {
  it('deletes the user and returns true', async () => {
    const db = await setupTestDb()
    const inserted = await insertUser(db, {
      name: 'Ada',
      email: 'ada@example.com',
      password: 'hashed',
    })
    const id = inserted._id.toString()

    assert.equal(await deleteUser(db, id), true)
    assert.equal(await getUserById(db, id), null)
  })

  it('returns false for an unknown or malformed id', async () => {
    const db = await setupTestDb()

    assert.equal(await deleteUser(db, '507f1f77bcf86cd799439011'), false)
    assert.equal(await deleteUser(db, 'not-an-object-id'), false)
  })
})
