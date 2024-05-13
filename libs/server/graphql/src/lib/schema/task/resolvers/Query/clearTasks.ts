import { taskService } from '../../task.service';
import type { QueryResolvers } from './../../../types.generated';
export const clearTasks: NonNullable<QueryResolvers['clearTasks']> = async (
  _parent,
  _arg,
  ctx
) => {
  return taskService.clearTasks(ctx.req.user.id);
};
