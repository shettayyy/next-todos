import { GetTaskStatusesQuery, TaskStatus } from '@task-master/client/graphql';
import { FC } from 'react';

export interface TaskStatusMenuProps {
  taskStatuses: GetTaskStatusesQuery['taskStatuses'];
  onChange: (status: TaskStatus) => void;
  title?: string;
}

export const TaskStatusMenu: FC<TaskStatusMenuProps> = (props) => {
  const { taskStatuses, onChange, title = '' } = props;

  const handleChange = (status: TaskStatus) => () => {
    onChange(status);
  };

  if (!taskStatuses?.length) {
    return null;
  }

  return (
    <div>
      <h6 className="text-neutral-200 text-sm font-semibold px-4 py-2">
        {title || 'Mark as'}
      </h6>

      <ul>
        {taskStatuses.map((status) => (
          <li
            key={status.id}
            className="text-neutral-200 hover:bg-neutral-600 cursor-pointer"
            onClick={handleChange(status)}
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
  );
};
