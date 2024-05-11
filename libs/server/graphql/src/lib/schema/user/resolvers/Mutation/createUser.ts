import { userAuthService } from '../../user.service';
import type { MutationResolvers } from './../../../types.generated';
export const createUser: NonNullable<MutationResolvers['createUser']> = async (
  _parent,
  { input },
  _ctx
) => {
  return await userAuthService.createUser(
    {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
    },
    input.password
  );
};
