import { userService } from './../../user.service';
import type { MutationResolvers } from './../../../types.generated';
export const generateUserProfilePictureURL: NonNullable<
  MutationResolvers['generateUserProfilePictureURL']
> = async (_parent, arg, ctx) => {
  return userService.generateUserProfileURL(arg.filename, ctx.req.user.id);
};
