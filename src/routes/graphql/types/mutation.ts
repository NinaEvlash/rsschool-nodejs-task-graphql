import { GraphQLObjectType, GraphQLNonNull } from 'graphql';

import { UUIDType } from './uuid.js';
import { GQLContext } from './types.js';

import {
  CreateUserInput,
  CreatePostInput,
  CreateProfileInput,
  ChangeUserInput,
  ChangePostInput,
  ChangeProfileInput,
} from './inputs.js';

import { UserType } from './user.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';

import {
  CreateUserDto,
  CreatePostDto,
  CreateProfileDto,
  ChangeUserDto,
  ChangePostDto,
  ChangeProfileDto,
} from './interfaces.js';

interface IdArgs {
  id: string;
}

interface CreateArgs<T> {
  dto: T;
}

interface UpdateArgs<T> {
  id: string;
  dto: T;
}

interface SubscribeArgs {
  userId: string;
  authorId: string;
}

export const MutationType = new GraphQLObjectType<unknown, GQLContext>({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (_root, { dto }: CreateArgs<CreateUserDto>, { prisma }) => {
        return prisma.user.create({
          data: {
            name: dto.name,
            balance: dto.balance,
          },
        });
      },
    },

    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (_root, { dto }: CreateArgs<CreateProfileDto>, { prisma }) => {
        return prisma.profile.create({
          data: dto,
        });
      },
    },

    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (_root, { dto }: CreateArgs<CreatePostDto>, { prisma }) => {
        return prisma.post.create({
          data: {
            title: dto.title,
            content: dto.content,
            authorId: dto.authorId,
          },
        });
      },
    },

    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (_root, { id, dto }: UpdateArgs<ChangeUserDto>, { prisma }) => {
        return prisma.user.update({
          where: { id },
          data: dto,
        });
      },
    },

    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (_root, { id, dto }: UpdateArgs<ChangePostDto>, { prisma }) => {
        return prisma.post.update({
          where: { id },
          data: dto,
        });
      },
    },

    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (_root, { id, dto }: UpdateArgs<ChangeProfileDto>, { prisma }) => {
        return prisma.profile.update({
          where: { id },
          data: dto,
        });
      },
    },

    deleteUser: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_root, { id }: IdArgs, { prisma }) => {
        await prisma.user.delete({ where: { id } });
        return id;
      },
    },

    deletePost: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_root, { id }: IdArgs, { prisma }) => {
        await prisma.post.delete({ where: { id } });
        return id;
      },
    },

    deleteProfile: {
      type: UUIDType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_root, { id }: IdArgs, { prisma }) => {
        await prisma.profile.delete({ where: { id } });
        return id;
      },
    },

    subscribeTo: {
      type: UUIDType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_root, { userId, authorId }: SubscribeArgs, { prisma }) => {
        await prisma.subscribersOnAuthors.create({
          data: { subscriberId: userId, authorId },
        });
        return userId;
      },
    },

    unsubscribeFrom: {
      type: UUIDType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_root, { userId, authorId }: SubscribeArgs, { prisma }) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: { subscriberId: userId, authorId },
          },
        });
        return userId;
      },
    },
  }),
});
