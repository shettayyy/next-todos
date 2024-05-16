import { Schema, model } from 'mongoose';
import { Task } from '../types.generated';
import { GraphQLError } from 'graphql';
import { UserCollection } from '../user/user.model';
import { TaskStatusCollection } from '../task-status/task-status.model';

export const TaskCollection = 'task';

// Task schema
export const TaskSchema = new Schema<Task>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: Schema.Types.ObjectId,
      ref: 'TaskStatus',
      required: true,
    } as never,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    } as never,
  },
  {
    timestamps: true,
  }
);

TaskSchema.virtual('user', {
  ref: UserCollection,
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

TaskSchema.virtual('taskStatus', {
  ref: TaskStatusCollection,
  localField: 'status',
  foreignField: '_id',
  justOne: true,
});

TaskSchema.set('toObject', { virtuals: true });
TaskSchema.set('toJSON', { virtuals: true });

// Validate all fields are provided
TaskSchema.pre('validate', function (next) {
  if (!this.title || !this.description || !this.status || !this.userId) {
    next(
      new GraphQLError('All fields are required', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      })
    );
  }

  // Title should be at least 3 characters
  if (this.title.length < 3) {
    next(
      new GraphQLError('Title should be at least 3 characters', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      })
    );
  }

  // Description should be at least 10 characters
  if (this.description.length < 10) {
    next(
      new GraphQLError('Description should be at least 10 characters', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      })
    );
  }

  // Title should be at most 100 characters
  if (this.title.length > 100) {
    next(
      new GraphQLError('Title should be at most 100 characters', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      })
    );
  }

  // Description should be at most 1000 characters
  if (this.description.length > 5000) {
    next(
      new GraphQLError('Description should be at most 1000 characters', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      })
    );
  }

  next();
});

export const TaskModel = model<Task>(TaskCollection, TaskSchema);
