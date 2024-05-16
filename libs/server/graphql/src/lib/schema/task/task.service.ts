import { ErrorCode, PAGINATION } from '@task-master/shared/types';
import { GraphQLError } from 'graphql';
import { TaskModel } from './task.model';
import {
  CreateTaskInput,
  InputMaybe,
  Task,
  TaskList,
  TaskParams,
} from '../types.generated';
import { handleGraphQLError } from '@task-master/shared/utils';
import mongoose, { UpdateQuery } from 'mongoose';

export const taskService = {
  /**
   * Create a task
   *
   * @param task Task data
   * @param userId User ID
   *
   * @returns Created task
   *
   * @throws GraphQLError
   *
   * @example
   * ```ts
   * const task = await taskService.createTask({ title: 'New Task' }, 'user-id');
   * ```
   */
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
  /**
   * Update a task
   *
   * @param taskId Task ID
   * @param task Task data
   * @param userId User ID
   *
   * @returns Updated task
   *
   * @throws GraphQLError
   *
   * @example
   * ```ts
   * const task = await taskService.updateTask('task-id', { title: 'New Title' }, 'user-id');
   * ```
   */
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
  /**
   * Delete a task
   *
   * @param taskId Task ID
   * @param userId User ID
   *
   * @returns Deleted task
   *
   * @throws GraphQLError
   *
   * @example
   * ```ts
   * const task = await taskService.deleteTask('task-id', 'user-id');
   * ```
   */
  deleteTask: async (taskId: string, userId: string): Promise<Task> => {
    try {
      const result = await TaskModel.findOneAndDelete({ _id: taskId, userId });

      if (!result) {
        throw new GraphQLError('Task not found', {
          extensions: {
            code: ErrorCode.TaskNotFound,
          },
        });
      }

      return result;
    } catch (error) {
      return handleGraphQLError(error);
    }
  },
  /**
   * Get paginated list of all tasks
   *
   * @param userId User ID
   * @param limit Number of tasks to fetch
   * @param page Page number
   * @param filter Filter tasks by status and search query
   * @param sort Sort tasks by field and direction
   */
  getTasks: async (
    userId: string,
    params: InputMaybe<TaskParams>
  ): Promise<TaskList> => {
    try {
      const query: Record<string, unknown> = { userId };

      if (params?.filter?.status) {
        query['status'] = params.filter.status;
      }

      if (params?.filter?.search) {
        query['title'] = { $regex: params.filter.search, $options: 'i' };
      }

      // if (filter?.date) {
      //   query['createdAt'] = {
      //     $gte: new Date(filter.date),
      //     $lt: new Date(new Date(filter.date).setDate(new Date(filter.date).getDate() + 1)),
      //   };
      // }

      const page = params?.page ?? PAGINATION.DEFAULT_PAGE;
      // Limit number of tasks to fetch
      const limit = Math.min(
        params?.limit ?? PAGINATION.DEFAULT_LIMIT,
        PAGINATION.MAX_LIMIT
      );
      const sortField = params?.sort?.field ?? 'createdAt';
      const sortDir = params?.sort?.dir ?? 'DSC';

      const tasks = await TaskModel.find(query)

        .sort({
          [sortField]: sortDir === 'ASC' ? 1 : -1,
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user')
        .populate('taskStatus');
      // Total number of tasks
      const total = await TaskModel.countDocuments(query);

      // Total number of pages
      const totalPages = Math.ceil(total / limit);

      return {
        result: tasks,
        metadata: {
          pagination: {
            currentPage: page,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            firstPage: 1,
            lastPage: totalPages,
            total,
          },
        },
      };
    } catch (error) {
      return handleGraphQLError(error);
    }
  },
  /**
   * Get a task by ID
   *
   * @param taskId Task ID
   * @param userId User ID
   *
   * @returns Task
   *
   * @throws GraphQLError
   *
   * @example
   * ```ts
   * const task = await taskService.getTask('task-id', 'user-id');
   * ```
   */
  getTask: async (taskId: string, userId: string): Promise<Task> => {
    try {
      const task = await TaskModel.findOne({ _id: taskId, userId })
        .populate('user')
        .populate('taskStatus');

      if (!task) {
        throw new GraphQLError('Task not found', {
          extensions: {
            code: ErrorCode.TaskNotFound,
          },
        });
      }

      return task;
    } catch (error) {
      return handleGraphQLError(error);
    }
  },
  /**
   * Pick one task and clone 400 tasks with new ObjectID from for testing purposes
   *
   * @param userId User ID
   *
   * @returns Boolean value indicating success or failure
   *
   * @throws GraphQLError
   *
   * @example
   * ```ts
   * const success = await taskService.cloneTasks('user-id');
   * ```
   */
  cloneTasks: async (userId: string): Promise<boolean> => {
    try {
      const tasks = Array.from({ length: 400 }, (_, index) => ({
        _id: new mongoose.Types.ObjectId(),
        title: `Task ${index + 1}`,
        description: `Task description ${index + 1}`,
        // Random status ID to choose from 6642596955c5a701cafe6b24, 6642597155c5a701cafe6b30, 6642597e55c5a701cafe6b3e
        userId,
        status:
          index % 3 === 0
            ? '6642596955c5a701cafe6b24'
            : index % 2 === 0
            ? '6642597155c5a701cafe6b30'
            : '6642597e55c5a701cafe6b3e',
        // Add index to add days to the current date
        createdAt: new Date(new Date().setDate(new Date().getDate() + index)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() + index)),
      }));

      await TaskModel.insertMany(tasks, { ordered: true });

      return true;
    } catch (error) {
      return handleGraphQLError(error);
    }
  },
  /**
   * Clear all tasks
   *
   * @param userId User ID
   *
   * @returns Boolean value indicating success or failure
   *
   * @throws GraphQLError
   *
   * @example
   *
   * ```ts
   * const success = await taskService.clearTasks('user-id');
   * ```
   */
  clearTasks: async (userId: string): Promise<boolean> => {
    try {
      await TaskModel.deleteMany({ userId });

      return true;
    } catch (error) {
      return handleGraphQLError(error);
    }
  },
};
