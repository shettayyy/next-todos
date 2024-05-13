import { Task, TaskStatus } from '@task-master/client/graphql';
import {
  Button,
  Input,
  Radiobox,
  Textarea,
} from '@task-master/shared/ui/component/core';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

export type TaskForm = {
  title: Task['title'];
  description: Task['description'];
  status: Task['status']['value'];
};

export interface TaskFormProps {
  /**
   * List of task statuses
   *
   * @type TaskStatus[]
   * @default []
   *
   * @example
   * ```tsx
   * taskStatuses = [
   *  { value: 1, label: 'To Do' },
   *  { value: 2, label: 'In Progress' },
   *  { value: 3, label: 'Done' },
   * ];
   *
   * <TaskForm taskStatuses={taskStatuses} />
   * ```
   */
  taskStatuses: TaskStatus[];
  /**
   * Submit button label
   * @default 'Submit'
   *
   * @example 'Add Task'
   * @example 'Update Task'
   */
  submitLabel?: string;
  /**
   * Callback function to handle form submission
   *
   * @param data - Form data
   */
  onSubmit: (data: TaskForm) => void;
}

export const TaskForm: FC<TaskFormProps> = (props) => {
  const { taskStatuses, onSubmit, submitLabel = 'Submit' } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskForm>({
    defaultValues: {
      title: '',
      description: '',
      status: taskStatuses[0].value,
    },
  });

  return (
    <form
      className="space-y-6 m-auto w-72 md:w-96 justify-center items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Radiobox
        options={taskStatuses}
        {...register('status', {
          required: 'Status is required',
        })}
        error={errors.status?.message}
      />

      <Input
        label="Title"
        {...register('title', {
          required: 'Title is required',
          maxLength: { value: 100, message: 'Title is too long' },
        })}
        error={errors.title?.message}
      />

      <Textarea
        label="Description"
        {...register('description', {
          required: 'Description is required',
          maxLength: { value: 1000, message: 'Description is too long' },
        })}
        error={errors.description?.message}
      />

      <Button className="w-full" type="submit">
        {submitLabel}
      </Button>
    </form>
  );
};
