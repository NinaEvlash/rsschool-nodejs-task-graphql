import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { createSchema } from './schema.js';

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

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        operationName,
        contextValue: { prisma: fastify.prisma },
      });

      return result;
    },
  });
};

export default plugin;
