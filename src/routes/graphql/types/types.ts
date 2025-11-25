import type { Loaders } from '../loaders/loaders.js';
import type {
  PrismaClient,
  User as PrismaUser,
  Post as PrismaPost,
  Profile as PrismaProfile,
  MemberType as PrismaMemberType,
} from '@prisma/client';

export interface GQLContext {
  prisma: PrismaClient;
  loaders: Loaders;
}

export type UserSource = PrismaUser;
export type PostSource = PrismaPost;
export type ProfileSource = PrismaProfile;
export type MemberTypeSource = PrismaMemberType;
