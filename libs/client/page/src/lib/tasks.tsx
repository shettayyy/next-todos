import { PageHeader } from '@task-master/client/component/layout';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { PlusIcon } from '@heroicons/react/20/solid';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_TASK, GET_TASKS, Task } from '@task-master/client/graphql';
import { TaskCard } from '@task-master/client/component/app-specific';
import { useToast } from '@task-master/client/context';
import { Button } from '@task-master/shared/ui/component/core';
import { useToggle } from '@task-master/shared/ui/hooks';
import { AddTaskPopUp } from '@task-master/client/containers';

export const Tasks = () => {
  const { showToast } = useToast();
  const { data, loading, refetch } = useQuery(GET_TASKS);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [isAddTaskModalOpen, toggle] = useToggle(false);

  const onDelete = (id: string) => () => {
    deleteTask({
      variables: { id },
      onCompleted: () => {
        showToast('success', 'Task deleted successfully');
        refetch();
      },
      onError: (error) => showToast('error', (error as Error).message),
    });
  };

  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!data?.tasks?.result?.length) {
      return <div>No tasks found</div>;
    }

    const { result } = data.tasks;

    return (
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {result.map((item) => (
          <TaskCard
            key={item.id}
            task={item as Task}
            onDelete={onDelete(item.id)}
          />
        ))}
      </ul>
    );
  };

  return (
    <PageLayout className="space-y-8">
      <PageHeader title="Tasks 📋">
        <Button onClick={toggle} className="flex items-center">
          <PlusIcon className="w-5 h-5" />

          <span>Add Task</span>
        </Button>
      </PageHeader>

      {renderContent()}

      <AddTaskPopUp isVisble={isAddTaskModalOpen} onClose={toggle} />
    </PageLayout>
  );
};
