import { describe, it, expect, vi, afterEach } from 'vitest';
import { taskService } from './task.service';
import { TaskModel } from './task.model';
import { GraphQLError } from 'graphql';
import { ErrorCode } from '@task-master/shared/types';
import { Document, Query, Types } from 'mongoose';
import { Task } from '../types.generated';

type TaskDocument = (Document<unknown, NonNullable<unknown>, Task> &
  Task & { _id: Types.ObjectId })[];

// Mock dependencies
vi.mock('./task.model');
vi.mock('@task-master/shared/utils', () => ({
  handleGraphQLError: vi.fn((error) => {
    throw new GraphQLError(error.message || 'An error occurred', {
      extensions: {
        code: ErrorCode.Unknown,
      },
    });
  }),
}));

describe('taskService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const mockTask = {
        title: 'Test Task',
        description: 'This is a test task',
        status: '6642596955c5a701cafe6b24',
      };
      const mockUserId = 'user123';
      const mockResult = {
        id: 'task123',
        ...mockTask,
        userId: mockUserId,
      } as unknown as TaskDocument;

      vi.mocked(TaskModel.create).mockResolvedValue(mockResult);

      const result = await taskService.createTask(mockTask, mockUserId);

      expect(result).toEqual(mockResult);
      expect(TaskModel.create).toHaveBeenCalledWith({
        ...mockTask,
        userId: mockUserId,
      });
    });

    it('should throw an error if task creation fails', async () => {
      const mockTask = {
        title: 'Test Task',
        description: 'This is a test task',
        status: '6642596955c5a701cafe6b24',
      };
      const mockUserId = 'user123';

      vi.mocked(TaskModel.create).mockRejectedValue(
        new Error('Creation failed')
      );

      await expect(
        taskService.createTask(mockTask, mockUserId)
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const mockTaskId = 'task123';
      const mockUserId = 'user123';
      const mockUpdateData = { title: 'Updated Task' };
      const mockExistingTask = {
        _id: mockTaskId,
        title: 'Original Task',
        description: 'This is a test task',
        status: '6642596955c5a701cafe6b24',
        userId: mockUserId,
      } as unknown as TaskDocument;
      const mockUpdatedTask = {
        ...mockExistingTask,
        ...mockUpdateData,
      } as unknown as TaskDocument;

      vi.mocked(TaskModel.findOne).mockResolvedValue(mockExistingTask);
      vi.mocked(TaskModel.findOneAndUpdate).mockResolvedValue(mockUpdatedTask);

      const result = await taskService.updateTask(
        mockTaskId,
        mockUpdateData,
        mockUserId
      );

      expect(TaskModel.findOne).toHaveBeenCalledWith({
        _id: mockTaskId,
        userId: mockUserId,
      });
      expect(TaskModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockTaskId, userId: mockUserId },
        { $set: mockUpdateData },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedTask);
    });

    it('should throw an error if task is not found', async () => {
      const mockTaskId = 'task123';
      const mockUserId = 'user123';
      const mockUpdateData = { title: 'Updated Task' };

      vi.mocked(TaskModel.findOne).mockResolvedValue(null);

      await expect(
        taskService.updateTask(mockTaskId, mockUpdateData, mockUserId)
      ).rejects.toThrow(GraphQLError);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const mockTaskId = 'task123';
      const mockUserId = 'user123';
      const mockTask = {
        _id: mockTaskId,
        title: 'Task to Delete',
        description: 'This task will be deleted',
        status: '6642596955c5a701cafe6b24',
        userId: mockUserId,
      } as unknown as TaskDocument;

      vi.mocked(TaskModel.findOneAndDelete).mockResolvedValue(mockTask);

      const result = await taskService.deleteTask(mockTaskId, mockUserId);

      expect(TaskModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: mockTaskId,
        userId: mockUserId,
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw an error if task is not found', async () => {
      const mockTaskId = 'task123';
      const mockUserId = 'user123';

      vi.mocked(TaskModel.findOneAndDelete).mockResolvedValue(null);

      await expect(
        taskService.deleteTask(mockTaskId, mockUserId)
      ).rejects.toThrow(GraphQLError);
    });
  });

  describe('getTasks', () => {
    it('should return a list of tasks', async () => {
      const mockUserId = 'user123';
      const mockTasks = [
        { _id: 'task1', title: 'Task 1' },
        { _id: 'task2', title: 'Task 2' },
      ];
      const mockCount = 2;

      const mockPopulateUser = vi.fn().mockReturnThis();
      const mockPopulateTaskStatus = vi.fn().mockResolvedValue(mockTasks);
      const mockFindChain = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        populate: mockPopulateUser,
      } as unknown as Query<
        unknown[],
        unknown,
        NonNullable<unknown>,
        Task,
        'find'
      >;

      vi.mocked(TaskModel.find).mockReturnValue(mockFindChain);
      vi.mocked(TaskModel.countDocuments).mockResolvedValue(mockCount);

      // Mock the first populate call (for 'user')
      mockPopulateUser.mockImplementationOnce(() => {
        return {
          ...mockFindChain,
          populate: mockPopulateTaskStatus,
        };
      });

      const result = await taskService.getTasks(mockUserId, {});

      expect(result.result).toEqual(mockTasks);
      expect(result.metadata.pagination.total).toBe(mockCount);
      expect(TaskModel.find).toHaveBeenCalledWith({ userId: mockUserId });
      expect(mockFindChain.sort).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(mockFindChain.skip).toHaveBeenCalledWith(0);
      expect(mockFindChain.limit).toHaveBeenCalledWith(10);
      expect(mockPopulateUser).toHaveBeenCalledTimes(1);
      expect(mockPopulateUser).toHaveBeenCalledWith('user');
      expect(mockPopulateTaskStatus).toHaveBeenCalledTimes(1);
      expect(mockPopulateTaskStatus).toHaveBeenCalledWith('taskStatus');
    });
  });

  describe('getTask', () => {
    it('should return a task by id', async () => {
      const mockTaskId = 'task123';
      const mockUserId = 'user123';
      const mockTask = {
        _id: mockTaskId,
        title: 'Test Task',
        description: 'This is a test task',
        status: '6642596955c5a701cafe6b24',
        userId: mockUserId,
      };

      const mockPopulateUser = vi.fn().mockReturnThis();
      const mockPopulateTaskStatus = vi.fn().mockResolvedValue(mockTask);
      const mockFindOneChain = {
        populate: mockPopulateUser,
      } as unknown as Query<
        unknown,
        unknown,
        NonNullable<unknown>,
        Task,
        'findOne'
      >;

      // Mock the first populate call (for 'user')
      mockPopulateUser.mockImplementationOnce(() => {
        return {
          ...mockFindOneChain,
          populate: mockPopulateTaskStatus,
        };
      });

      vi.mocked(TaskModel.findOne).mockReturnValue(mockFindOneChain);

      const result = await taskService.getTask(mockTaskId, mockUserId);

      expect(TaskModel.findOne).toHaveBeenCalledWith({
        _id: mockTaskId,
        userId: mockUserId,
      });
      expect(mockPopulateUser).toHaveBeenCalledTimes(1);
      expect(mockPopulateUser).toHaveBeenCalledWith('user');
      expect(mockPopulateTaskStatus).toHaveBeenCalledTimes(1);
      expect(mockPopulateTaskStatus).toHaveBeenCalledWith('taskStatus');
      expect(result).toEqual(mockTask);
    });

    it('should throw an error if task is not found', async () => {
      const mockTaskId = 'task123';
      const mockUserId = 'user123';

      const mockFindOneChain = {
        populate: vi.fn().mockResolvedValue(null),
      } as unknown as Query<
        unknown,
        unknown,
        NonNullable<unknown>,
        Task,
        'findOne'
      >;

      vi.mocked(TaskModel.findOne).mockReturnValue(mockFindOneChain);

      await expect(taskService.getTask(mockTaskId, mockUserId)).rejects.toThrow(
        GraphQLError
      );
    });
  });
});
