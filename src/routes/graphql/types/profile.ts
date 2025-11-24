import { Profile } from '@prisma/client';
import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { GQLContext } from './types.js';
import { MemberTypeType } from './memberType.js';

export const ProfileType = new GraphQLObjectType<Profile, GQLContext>({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },

    memberType: {
      type: MemberTypeType,
      resolve: (parent, _args, ctx: GQLContext) =>
        ctx.prisma.memberType.findUnique({
          where: { id: parent.memberTypeId },
        }),
    },
  }),
});
