import { Schema, model } from 'mongoose';
import { Task } from '../types.generated';
import { GraphQLError } from 'graphql';

export const TASK_STATUSES = [
  {
    value: '1',
    label: 'To Do',
  },
  {
    value: '2',
    label: 'In Progress',
  },
  {
    value: '3',
    label: 'Done',
  },
];

export const TaskSchema = new Schema<Task>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
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
  ref: 'User',
  localField: 'userId',
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

  // Ensure the status is one of the valid values
  if (!TASK_STATUSES.map((item) => item.value).includes(this.status)) {
    next(
      new GraphQLError('Invalid status', {
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
  if (this.description.length > 1000) {
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

export const TaskModel = model<Task>('Task', TaskSchema);
