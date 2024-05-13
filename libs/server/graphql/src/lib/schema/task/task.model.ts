import { Schema, model } from 'mongoose';
import { Task } from '../types.generated';

export const TaskSchema = new Schema<Task>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' } as never,
  },
  {
    timestamps: true,
  }
);

export const TaskModel = model<Task>('Task', TaskSchema);
