import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestDb } from '../../../helpers.ts'
import { insertUser } from '../../../../src/modules/user/repositories/insert-user.ts'

describe('insertUser', () => {
  it('inserts the user and returns it with id and timestamps, without the password', async () => {
    const db = await setupTestDb()

    const user = await insertUser(db, {
      name: 'Ada Lovelace',
      email: 'ADA@Example.com ',
      password: 'hashed',
    })

    assert.ok(user._id)
    assert.equal(user.name, 'Ada Lovelace')
    assert.equal(user.email, 'ada@example.com')
    assert.ok(user.createdAt instanceof Date)
    assert.equal('password' in user, false)
  })

  it('rejects a second user with the same email', async () => {
    const db = await setupTestDb()
    const values = { name: 'Ada', email: 'ada@example.com', password: 'hashed' }

    await insertUser(db, values)

    await assert.rejects(insertUser(db, values), { code: 11000 })
  })
})
