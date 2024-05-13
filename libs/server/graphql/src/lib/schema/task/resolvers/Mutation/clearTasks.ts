import { taskService } from '../../task.service';
import type { MutationResolvers } from './../../../types.generated';

export const clearTasks: NonNullable<MutationResolvers['clearTasks']> = async (
  _parent,
  _arg,
  ctx
) => {
  return taskService.clearTasks(ctx.req.user.id);
};
