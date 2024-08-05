import { describe, it, expect, vi, afterEach } from 'vitest';
import { taskStatusService } from './task-status.service';
import { TaskStatusModel } from './task-status.model';
import { GraphQLError } from 'graphql';
import { Document, Types } from 'mongoose';
import { TaskStatus } from '../types.generated';

type TaskStatusDocument = (Document<unknown, NonNullable<unknown>, TaskStatus> &
  TaskStatus & { _id: Types.ObjectId })[];

// Mock dependencies
vi.mock('./task-status.model');

describe('taskStatusService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createTaskStatus', () => {
    it('should create a task status successfully', async () => {
      const mockStatusDetails = {
        status: 'New Status',
        bgColor: '#FFFFFF',
        textColor: '#000000',
      };
      const mockResult = {
        id: '123',
        ...mockStatusDetails,
      } as unknown as TaskStatusDocument;

      vi.mocked(TaskStatusModel.create).mockResolvedValue(mockResult);

      const result = await taskStatusService.createTaskStatus(
        mockStatusDetails
      );

      expect(TaskStatusModel.create).toHaveBeenCalledWith(mockStatusDetails);
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if task status creation fails', async () => {
      const mockStatusDetails = {
        status: 'New Status',
        bgColor: '#FFFFFF',
        textColor: '#000000',
      };

      vi.mocked(TaskStatusModel.create).mockResolvedValue(
        null as unknown as TaskStatusDocument
      );

      await expect(
        taskStatusService.createTaskStatus(mockStatusDetails)
      ).rejects.toThrow(GraphQLError);
      await expect(
        taskStatusService.createTaskStatus(mockStatusDetails)
      ).rejects.toThrow('Failed to create a task status');
    });

    it('should handle and throw GraphQLError for other errors', async () => {
      const mockStatusDetails = {
        status: 'New Status',
        bgColor: '#FFFFFF',
        textColor: '#000000',
      };

      vi.mocked(TaskStatusModel.create).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        taskStatusService.createTaskStatus(mockStatusDetails)
      ).rejects.toThrow(GraphQLError);
    });
  });

  describe('getTaskStatuses', () => {
    it('should return all task statuses successfully', async () => {
      const mockStatuses = [
        { id: '1', status: 'New', bgColor: '#FFFFFF', textColor: '#000000' },
        {
          id: '2',
          status: 'In Progress',
          bgColor: '#FFFF00',
          textColor: '#000000',
        },
      ];

      vi.mocked(TaskStatusModel.find).mockResolvedValue(mockStatuses);

      const result = await taskStatusService.getTaskStatuses();

      expect(TaskStatusModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockStatuses);
    });

    it('should throw an error if fetching task statuses fails', async () => {
      vi.mocked(TaskStatusModel.find).mockResolvedValue(
        null as unknown as TaskStatusDocument
      );

      await expect(taskStatusService.getTaskStatuses()).rejects.toThrow(
        GraphQLError
      );
      await expect(taskStatusService.getTaskStatuses()).rejects.toThrow(
        'Failed to get task statuses'
      );
    });

    it('should handle and throw GraphQLError for other errors', async () => {
      vi.mocked(TaskStatusModel.find).mockRejectedValue(
        new Error('Database error')
      );

      await expect(taskStatusService.getTaskStatuses()).rejects.toThrow(
        GraphQLError
      );
    });
  });
});
