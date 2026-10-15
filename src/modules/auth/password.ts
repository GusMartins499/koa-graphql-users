import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>

const KEY_LENGTH = 64

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString('hex')
  const key = await scryptAsync(password, salt, KEY_LENGTH)

  return `${salt}:${key.toString('hex')}`
}

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const [salt, key] = hash.split(':')

  if (!salt || !key) {
    return false
  }

  const expected = Buffer.from(key, 'hex')
  const actual = await scryptAsync(password, salt, expected.length)

  return expected.length === actual.length && timingSafeEqual(expected, actual)
}
