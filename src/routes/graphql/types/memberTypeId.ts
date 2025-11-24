import { GraphQLEnumType } from 'graphql';

export const MemberTypeIdType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    PREMIUM: { value: 'PREMIUM' },
  },
});
