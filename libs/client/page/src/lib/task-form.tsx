import { PageHeader } from '@task-master/client/component/layout';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { ButtonLink } from '@task-master/client/component/core';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { TaskForm } from '@task-master/client/component/app-specific';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_TASK,
  CreateTaskInput,
  GET_TASK_STATUSES,
} from '@task-master/client/graphql';
import { Button } from '@task-master/shared/ui/component/core';
import { useToast } from '@task-master/client/context';
import { useNavigate } from 'react-router-dom';

export const TaskFormPage = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
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
        navigate('/');
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
    <PageLayout>
      <PageHeader title="Add Task">
        <ButtonLink to="/">
          <ChevronLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </ButtonLink>
      </PageHeader>

      <div className="mt-6 flex flex-1">{renderContent()}</div>
    </PageLayout>
  );
};
