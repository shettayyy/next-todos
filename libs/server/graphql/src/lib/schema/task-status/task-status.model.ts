import { Schema, model } from 'mongoose';
import { TaskStatus } from '../types.generated';

export const TaskStatusCollection = 'task_status';

// Task statuses schema
export const TaskStatusSchema = new Schema<TaskStatus>({
  status: { type: String, required: true },
});

export const TaskStatusModel = model<TaskStatus>(
  TaskStatusCollection,
  TaskStatusSchema
);
