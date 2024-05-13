import { GraphQLError } from 'graphql';
import { TaskStatus } from '../types.generated';
import { TaskStatusModel } from './task-status.model';
import { ErrorCode } from '@task-master/shared/types';
import { handleGraphQLError } from '@task-master/shared/utils';

export const taskStatusService = {
  /**
   * Create a task status
   *
   * @param label Task label
   *
   * @returns Created task status
   *
   * @throws GraphQLError
   *
   * @example
   * ```ts
   * const taskStatus = await taskService.createTaskStatus('New Status');
   * ```
   */
  createTaskStatus: async (status: string): Promise<TaskStatus> => {
    try {
      const result = await TaskStatusModel.create({ status });

      if (!result) {
        throw new GraphQLError('Failed to create a task status', {
          extensions: {
            code: ErrorCode.TaskStatusCreationFailed,
          },
        });
      }

      return result;
    } catch (error) {
      return handleGraphQLError(error);
    }
  },
  /**
   * Get all task statuses
   *
   * @returns Task statuses
   *
   * @throws GraphQLError
   *
   * @example
   * ```ts
   * const taskStatuses = await taskStatusService.getTaskStatuses();
   * ```
   */
  getTaskStatuses: async (): Promise<TaskStatus[]> => {
    try {
      const result = await TaskStatusModel.find();

      if (!result) {
        throw new GraphQLError('Failed to get task statuses', {
          extensions: {
            code: ErrorCode.TaskStatusFetchFailed,
          },
        });
      }

      return result;
    } catch (error) {
      return handleGraphQLError(error);
    }
  },
};
