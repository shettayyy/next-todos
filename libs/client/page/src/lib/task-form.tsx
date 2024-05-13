import { PageHeader } from '@task-master/client/component/layout';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { ButtonLink } from '@task-master/client/component/core';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { TaskForm } from '@task-master/client/component/app-specific';
import { useQuery } from '@apollo/client';
import { GET_TASK_STATUSES } from '@task-master/client/graphql';
import { Button } from '@task-master/shared/ui/component/core';
import { useToast } from '@task-master/client/context';

export const TaskFormPage = () => {
  const { showToast } = useToast();
  const { loading, data } = useQuery(GET_TASK_STATUSES, {
    onError: (error) => {
      showToast('error', error.message, {
        toastId: 'task-statuses-error',
      });
    },
  });

  const onSubmit = (data: TaskForm) => {
    console.info(data);
  };

  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!data?.taskStatuses) {
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
