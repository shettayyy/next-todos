import { PageHeader } from '@task-master/client/component/layout';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_TASK,
  CreateTaskInput,
  DELETE_TASK,
  GET_TASKS,
  Task,
} from '@task-master/client/graphql';
import { TaskCard } from '@task-master/client/component/app-specific';
import { useToast } from '@task-master/client/context';
import {
  Button,
  ConfirmModal,
  DotMenuIcon,
  InfiniteScroll,
} from '@task-master/shared/ui/component/core';
import { useToggle } from '@task-master/shared/ui/hooks';
import { AddTaskPopUp } from '@task-master/client/containers';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useCallback, useState } from 'react';

const LIMIT = 40;

export const Tasks = () => {
  const { showToast } = useToast();

  const [isAddTaskModalOpen, toggle] = useToggle(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | undefined>(
    undefined
  );

  // Get tasks query to fetch tasks
  const { data, loading, fetchMore, refetch } = useQuery(GET_TASKS, {
    variables: {
      input: {
        page: 1,
        limit: LIMIT,
        filter: {
          search: '',
          status: '',
        },
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  // Delete task mutation to delete a task
  const [deleteTask, { loading: deleting }] = useMutation(DELETE_TASK);

  // Create task mutation to create a new task
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

        refetch();

        toggle();
      },
    });
  };

  const nextPage = data?.tasks?.metadata.pagination.nextPage;

  const onDeleteToggle = (id?: string) => () =>
    setDeleteTaskId((prev) => {
      if (prev === id) {
        return undefined;
      }

      return id;
    });

  const handleIntersect = useCallback(() => {
    if (!loading && nextPage) {
      fetchMore({
        variables: {
          input: {
            page: nextPage,
            limit: LIMIT,
            filter: {
              search: '',
              status: '',
            },
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          if (!fetchMoreResult.tasks?.result?.length) {
            return prev;
          }

          return {
            tasks: {
              ...fetchMoreResult.tasks,
              result: [
                ...(prev.tasks?.result ?? []),
                ...fetchMoreResult.tasks.result,
              ],
            },
          };
        },
      });
    }
  }, [nextPage, fetchMore, loading]);

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
    // if (loading && !data) {
    //   return <div>Loading...</div>;
    // }

    if (!data?.tasks?.result?.length) {
      return <div>No tasks found</div>;
    }

    const { result } = data.tasks;

    return (
      <>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {result.map((item) => (
            <TaskCard
              key={item.id}
              task={item as Task}
              renderAction={renderAction(item as Task)}
            />
          ))}
        </ul>

        <InfiniteScroll onIntersect={handleIntersect} />

        {loading && <ArrowPathIcon className="w-10 h-10 py-4 animate-spin" />}
      </>
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

      <AddTaskPopUp
        isVisble={isAddTaskModalOpen}
        onClose={toggle}
        submitting={submitting}
        onSubmit={onSubmit}
      />

      <ConfirmModal
        isOpen={!!deleteTaskId}
        onClose={onDeleteToggle()}
        confirmBtnLabel={deleting ? 'Deleting...' : 'Delete'}
        pending={deleting}
        onConfirm={deleteTaskId ? onDelete(deleteTaskId) : () => null}
      />
    </PageLayout>
  );
};
