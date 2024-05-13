import { TASK_STATUSES } from '../../task.model';
import type { QueryResolvers } from './../../../types.generated';

export const taskStatuses: NonNullable<QueryResolvers['taskStatuses']> = async (
  _parent,
  _arg,
  _ctx
) => {
  return [...TASK_STATUSES];
};
