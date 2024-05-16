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
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

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
      onError: (error) => showToast('error', (error as Error).message),
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
          if (!fetchMoreResult?.tasks?.result?.length) {
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
    if (loading && !data) {
      return (
        <div className="justify-center flex items-center flex-1 animate-spin">
          <ArrowPathIcon className="w-12 h-w-12" />
        </div>
      );
    }

    if (!data?.tasks?.result?.length) {
      return (
        <div className="flex flex-col gap-6 flex-1 justify-center items-center">
          <div className="flex flex-col gap-2 justify-center items-center">
            <h4 className="text-2xl text-orange-400">
              No tasks found!
              <span className="ml-2" role="img" aria-label="Sad face">
                🥺
              </span>
            </h4>
            <p className="text-neutral-300 text-center">
              Create a new task to get started
            </p>
          </div>

          <Button onClick={toggle} className="flex items-center">
            <PlusIcon className="w-5 h-5" />

            <span>Create a new task</span>
          </Button>
        </div>
      );
    }

    const { result } = data.tasks;

    return (
      <>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter="2rem">
            {result.map((item) => (
              <TaskCard
                key={item.id}
                task={item as Task}
                renderAction={renderAction(item as Task)}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>

        {loading && (
          <ArrowPathIcon className="w-12 h-w-12 py-4 animate-spin self-center" />
        )}

        <InfiniteScroll threshold={0.5} onIntersect={handleIntersect} />
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
