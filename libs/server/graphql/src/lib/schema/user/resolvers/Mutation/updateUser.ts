import { userAuthService } from '../../user.service';
import type { MutationResolvers } from './../../../types.generated';
export const updateUser: NonNullable<MutationResolvers['updateUser']> = async (
  _parent,
  arg,
  ctx
) => {
  return await userAuthService.updateUser(ctx.req?.user.id, arg.input);
};
