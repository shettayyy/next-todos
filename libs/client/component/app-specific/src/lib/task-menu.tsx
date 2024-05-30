import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { GetTaskStatusesQuery, Task } from '@task-master/client/graphql';
import { DotMenuIcon, Menu } from '@task-master/shared/ui/component/core';
import { FC } from 'react';
import { TaskStatusMenu } from './task-status-menu';

export interface TaskMenuProps {
  task: Task;
  taskStatuses?: GetTaskStatusesQuery['taskStatuses'];
  updateTaskStatus: (task: Task, statusId: string) => void;
  onEditToggle: (task: Task) => () => void;
  onDeleteToggle: (taskId: string) => () => void;
}

export const TaskMenu: FC<TaskMenuProps> = (props) => {
  const { task, taskStatuses, updateTaskStatus, onEditToggle, onDeleteToggle } =
    props;

  const handleStatusUpdate =
    (close: () => void) => (taskStatus: Task['taskStatus']) => {
      updateTaskStatus(task, taskStatus.id);
      close();
    };

  return (
    <Menu
      btnTestId="task-list-menu-btn"
      button={<DotMenuIcon className="w-5 h-5" />}
      placement="bottom-end"
    >
      {({ close }) => (
        <div data-testid="task-menu">
          {/* Update Statuses */}
          <TaskStatusMenu
            taskStatuses={taskStatuses}
            onChange={handleStatusUpdate(close)}
          />

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
                <div className="px-4 py-2 items-center flex gap-2 hover:scale-105 transition-all">
                  <PencilSquareIcon className="w-5 h-5" />
                  <span>Edit</span>
                </div>
              </li>

              {/* Delete Task */}
              <li
                data-testid="delete-task"
                onClick={onDeleteToggle(task.id)}
                className="text-neutral-200 hover:bg-neutral-600 cursor-pointer"
              >
                <div className="px-4 py-2 items-center flex gap-2 hover:scale-105 transition-all">
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
