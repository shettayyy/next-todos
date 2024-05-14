import { useMutation, useQuery } from '@apollo/client';
import { TaskForm } from '@task-master/client/component/app-specific';
import { useToast } from '@task-master/client/context';
import {
  CREATE_TASK,
  CreateTaskInput,
  GET_TASK_STATUSES,
} from '@task-master/client/graphql';
import { Button, Modal } from '@task-master/shared/ui/component/core';

export interface AddTaskPopUpProps {
  isVisble: boolean;
  onClose: () => void;
}

export function AddTaskPopUp(props: AddTaskPopUpProps) {
  const { isVisble, onClose } = props;
  const { showToast } = useToast();
  const { loading, data } = useQuery(GET_TASK_STATUSES, {
    onError: (error) => {
      showToast('error', error.message, {
        toastId: 'task-statuses-error',
      });
    },
  });

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

    if (!data?.taskStatuses || !data.taskStatuses.length) {
      return (
        <div className="text-red-600 justify-center items-center flex flex-col flex-1">
          <span>
            We couldn't fetch the list of task statuses. Please refresh the
            page.
          </span>

          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      );
    }

    return (
      <TaskForm
        submitLabel="Add Task"
        onSubmit={onSubmit}
        submitting={submitting}
        taskStatuses={data.taskStatuses}
      />
    );
  };

  return (
    <Modal title="Add Task 📑" isOpen={isVisble} onClose={onClose}>
      {renderContent()}
    </Modal>
  );
}

export default AddTaskPopUp;
