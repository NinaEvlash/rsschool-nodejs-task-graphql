import { GraphQLSchema } from 'graphql';

export function createSchema(): GraphQLSchema {
  return new GraphQLSchema({
    /*query: QueryType,
    mutation: MutationType,*/
  });
}
