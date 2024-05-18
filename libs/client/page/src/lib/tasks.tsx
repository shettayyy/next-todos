import { PageHeader } from '@task-master/client/component/layout';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { PlusIcon } from '@heroicons/react/20/solid';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_TASK,
  CreateTaskInput,
  DELETE_TASK,
  GET_TASKS,
  GET_TASK_STATUSES,
  Task,
  UPDATE_TASK,
} from '@task-master/client/graphql';
import { useToast } from '@task-master/client/context';
import { useToggle } from '@task-master/shared/ui/hooks';
import { useCallback, useRef, useState } from 'react';
import {
  TaskFilterBar,
  TaskFilters,
  TaskList,
  TaskMenu,
} from '@task-master/client/component/app-specific';
import { Button, ConfirmModal } from '@task-master/shared/ui/component/core';
import { AddTaskPopUp } from '@task-master/client/containers';

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
        },
      },
    },
    notifyOnNetworkStatusChange: true,
  });
  const { loading: statusFetching, data: dataTaskStatuses } = useQuery(
    GET_TASK_STATUSES,
    {
      onError: (error) => {
        showToast('error', error.message, {
          toastId: 'task-statuses-error',
        });
      },
    }
  );
  const taskStatuses = dataTaskStatuses?.taskStatuses;
  const editTask = useRef<Task | null>(null);

  // Delete task mutation to delete a task
  const [deleteTask, { loading: deleting }] = useMutation(DELETE_TASK);

  // Create task mutation to create a new task
  const [createTask, { loading: addingTask }] = useMutation(CREATE_TASK);
  const [updateTask, { loading: updatingTask }] = useMutation(UPDATE_TASK);

  const nextPage = data?.tasks?.metadata.pagination.nextPage;

  // Filters ref
  const filtersRef = useRef<TaskFilters>();

  /**
   * Create a new task
   *
   * @param data The task details to create
   * @returns void
   */
  const onSubmit = (data: CreateTaskInput) => {
    const submitOptions = {
      onCompleted: () => {
        showToast('success', 'Task created successfully', {
          toastId: 'task-created',
        });

        refetch();

        toggle();
      },
      onError: (error: unknown) => showToast('error', (error as Error).message),
    };

    if (editTask.current) {
      updateTask({
        variables: {
          id: editTask.current.id,
          input: data,
        },
        ...submitOptions,
      });
    } else {
      createTask({
        variables: { input: data },
        ...submitOptions,
      });
    }
  };

  /**
   * Toggle delete task modal
   *
   * @param id The task ID to delete
   * @returns void
   */
  const onDeleteToggle = (id?: string) => () =>
    setDeleteTaskId((prev) => {
      if (prev === id) {
        return undefined;
      }

      return id;
    });

  /**
   * Toggle edit task modal
   */
  const onEditToggle = (task: Task) => () => {
    editTask.current = task;
    toggle();
  };

  /**
   * Close add task modal
   *
   * @returns void
   */
  const onAddTaskClose = () => {
    editTask.current = null;
    toggle();
  };

  /**
   * Handle intersect to fetch more tasks
   *
   * @returns void
   */
  const handleIntersect = useCallback(() => {
    if (!loading && nextPage) {
      fetchMore({
        variables: {
          input: {
            page: nextPage,
            limit: LIMIT,
            filter: {
              search: filtersRef.current?.searchTerm,
              ...(filtersRef.current?.selectedStatus.id !== '-1' && {
                status: filtersRef.current?.selectedStatus.id,
              }),
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

  /**
   * Delete a task
   *
   * @param id The task ID to delete
   * @returns void
   */
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

  const updateTaskStatus = (task: Task, statusId: Task['status']) => {
    updateTask({
      variables: {
        id: task.id,
        input: {
          status: statusId,
        },
      },
      onCompleted: () => {
        showToast('success', 'Task status updated successfully');
        refetch();
      },
      onError: (error) => showToast('error', (error as Error).message),
    });
  };

  const onFilterChange = useCallback(
    (filters: TaskFilters) => {
      filtersRef.current = filters;

      refetch({
        input: {
          page: 1,
          limit: LIMIT,
          filter: {
            search: filters.searchTerm,
            ...(filters.selectedStatus.id !== '-1' && {
              status: filters.selectedStatus.id,
            }),
          },
        },
      });
    },
    [refetch]
  );

  /**
   * Render action menu for a task
   *
   * @param task The task details required for the action menu
   * @returns JSX.Element
   */
  const renderAction = (task: Task) => (
    <TaskMenu
      task={task}
      taskStatuses={taskStatuses}
      updateTaskStatus={updateTaskStatus}
      onEditToggle={onEditToggle}
      onDeleteToggle={onDeleteToggle}
    />
  );

  return (
    <PageLayout className="space-y-8">
      <PageHeader title="Tasks 📋">
        <Button onClick={toggle} className="flex items-center">
          <PlusIcon className="w-5 h-5" />

          <span>Add Task</span>
        </Button>
      </PageHeader>

      {/* Filters Bar */}
      <TaskFilterBar
        taskStatuses={taskStatuses}
        onFilterChange={onFilterChange}
      />

      <TaskList
        data={data?.tasks?.result as Task[]}
        loading={loading}
        handleIntersect={handleIntersect}
        renderActionMenu={renderAction}
        toggle={toggle}
      />

      <AddTaskPopUp
        isVisble={isAddTaskModalOpen}
        onClose={onAddTaskClose}
        submitting={addingTask || updatingTask}
        onSubmit={onSubmit}
        defaultValues={editTask.current ?? undefined}
        taskStatuses={taskStatuses}
        statusFetching={statusFetching}
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
