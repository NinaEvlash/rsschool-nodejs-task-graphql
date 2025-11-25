import DataLoader from 'dataloader';
import type { PrismaClient, Post, Profile, MemberType, User } from '@prisma/client';

export interface Loaders {
  postsByAuthorId: DataLoader<string, Post[]>;
  profileByUserId: DataLoader<string, Profile | null>;
  memberTypeById: DataLoader<string, MemberType | null>;
  userSubscribedTo: DataLoader<string, User[]>;
  subscribedToUser: DataLoader<string, User[]>;
}

export function createLoaders(prisma: PrismaClient): Loaders {
  return {
    postsByAuthorId: new DataLoader<string, Post[]>(async (authorIds) => {
      const arr = Array.from(authorIds);
      const rows = await prisma.post.findMany({
        where: { authorId: { in: arr } },
      });
      return arr.map((id) => rows.filter((r) => r.authorId === id));
    }),

    profileByUserId: new DataLoader<string, Profile | null>(async (userIds) => {
      const arr = Array.from(userIds);
      const rows = await prisma.profile.findMany({
        where: { userId: { in: arr } },
      });
      return arr.map((id) => rows.find((r) => r.userId === id) || null);
    }),

    memberTypeById: new DataLoader<string, MemberType | null>(async (ids) => {
      const arr = Array.from(ids);
      const rows = await prisma.memberType.findMany({
        where: { id: { in: arr } },
      });
      return arr.map((id) => rows.find((r) => r.id === id) || null);
    }),

    userSubscribedTo: new DataLoader<string, User[]>(async (userIds) => {
      const arr = Array.from(userIds);
      const rows = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: { in: arr } },
        include: { author: true },
      });
      const grouped = new Map<string, User[]>();
      rows.forEach((r) => {
        const existing = grouped.get(r.subscriberId) || [];
        grouped.set(r.subscriberId, [...existing, r.author]);
      });
      return arr.map((id) => grouped.get(id) || []);
    }),

    subscribedToUser: new DataLoader<string, User[]>(async (userIds) => {
      const arr = Array.from(userIds);
      const rows = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: { in: arr } },
        include: { subscriber: true },
      });
      const grouped = new Map<string, User[]>();
      rows.forEach((r) => {
        const existing = grouped.get(r.authorId) || [];
        grouped.set(r.authorId, [...existing, r.subscriber]);
      });
      return arr.map((id) => grouped.get(id) || []);
    }),
  };
}
