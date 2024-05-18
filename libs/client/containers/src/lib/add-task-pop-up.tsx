import { useQuery } from '@apollo/client';
import { TaskForm } from '@task-master/client/component/app-specific';
import { useToast } from '@task-master/client/context';
import {
  CreateTaskInput,
  GET_TASK_STATUSES,
  Task,
} from '@task-master/client/graphql';
import {
  Button,
  ConfirmToast,
  Modal,
} from '@task-master/shared/ui/component/core';
import { useMemo } from 'react';

export interface AddTaskPopUpProps {
  isVisble: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput) => void;
  submitting?: boolean;
  defaultValues?: Task;
}

export function AddTaskPopUp(props: AddTaskPopUpProps) {
  const {
    isVisble,
    onClose,
    onSubmit,
    submitting = false,
    defaultValues,
  } = props;
  const { showToast, toast } = useToast();
  const { loading, data } = useQuery(GET_TASK_STATUSES, {
    onError: (error) => {
      showToast('error', error.message, {
        toastId: 'task-statuses-error',
      });
    },
  });
  const taskStatuses = data?.taskStatuses;

  const handleOnClose = (hasUnsavedChanges: boolean) => {
    if (hasUnsavedChanges) {
      toast(
        (props) => (
          <ConfirmToast
            onYes={() => {
              onClose();
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
      onClose();
    }
  };

  const options = useMemo(() => {
    if (!taskStatuses?.length) {
      return [];
    }

    return taskStatuses.map((status) => ({
      value: status.id,
      label: status.status,
      colors: {
        bgColor: status.bgColor,
        textColor: status.textColor,
      },
    }));
  }, [taskStatuses]);

  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!taskStatuses?.length) {
      return (
        <div className="text-red-600 justify-center items-center flex flex-col flex-1">
          <p className="text-center">
            We couldn't fetch the list of task statuses.
            <br /> Please refresh the page.
          </p>

          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      );
    }

    return (
      <TaskForm
        submitLabel={defaultValues?.id ? 'Update Task' : 'Add Task'}
        onSubmit={onSubmit}
        submitting={submitting}
        options={options}
        onCancel={handleOnClose}
        defaultValues={defaultValues}
      />
    );
  };

  return (
    <Modal title="Add Task 📑" isOpen={isVisble}>
      {renderContent()}
    </Modal>
  );
}

export default AddTaskPopUp;
