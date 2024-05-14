import { ArrowPathIcon, PlusIcon } from '@heroicons/react/20/solid';
import { CreateTaskInput, TaskStatus } from '@task-master/client/graphql';
import {
  Button,
  Input,
  Radiobox,
  Textarea,
} from '@task-master/shared/ui/component/core';
import { FC, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export type TaskForm = CreateTaskInput;

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
  submitting?: boolean;
}

export const TaskForm: FC<TaskFormProps> = (props) => {
  const {
    taskStatuses,
    onSubmit,
    submitLabel = 'Submit',
    submitting = false,
  } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskForm>({
    defaultValues: {
      title: '',
      description: '',
      status: taskStatuses[0].id,
    },
  });

  const opions = useMemo(() => {
    return taskStatuses.map((status) => ({
      value: status.id,
      label: status.status,
    }));
  }, [taskStatuses]);

  return (
    <form
      className="space-y-6 m-auto w-72 md:w-96 justify-center items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Radiobox
        options={opions}
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
        placeholder='e.g. "Create a new project"'
        error={errors.title?.message}
      />

      <Textarea
        label="Description"
        {...register('description', {
          required: 'Description is required',
          maxLength: { value: 1000, message: 'Description is too long' },
        })}
        placeholder='e.g. "Create a new project with the following features..."'
        error={errors.description?.message}
      />

      <Button
        className="w-full items-center justify-center flex gap-4"
        type="submit"
        disabled={submitting}
      >
        {submitting ? (
          <div className="flex items-center justify-center gap-2">
            <ArrowPathIcon className="w-5 h-5 animate-spin" />

            <span>Adding your task...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <PlusIcon className="w-5 h-5" />

            <span>{submitLabel}</span>
          </div>
        )}
      </Button>
    </form>
  );
};
