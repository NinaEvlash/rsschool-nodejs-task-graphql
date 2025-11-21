import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFieldConfigMap,
} from 'graphql';

import { UUIDType } from './uuid.js';
import { GQLContext, UserSource } from './types.js';
import { PostType } from './post.js';

export const UserType = new GraphQLObjectType<UserSource, GQLContext>({
  name: 'User',
  fields: (): GraphQLFieldConfigMap<UserSource, GQLContext> => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: (parent, _args, ctx) => {
        return ctx.prisma.post.findMany({
          where: { authorId: parent.id },
        });
      },
    },
  }),
});
