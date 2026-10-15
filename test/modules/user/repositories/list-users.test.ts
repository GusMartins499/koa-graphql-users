import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestDb } from '../../../helpers.ts'
import { insertUser } from '../../../../src/modules/user/repositories/insert-user.ts'
import { listUsers } from '../../../../src/modules/user/repositories/list-users.ts'

describe('listUsers', () => {
  it('returns the users newest first', async () => {
    const db = await setupTestDb()
    await insertUser(db, { name: 'Ada', email: 'ada@example.com', password: 'hashed' })
    await insertUser(db, { name: 'Alan', email: 'alan@example.com', password: 'hashed' })

    const users = await listUsers(db)

    assert.deepEqual(
      users.map((user) => user.name),
      ['Alan', 'Ada'],
    )
  })
})
