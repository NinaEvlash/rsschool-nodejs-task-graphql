import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createSchema } from './schema.js';
import { GQLContext } from './types/types.js';
import { createLoaders } from './loaders/loaders.js';

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

      const loaders = createLoaders(prisma);

      const context: GQLContext = {
        prisma,
        loaders,
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
