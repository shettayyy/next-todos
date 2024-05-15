import { ArrowPathIcon, PlusIcon } from '@heroicons/react/20/solid';
import { CreateTaskInput } from '@task-master/client/graphql';
import {
  Button,
  Input,
  Radiobox,
  Textarea,
} from '@task-master/shared/ui/component/core';
import { FC, useEffect } from 'react';
import { UseFormGetValues, useForm } from 'react-hook-form';

export type TaskForm = CreateTaskInput;

export interface TaskFormProps {
  /**
   * List of options for task status
   *
   * @type {Array<{ value: unknown; label: string }>}
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
   * <TaskForm options={taskStatuses} />
   * ```
   */
  options: {
    value: string;
    label: string;
  }[];
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
  getValues?: () => TaskForm;
  attachGetValues?: (getValuesFn: UseFormGetValues<CreateTaskInput>) => void;
}

export const TaskForm: FC<TaskFormProps> = (props) => {
  const {
    options,
    onSubmit,
    submitLabel = 'Submit',
    submitting = false,
    attachGetValues,
  } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<TaskForm>({
    defaultValues: {
      title: '',
      description: '',
      status: '',
    },
  });

  useEffect(() => {
    attachGetValues?.(getValues);
  }, [attachGetValues, getValues]);

  return (
    <form
      className="space-y-4 m-auto w-56 md:w-96 justify-center items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Radiobox
        options={options}
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
        id="title"
        placeholder='e.g. "Create a new project"'
        error={errors.title?.message}
      />

      <Textarea
        label="Description"
        {...register('description', {
          required: 'Description is required',
          maxLength: { value: 1000, message: 'Description is too long' },
        })}
        id="description"
        placeholder='e.g. "Create a new project with the following features..."'
        error={errors.description?.message}
      />

      <div className="flex gap-2 md:gap-4">
        <Button
          className="w-full items-center justify-center"
          disabled={submitting}
        >
          Cancel
        </Button>
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
      </div>
    </form>
  );
};
