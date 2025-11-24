import { MemberType } from '@prisma/client';
import { GraphQLObjectType, GraphQLNonNull, GraphQLFloat, GraphQLInt } from 'graphql';
import { GQLContext } from './types.js';
import { MemberTypeIdType } from './memberTypeId.js';

export const MemberTypeType = new GraphQLObjectType<MemberType, GQLContext>({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdType) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});
