import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestDb } from '../../../helpers.ts'
import { getUserByEmailWithPassword } from '../../../../src/modules/user/repositories/get-user-by-email-with-password.ts'
import { insertUser } from '../../../../src/modules/user/repositories/insert-user.ts'

describe('getUserByEmailWithPassword', () => {
  it('finds the user ignoring email case and includes the password', async () => {
    const db = await setupTestDb()
    await insertUser(db, { name: 'Ada', email: 'ada@example.com', password: 'hashed' })

    const user = await getUserByEmailWithPassword(db, ' ADA@example.com')

    assert.equal(user?.name, 'Ada')
    assert.equal(user?.password, 'hashed')
  })

  it('returns null for an unknown email', async () => {
    const db = await setupTestDb()

    assert.equal(await getUserByEmailWithPassword(db, 'ghost@example.com'), null)
  })
})
