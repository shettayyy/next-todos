import { taskService } from '../../task.service';
import type { MutationResolvers } from './../../../types.generated';

export const cloneTasks: NonNullable<MutationResolvers['cloneTasks']> = async (
  _parent,
  _arg,
  ctx
) => {
  return taskService.cloneTasks(ctx.req.user.id);
};
