import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFieldConfigMap,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { GQLContext } from './types.js';
import { UserType } from './user.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import { MemberTypeType } from './memberType.js';
import { MemberTypeIdType } from './memberTypeId.js';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: (): GraphQLFieldConfigMap<unknown, GQLContext> => ({
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (_root, _args, ctx) => ctx.prisma.user.findMany(),
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_root, args: { id: string }, ctx) =>
        ctx.prisma.user.findUnique({ where: { id: args.id } }),
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: (_root, _args, ctx) => ctx.prisma.post.findMany(),
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_root, args: { id: string }, ctx) =>
        ctx.prisma.post.findUnique({ where: { id: args.id } }),
    },

    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: (_root, _args, ctx) => ctx.prisma.profile.findMany(),
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_root, args: { id: string }, ctx) =>
        ctx.prisma.profile.findUnique({ where: { id: args.id } }),
    },

    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeType))),
      resolve: (_root, _args, ctx) => ctx.prisma.memberType.findMany(),
    },
    memberType: {
      type: MemberTypeType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdType) },
      },
      resolve: (_root, args: { id: string }, ctx: GQLContext) =>
        ctx.prisma.memberType.findUnique({ where: { id: args.id } }),
    },
  }),
});
