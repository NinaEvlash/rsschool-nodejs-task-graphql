import { GraphQLSchema } from 'graphql';
import { QueryType } from './types/query.js';

export function createSchema(): GraphQLSchema {
  return new GraphQLSchema({
    query: QueryType,
    /*mutation: MutationType,*/
  });
}
