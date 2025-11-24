import type { MemberType, Profile, Post } from '@prisma/client';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createSchema } from './schema.js';
import DataLoader from 'dataloader';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { GQLContext } from './types/types.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const schema = createSchema();

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },

    async handler(req) {
      const { query, variables, operationName } = req.body as {
        query: string;
        variables?: Record<string, unknown>;
        operationName?: string;
      };

      const documentNode = parse(query);
      const errors = validate(schema, documentNode, [depthLimit(5)]);
      if (errors.length) return { errors };

      const prisma = fastify.prisma;

      const loaders = {
        memberTypeById: new DataLoader<string, MemberType | null>(
          async (ids: readonly string[]) => {
            const rows = await prisma.memberType.findMany({
              where: { id: { in: ids as string[] } },
            });

            const map = new Map<string, MemberType>();
            rows.forEach((row) => map.set(row.id, row));

            return ids.map((id) => map.get(id) ?? null);
          },
        ),

        profileByUserId: new DataLoader<string, Profile | null>(
          async (userIds: readonly string[]) => {
            const rows = await prisma.profile.findMany({
              where: { userId: { in: userIds as string[] } },
            });

            const map = new Map<string, Profile>();
            rows.forEach((row) => map.set(row.userId, row));

            return userIds.map((id) => map.get(id) ?? null);
          },
        ),

        postsByAuthorId: new DataLoader<string, Post[]>(
          async (userIds: readonly string[]) => {
            const rows = await prisma.post.findMany({
              where: { authorId: { in: userIds as string[] } },
            });

            const grouped = new Map<string, Post[]>();
            for (const r of rows) {
              if (!grouped.has(r.authorId)) grouped.set(r.authorId, []);
              grouped.get(r.authorId)!.push(r);
            }

            return userIds.map((id) => grouped.get(id) ?? []);
          },
        ),
      };

      const context: GQLContext = {
        prisma,
        loaders,
        getResolveInfo(info) {
          return parseResolveInfo(info) ?? null;
        },
      };

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        operationName,
        contextValue: context,
      });

      return result;
    },
  });
};

export default plugin;
