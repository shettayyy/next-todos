import { GraphQLError } from 'graphql';
import { userAuthService } from '../../user.service';
import type { MutationResolvers } from './../../../types.generated';
import { ErrorCode } from '@task-master/shared/types';
export const login: NonNullable<MutationResolvers['login']> = async (
  _parent,
  { email, password },
  ctx
) => {
  try {
    const result = await userAuthService.loginUser(email, password, ctx.req);

    return result;
  } catch (error) {
    throw new GraphQLError((error as Error).message, {
      extensions: {
        code: ErrorCode.UserLoginFailed,
      },
    });
  }
};
