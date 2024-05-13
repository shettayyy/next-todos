import { taskStatusService } from '../../task-status.service';
import type { QueryResolvers } from './../../../types.generated';

export const taskStatuses: NonNullable<QueryResolvers['taskStatuses']> = async (
  _parent,
  _arg,
  _ctx
) => {
  return await taskStatusService.getTaskStatuses();
};
