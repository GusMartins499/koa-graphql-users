import type { AppConfig } from './config.ts'
import type { Db } from './db/connection.ts'

export type GraphQLContext = {
  db: Db
  config: AppConfig
}
