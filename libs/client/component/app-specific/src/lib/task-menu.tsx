import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { GetTaskStatusesQuery, Task } from '@task-master/client/graphql';
import { DotMenuIcon, Menu } from '@task-master/shared/ui/component/core';
import { FC } from 'react';

export interface TaskMenuProps {
  task: Task;
  taskStatuses?: GetTaskStatusesQuery['taskStatuses'];
  updateTaskStatus: (
    task: Task,
    statusId: string,
    close: () => void
  ) => () => void;
  onEditToggle: (task: Task) => () => void;
  onDeleteToggle: (taskId: string) => () => void;
}

export const TaskMenu: FC<TaskMenuProps> = (props) => {
  const { task, taskStatuses, updateTaskStatus, onEditToggle, onDeleteToggle } =
    props;

  return (
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
};
