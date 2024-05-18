import { PageHeader } from '@task-master/client/component/layout';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
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
import { TaskList } from '@task-master/client/component/app-specific';
import {
  Button,
  ConfirmModal,
  DotMenuIcon,
  Menu,
} from '@task-master/shared/ui/component/core';
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
          status: '',
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

  const updateTaskStatus =
    (task: Task, statusId: Task['status'], close: () => void) => () => {
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

      close();
    };

  /**
   * Render action menu for a task
   *
   * @param task The task details required for the action menu
   * @returns JSX.Element
   */
  const renderAction = (task: Task) => (
    <Menu button={<DotMenuIcon className="w-5 h-5" />}>
      {({ close }) => (
        <div>
          {/* Update Statuses */}
          {taskStatuses?.length && (
            <div>
              <h6 className="text-neutral-200 text-sm font-semibold px-4 py-2">
                Mark as
              </h6>

              <ul>
                {taskStatuses.map((status) => (
                  <li
                    key={status.id}
                    className="text-neutral-200 hover:bg-neutral-600 cursor-pointer"
                    onClick={updateTaskStatus(task, status.id, close)}
                  >
                    <div className="px-4 py-2 flex gap-2 hover:scale-105 transition-all items-center">
                      <span
                        className={`w-3 h-3 rounded-full`}
                        style={{
                          backgroundColor: status.bgColor,
                        }}
                      />

                      <span>{status.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="w-0.5 h-full bg-neutral-200 mx-auto" />

          <div>
            {/* Actions */}
            <h6 className="text-neutral-200 text-sm font-semibold px-4 py-2">
              Actions
            </h6>

            <ul>
              {/* Edit Task */}
              <li
                className="text-neutral-200 hover:bg-neutral-600 cursor-pointer"
                onClick={onEditToggle(task)}
              >
                <div className="px-4 py-2 flex gap-2 hover:scale-105 transition-all">
                  <PlusIcon className="w-5 h-5" />
                  <span>Edit</span>
                </div>
              </li>

              {/* Delete Task */}
              <li
                onClick={onDeleteToggle(task.id)}
                className="text-neutral-200 hover:bg-neutral-600 cursor-pointer"
              >
                <div className="px-4 py-2 flex gap-2 hover:scale-105 transition-all">
                  <TrashIcon className="w-5 h-5 text-red-500" />
                  <span>Delete</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Menu>
  );

  return (
    <PageLayout className="space-y-8">
      <PageHeader title="Tasks 📋">
        <Button onClick={toggle} className="flex items-center">
          <PlusIcon className="w-5 h-5" />

          <span>Add Task</span>
        </Button>
      </PageHeader>

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
