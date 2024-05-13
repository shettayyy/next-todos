import { taskService } from '../../task.service';
import type { QueryResolvers } from './../../../types.generated';
export const cloneTasks: NonNullable<QueryResolvers['cloneTasks']> = async (
  _parent,
  _arg,
  ctx
) => {
  return taskService.cloneTasks(ctx.req.user.id);
};
