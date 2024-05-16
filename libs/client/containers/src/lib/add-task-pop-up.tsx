import { useMutation, useQuery } from '@apollo/client';
import { TaskForm } from '@task-master/client/component/app-specific';
import { useToast } from '@task-master/client/context';
import {
  CREATE_TASK,
  CreateTaskInput,
  GET_TASK_STATUSES,
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
}

export function AddTaskPopUp(props: AddTaskPopUpProps) {
  const { isVisble, onClose } = props;
  const { showToast, toast } = useToast();
  const { loading, data } = useQuery(GET_TASK_STATUSES, {
    onError: (error) => {
      showToast('error', error.message, {
        toastId: 'task-statuses-error',
      });
    },
  });
  const taskStatuses = data?.taskStatuses;

  const handleOnClose = (values: CreateTaskInput) => {
    const hasUnsavedChanges = Object.values(values).some(Boolean);

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
    }));
  }, [taskStatuses]);

  const [createTask, { loading: submitting }] = useMutation(CREATE_TASK);

  const onSubmit = (data: CreateTaskInput) => {
    createTask({
      variables: {
        input: data,
      },
      onCompleted: () => {
        showToast('success', 'Task created successfully', {
          toastId: 'task-created',
        });

        onClose();
      },
    });
  };

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
        submitLabel="Add Task"
        onSubmit={onSubmit}
        submitting={submitting}
        options={options}
        onCancel={handleOnClose}
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
