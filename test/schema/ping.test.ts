import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { setupTestApp } from '../helpers.ts'

describe('ping', () => {
  it('answers pong through the koa graphql endpoint', async () => {
    const { gql } = await setupTestApp()

    const result = await gql<{ ping: string }>('{ ping }')

    assert.equal(result.errors, undefined)
    assert.equal(result.data?.ping, 'pong')
  })
})
