import { GraphQLError } from 'graphql';

export const handleGraphQLError = (error: unknown, code = '') => {
  if (error instanceof GraphQLError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: code || 'INTERNAL_SERVER_ERROR',
      },
    });
  }

  throw new GraphQLError('An unknown error occurred', {
    extensions: {
      code: code || 'INTERNAL_SERVER_ERROR',
    },
  });
};
