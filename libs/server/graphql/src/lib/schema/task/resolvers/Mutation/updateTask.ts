import { taskService } from '../../task.service';
import type { MutationResolvers } from './../../../types.generated';

export const updateTask: NonNullable<MutationResolvers['updateTask']> = async (
  _parent,
  arg,
  ctx
) => {
  /* Implement Mutation.updateTask resolver logic here */
  return await taskService.updateTask(arg.id, arg.input, ctx.req?.user.id);
};
