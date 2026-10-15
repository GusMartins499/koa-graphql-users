import jwt from 'jsonwebtoken'
import type { AppConfig } from '../../config.ts'

const DEFAULT_EXPIRES_IN_SECONDS = 60 * 60

export const signToken = (userId: string, config: AppConfig): string =>
  jwt.sign({}, config.jwtSecret, {
    subject: userId,
    algorithm: 'HS256',
    expiresIn: config.jwtExpiresIn ?? DEFAULT_EXPIRES_IN_SECONDS,
  })

export const verifyToken = (token: string, config: AppConfig): string | null => {
  try {
    const payload = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
    })

    return typeof payload === 'object' && payload.sub ? payload.sub : null
  } catch {
    return null
  }
}
