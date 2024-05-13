import { ErrorCode } from '@task-master/shared/types';
import { GraphQLError } from 'graphql';
import { TaskModel } from './task.model';
import { CreateTaskInput, Task } from '../types.generated';

export const taskService = {
  createTask: async (task: CreateTaskInput, userId: string): Promise<Task> => {
    try {
      return await TaskModel.create({
        ...task,
        userId,
      });
    } catch (error) {
      throw new GraphQLError((error as Error).message, {
        extensions: {
          code: ErrorCode.TaskCreationFailed,
        },
      });
    }
  },
};
