import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFieldConfigMap,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { GQLContext } from './types.js';
import { UserType } from './user.js';
import { PostType } from './post.js';
import {
  CreateUserArgs,
  UpdateUserArgs,
  CreatePostArgs,
  UpdatePostArgs,
} from './interfaces.js';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: (): GraphQLFieldConfigMap<unknown, GQLContext> => ({
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_root, args: CreateUserArgs, ctx) =>
        ctx.prisma.user.create({
          data: {
            ...args,
            balance: 0,
          },
        }),
    },

    updateUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        email: { type: GraphQLString },
        name: { type: GraphQLString },
      },
      resolve: (_root, { id, ...data }: UpdateUserArgs, ctx) =>
        ctx.prisma.user.update({
          where: { id },
          data,
        }),
    },

    deleteUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_root, args: { id: string }, ctx) =>
        ctx.prisma.user.delete({ where: { id: args.id } }),
    },

    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLString },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_root, args: CreatePostArgs, ctx) =>
        ctx.prisma.post.create({ data: args }),
    },

    updatePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
      },
      resolve: (_root, { id, ...data }: UpdatePostArgs, ctx) =>
        ctx.prisma.post.update({
          where: { id },
          data,
        }),
    },

    deletePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_root, args: { id: string }, ctx) =>
        ctx.prisma.post.delete({ where: { id: args.id } }),
    },
  }),
});
