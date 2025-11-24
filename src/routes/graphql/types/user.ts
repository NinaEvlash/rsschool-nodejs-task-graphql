import { User } from '@prisma/client';
import {
  GraphQLFieldConfigMap,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
} from 'graphql';
import { GQLContext } from './types.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';

export const UserType = new GraphQLObjectType<User, GQLContext>({
  name: 'User',
  fields: (): GraphQLFieldConfigMap<User, GQLContext> => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    profile: {
      type: ProfileType,
      resolve: (parent, _args, ctx) =>
        ctx.prisma.profile.findUnique({
          where: { userId: parent.id },
        }),
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: (parent, _args, ctx) =>
        ctx.prisma.post.findMany({
          where: { authorId: parent.id },
        }),
    },

    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, _args, ctx: GQLContext) => {
        const subscriptions = await ctx.prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: parent.id },
          include: { author: true },
        });

        return subscriptions.map((sub) => sub.author);
      },
    },

    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, _args, ctx: GQLContext) => {
        const subscriptions = await ctx.prisma.subscribersOnAuthors.findMany({
          where: { authorId: parent.id },
          include: { subscriber: true },
        });

        return subscriptions.map((sub) => sub.subscriber);
      },
    },
  }),
});
