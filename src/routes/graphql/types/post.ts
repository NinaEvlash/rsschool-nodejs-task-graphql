import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFieldConfigMap,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { GQLContext, PostSource } from './types.js';
import { UserType } from './user.js';

export const PostType = new GraphQLObjectType<PostSource, GQLContext>({
  name: 'Post',
  fields: (): GraphQLFieldConfigMap<PostSource, GQLContext> => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLString },
    author: {
      type: new GraphQLNonNull(UserType),
      resolve: (parent, _args, ctx) => {
        return ctx.prisma.user.findUnique({
          where: { id: parent.authorId },
        });
      },
    },
  }),
});
