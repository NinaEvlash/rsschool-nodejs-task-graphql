import { Post } from '@prisma/client';
import {
  GraphQLFieldConfigMap,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import { GQLContext } from './types.js';
import { UserType } from './user.js';

export const PostType = new GraphQLObjectType<Post, GQLContext>({
  name: 'Post',
  fields: (): GraphQLFieldConfigMap<Post, GQLContext> => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLString },

    author: {
      type: UserType,
      resolve: (parent, _args, ctx) =>
        ctx.prisma.user.findUnique({ where: { id: parent.authorId } }),
    },
  }),
});
