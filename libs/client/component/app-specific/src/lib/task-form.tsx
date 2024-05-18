import { ArrowPathIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useToast } from '@task-master/client/context';
import { CreateTaskInput, Task } from '@task-master/client/graphql';
import {
  Button,
  ConfirmToast,
  Input,
  Radiobox,
  Textarea,
} from '@task-master/shared/ui/component/core';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

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
    colors?: { bgColor: string; textColor: string };
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
  onCancel?: (hasUnsavedChanges: boolean) => void;
  defaultValues?: Task;
}

export const TaskForm: FC<TaskFormProps> = (props) => {
  const {
    options,
    onSubmit,
    submitLabel = 'Submit',
    submitting = false,
    onCancel,
    defaultValues,
  } = props;
  const { toast } = useToast();
  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm<TaskForm>({
    defaultValues: {
      status: defaultValues?.status ?? options[0].value,
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  const handleCancel = () => {
    if (isDirty) {
      toast(
        (props) => (
          <ConfirmToast
            onYes={() => {
              onCancel?.(isDirty);
              props.closeToast();
            }}
            onNo={props.closeToast}
          />
        ),
        {
          type: 'warning',
          autoClose: false,
          draggable: false,
          closeButton: false,
          icon: false,
          toastId: 'unsaved-changes',
        }
      );
    } else {
      onCancel?.(isDirty);
    }
  };

  return (
    <form
      className="space-y-4 m-auto w-56 md:w-96 justify-center items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="status"
        control={control}
        render={({ field, formState: { errors } }) => (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-3">
              {options.map((option) => (
                <Radiobox
                  key={option.value}
                  option={option}
                  labelStyle={
                    // only set the color if the option has colors and is selected
                    option.colors && option.value === field.value
                      ? {
                          backgroundColor: option.colors.bgColor,
                          color: option.colors.textColor,
                        }
                      : undefined
                  }
                  {...field}
                />
              ))}
            </div>

            <p className="text-red-500 text-xs md:text-sm text-center">
              {errors.status?.message}
            </p>
          </div>
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
          minLength: { value: 3, message: 'Title is too short' },
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
          maxLength: { value: 5000, message: 'Description is too long' },
          minLength: { value: 10, message: 'Description is too short' },
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

              <span>
                Just a moment...{' '}
                <span role="img" aria-label="Loading">
                  🕒
                </span>
              </span>
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
