import { GraphQLError } from 'graphql';
import { userAuthService } from '../../user.service';
import type { MutationResolvers } from './../../../types.generated';
import { ErrorCode } from '@task-master/shared/types';
import { handleGraphQLError } from '@task-master/shared/utils';

export const login: NonNullable<MutationResolvers['login']> = async (
  _parent,
  { email, password },
  ctx
) => {
  try {
    const result = await userAuthService.loginUser(email, password, ctx.req);

    if (!result || !result.id) {
      throw new GraphQLError('Failed to login user', {
        extensions: {
          code: ErrorCode.UserLoginFailed,
        },
      });
    }

    return result;
  } catch (error) {
    return handleGraphQLError(error, ErrorCode.UserLoginFailed);
  }
};
