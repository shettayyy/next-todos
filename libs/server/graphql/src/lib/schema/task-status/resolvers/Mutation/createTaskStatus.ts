import { taskStatusService } from '../../task-status.service';
import type { MutationResolvers } from './../../../types.generated';

export const createTaskStatus: NonNullable<
  MutationResolvers['createTaskStatus']
> = async (_parent, arg, _ctx) => {
  return await taskStatusService.createTaskStatus(arg.status);
};
