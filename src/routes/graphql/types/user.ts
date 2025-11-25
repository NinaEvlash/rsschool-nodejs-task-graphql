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
      resolve: (parent, _args, ctx) => {
        return ctx.loaders.profileByUserId.load(parent.id);
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: (parent, _args, ctx) => {
        return ctx.loaders.postsByAuthorId.load(parent.id);
      },
    },

    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (parent, _args, ctx) => {
        return ctx.loaders.userSubscribedTo.load(parent.id);
      },
    },

    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (parent, _args, ctx) => {
        return ctx.loaders.subscribedToUser.load(parent.id);
      },
    },
  }),
});
