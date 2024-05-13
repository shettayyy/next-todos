import { taskService } from '../../task.service';
import type { MutationResolvers } from './../../../types.generated';
export const createTask: NonNullable<MutationResolvers['createTask']> = async (
  _parent,
  arg,
  ctx
) => {
  return await taskService.createTask(arg.input, ctx.req?.user?.id);
};
