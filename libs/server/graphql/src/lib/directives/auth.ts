import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { GraphQLError, GraphQLSchema } from 'graphql';
import {} from '@apollo/server/errors';
import { GraphQLContext } from '../context.type';
import { ErrorCode } from '@task-master/shared/types';

export const authTransformer = (schema: GraphQLSchema) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0];

      if (authDirective) {
        const { resolve: originalResolver } = fieldConfig;

        fieldConfig.resolve = async (
          source,
          args,
          context: GraphQLContext,
          info
        ) => {
          const { user } = context.req;

          // Check if the user is authenticated
          if (!user) {
            throw new GraphQLError(
              'Unauthorized access! No entry without the right credentials 🔒🚫',
              {
                extensions: {
                  code: ErrorCode.Unauthorized,
                },
              }
            );
          }

          const result = await originalResolver?.(source, args, context, info);
          return result;
        };

        return fieldConfig;
      }

      return fieldConfig;
    },
  });
};
