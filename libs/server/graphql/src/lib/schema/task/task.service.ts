import { ErrorCode } from '@task-master/shared/types';
import { GraphQLError } from 'graphql';
import { TaskModel } from './task.model';
import { CreateTaskInput, Task } from '../types.generated';
import { handleGraphQLError } from '@task-master/shared/utils';
import { UpdateQuery } from 'mongoose';

export const taskService = {
  createTask: async (task: CreateTaskInput, userId: string): Promise<Task> => {
    try {
      const result = await TaskModel.create({
        ...task,
        userId,
      });

      if (!result) {
        throw new GraphQLError('Failed to create a task', {
          extensions: {
            code: ErrorCode.TaskCreationFailed,
          },
        });
      }

      return result;
    } catch (error) {
      return handleGraphQLError(error);
    }
  },
  // Update only the task that belongs to the user
  // Only update the fields that are provided
  updateTask: async (
    taskId: string,
    task: Partial<CreateTaskInput>,
    userId: string
  ): Promise<Task> => {
    try {
      const existingTask = await TaskModel.findOne({ _id: taskId, userId });

      if (!existingTask) {
        throw new GraphQLError('Task not found', {
          extensions: {
            code: ErrorCode.TaskNotFound,
          },
        });
      }

      // Update only the fields that are provided
      const updateQuery: UpdateQuery<CreateTaskInput> = { $set: {} };

      for (const key in task) {
        const value = task[key as keyof CreateTaskInput];

        if (value && updateQuery.$set) {
          updateQuery.$set[key as keyof CreateTaskInput] = value;
        }
      }

      const result = await TaskModel.findOneAndUpdate(
        { _id: taskId, userId },
        updateQuery,
        { new: true }
      );

      if (!result) {
        throw new GraphQLError('Failed to update the task', {
          extensions: {
            code: ErrorCode.TaskUpdateFailed,
          },
        });
      }

      return result;
    } catch (error) {
      return handleGraphQLError(error);
    }
  },
};
