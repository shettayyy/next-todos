import { taskService } from '../../task.service';
import type { QueryResolvers } from './../../../types.generated';

export const tasks: NonNullable<QueryResolvers['tasks']> = async (
  _parent,
  arg,
  ctx
) => {
  /* Implement Query.tasks resolver logic here */
  return taskService.getTasks(ctx.req.user.id, arg.input);
};
