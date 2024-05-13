import { taskService } from '../../task.service';
import type { QueryResolvers } from './../../../types.generated';
export const task: NonNullable<QueryResolvers['task']> = async (
  _parent,
  arg,
  ctx
) => {
  return taskService.getTask(arg.id, ctx.req.user.id);
};
