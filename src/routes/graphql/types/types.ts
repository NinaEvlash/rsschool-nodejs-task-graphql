import type DataLoader from 'dataloader';
import type { GraphQLResolveInfo } from 'graphql';
import type { ResolveTree, FieldsByTypeName } from 'graphql-parse-resolve-info';
import type {
  PrismaClient,
  User as PrismaUser,
  Post as PrismaPost,
  Profile as PrismaProfile,
  MemberType as PrismaMemberType,
} from '@prisma/client';

export interface GQLContext {
  prisma: PrismaClient;

  loaders: {
    memberTypeById: DataLoader<string, PrismaMemberType | null>;
    profileByUserId: DataLoader<string, PrismaProfile | null>;
    postsByAuthorId: DataLoader<string, PrismaPost[]>;
  };

  getResolveInfo: (info: GraphQLResolveInfo) => ResolveTree | FieldsByTypeName | null;
}

export type UserSource = PrismaUser;
export type PostSource = PrismaPost;
export type ProfileSource = PrismaProfile;
export type MemberTypeSource = PrismaMemberType;
