import { GraphQLSchema } from 'graphql'
import { QueryType } from './query.ts'

export const schema = new GraphQLSchema({
  query: QueryType,
})
