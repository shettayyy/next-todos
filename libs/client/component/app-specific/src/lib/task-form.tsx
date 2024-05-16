import { ArrowPathIcon, PlusIcon } from '@heroicons/react/20/solid';
import { CreateTaskInput } from '@task-master/client/graphql';
import {
  Button,
  Input,
  Radiobox,
  Textarea,
} from '@task-master/shared/ui/component/core';
import { FC, useEffect } from 'react';
import { Controller, UseFormGetValues, useForm } from 'react-hook-form';

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
  shareGetValuesFn?: (getValuesFn: UseFormGetValues<CreateTaskInput>) => void;
  onCancel?: (values: CreateTaskInput) => void;
}

export const TaskForm: FC<TaskFormProps> = (props) => {
  const {
    options,
    onSubmit,
    submitLabel = 'Submit',
    submitting = false,
    shareGetValuesFn,
    onCancel,
  } = props;
  const { handleSubmit, getValues, control } = useForm<TaskForm>({
    defaultValues: {
      title: '',
      description: '',
      status: '',
    },
  });

  const handleCancel = () => {
    onCancel?.(getValues());
  };

  useEffect(() => {
    shareGetValuesFn?.(getValues);
  }, [shareGetValuesFn, getValues]);

  return (
    <form
      className="space-y-4 m-auto w-56 md:w-96 justify-center items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="status"
        control={control}
        render={({ field, formState: { errors } }) => (
          <Radiobox
            options={options}
            {...field}
            error={errors.status?.message}
          />
        )}
        rules={{ required: 'Status is required' }}
      />

      <Controller
        name="title"
        control={control}
        render={({ field, formState: { errors } }) => (
          <Input
            label="Title"
            {...field}
            id="title"
            placeholder='e.g. "Create a new project"'
            error={errors.title?.message}
          />
        )}
        rules={{
          required: 'Title is required',
          maxLength: { value: 100, message: 'Title is too long' },
        }}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, formState: { errors } }) => (
          <Textarea
            label="Description"
            {...field}
            id="description"
            placeholder='e.g. "Create a new project for the client"'
            error={errors.description?.message}
          />
        )}
        rules={{
          required: 'Description is required',
          maxLength: { value: 200, message: 'Description is too long' },
        }}
      />

      <div className="flex gap-2 md:gap-4">
        <Button
          className="w-full items-center justify-center"
          disabled={submitting}
          onClick={handleCancel}
          variant="default"
          type="button"
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
