import { PageHeader } from '@task-master/client/component/layout';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { PlusIcon } from '@heroicons/react/20/solid';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_TASK, GET_TASKS, Task } from '@task-master/client/graphql';
import { TaskCard } from '@task-master/client/component/app-specific';
import { useToast } from '@task-master/client/context';
import {
  Button,
  DotMenuIcon,
  Modal,
} from '@task-master/shared/ui/component/core';
import { useToggle } from '@task-master/shared/ui/hooks';
import { AddTaskPopUp } from '@task-master/client/containers';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useState } from 'react';

export const Tasks = () => {
  const { showToast } = useToast();
  const { data, loading, refetch } = useQuery(GET_TASKS);
  const [deleteTask, { loading: deleting }] = useMutation(DELETE_TASK);
  const [isAddTaskModalOpen, toggle] = useToggle(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | undefined>(
    undefined
  );

  const onDeleteToggle = (id?: string) => () =>
    setDeleteTaskId((prev) => {
      if (prev === id) {
        return undefined;
      }

      return id;
    });

  const onDelete = (id: string) => () => {
    deleteTask({
      variables: { id },
      onCompleted: () => {
        showToast('success', 'Task deleted successfully');
        onDeleteToggle()();
        refetch();
      },
      onError: (error) => showToast('error', (error as Error).message),
    });
  };

  const renderAction = (task: Task) => () =>
    (
      <Popover className="relative">
        <PopoverButton className="focus:outline-none hover:scale-125 transition-all">
          <DotMenuIcon className="w-5 h-5" />
        </PopoverButton>

        <PopoverPanel className="absolute right-0 mt-2 w-48 bg-neutral-700 border-2 border-neutral-600 rounded shadow-lg">
          <ul>
            <li
              onClick={onDeleteToggle(task.id)}
              className="block px-4 py-2 text-neutral-200 hover:bg-neutral-600 cursor-pointer"
            >
              Delete
            </li>
          </ul>
        </PopoverPanel>
      </Popover>
    );

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
            renderAction={renderAction(item as Task)}
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

      <Modal
        isOpen={!!deleteTaskId}
        onClose={onDeleteToggle()}
        title="🗑️ Delete Task"
      >
        <p>Are you sure you want to delete this task?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onDeleteToggle()}>Cancel</Button>

          {deleteTaskId && (
            <Button
              disabled={deleting}
              onClick={onDelete(deleteTaskId)}
              variant="danger"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
        </div>
      </Modal>
    </PageLayout>
  );
};
