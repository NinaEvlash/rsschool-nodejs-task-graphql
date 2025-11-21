import type {
  PrismaClient,
  User as PrismaUser,
  Post as PrismaPost,
} from '@prisma/client';

export interface GQLContext {
  prisma: PrismaClient;
}

export type UserSource = PrismaUser;
export type PostSource = PrismaPost;
