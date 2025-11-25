import { GraphQLResolveInfo } from 'graphql';
import { GQLContext } from './types.js';
import { User } from '@prisma/client';
import { fieldInQuery } from '../utils/utils.js';

interface UserSubscribedToRelation {
  authorId: string;
  subscriberId: string;
}

interface UserWithRelations extends User {
  userSubscribedTo?: UserSubscribedToRelation[];
  subscribedToUser?: UserSubscribedToRelation[];
}

export const usersResolver = async (
  _parent: unknown,
  _args: unknown,
  ctx: GQLContext,
  info: GraphQLResolveInfo,
) => {
  const needUserSubscribedTo = fieldInQuery(info, 'User', 'userSubscribedTo');
  const needSubscribedToUser = fieldInQuery(info, 'User', 'subscribedToUser');

  const include: Record<string, boolean> = {};

  if (needUserSubscribedTo) include.userSubscribedTo = true;
  if (needSubscribedToUser) include.subscribedToUser = true;

  const users = await ctx.prisma.user.findMany({
    include: Object.keys(include).length > 0 ? include : undefined,
  });

  if (!needUserSubscribedTo && !needSubscribedToUser) return users;

  const map = new Map<string, User>();
  users.forEach((u) => map.set(u.id, u));

  if (needUserSubscribedTo) {
    users.forEach((user) => {
      const u = user as UserWithRelations;

      const relations = u.userSubscribedTo ?? [];

      const authors = relations
        .map((rel) => map.get(rel.authorId))
        .filter((v): v is User => Boolean(v));

      ctx.loaders.userSubscribedTo.prime(user.id, authors);
    });
  }

  if (needSubscribedToUser) {
    users.forEach((user) => {
      const u = user as UserWithRelations;

      const relations = u.subscribedToUser ?? [];

      const subscribers = relations
        .map((rel) => map.get(rel.subscriberId))
        .filter((v): v is User => Boolean(v));

      ctx.loaders.subscribedToUser.prime(user.id, subscribers);
    });
  }

  return users;
};
