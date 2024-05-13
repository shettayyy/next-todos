import { GraphQLError } from 'graphql';
import { userService } from '../../user.service';
import type { QueryResolvers, User } from './../../../types.generated';

export const user: NonNullable<QueryResolvers['user']> = async (
  _parent,
  _arg,
  ctx
) => {
  const user = (ctx.req.user as User) || null;

  if (!user?.id) {
    throw new GraphQLError('User not found');
  }

  /* Implement Query.user resolver logic here */
  return await userService.getUser(user.id);
};
