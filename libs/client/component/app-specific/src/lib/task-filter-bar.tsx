import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { GetTaskStatusesQuery, TaskStatus } from '@task-master/client/graphql';
import { Input, Menu } from '@task-master/shared/ui/component/core';
// import { useDebounce } from '@task-master/shared/ui/hooks';
import { FC, useState } from 'react';
import { TaskStatusMenu } from './task-status-menu';

export interface TaskFilterBarProps {
  taskStatuses: GetTaskStatusesQuery['taskStatuses'];
}

const TASK_SORT_OPTIONS = [
  {
    field: 'createdAt',
    label: 'Newest',
    order: 'desc',
  },
  {
    field: 'createdAt',
    label: 'Oldest',
    order: 'asc',
  },
  {
    field: 'updatedAt',
    label: 'Last Modified',
    order: 'desc',
  },
];

export const TaskFilterBar: FC<TaskFilterBarProps> = (props) => {
  const { taskStatuses } = props;
  const [searchTerm, setSearchTerm] = useState('');
  // const debouncedSearch = useDebounce(searchTerm, 500);
  const taskStatusOptions = [
    {
      id: '-1',
      status: 'All',
      bgColor: '#54a3ff',
      textColor: '#ffffff',
    },
    ...(taskStatuses ?? []),
  ];
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(
    taskStatusOptions[0]
  );
  const [selectedSort, setSelectedSort] = useState(TASK_SORT_OPTIONS[0]);

  const onSelectedStatusChange =
    (close: () => void) => (taskStatus: TaskStatus) => {
      setSelectedStatus(taskStatus);
      close();
    };

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full justify-between">
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
        placeholder="Search tasks..."
        id="search-tasks"
        autoComplete="on"
        className="w-full md:w-96"
      />

      <div className="flex items-center gap-4">
        {/* Newest, Oldest, Last Modified Menu */}
        <Menu
          button={
            <div className="flex items-center px-1">
              <span>{selectedSort.label}</span>
              <ChevronDownIcon className="w-5 h-5" />
            </div>
          }
        >
          {({ close }) => (
            <div>
              <h6 className="text-neutral-200 text-sm font-semibold px-4 py-2">
                Sort by
              </h6>

              <ul>
                {TASK_SORT_OPTIONS.map((sort) => (
                  <li
                    key={sort.label}
                    className="text-neutral-200 hover:bg-neutral-600 cursor-pointer"
                    onClick={() => {
                      setSelectedSort(sort);
                      close();
                    }}
                  >
                    <div className="px-4 py-2 flex gap-2 hover:scale-105 transition-all">
                      <span>{sort.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Menu>

        {/* Task Status Filters */}
        <Menu
          button={
            <div className="flex items-center px-1">
              <div className="flex gap-2 hover:scale-105 transition-all items-center">
                <span
                  className={`w-3 h-3 rounded-full`}
                  style={{
                    backgroundColor: selectedStatus.bgColor,
                  }}
                />

                <span>{selectedStatus.status}</span>
              </div>

              <ChevronDownIcon className="w-5 h-5" />
            </div>
          }
        >
          {({ close }) => (
            <TaskStatusMenu
              taskStatuses={taskStatusOptions}
              onChange={onSelectedStatusChange(close)}
              title="Filter by status"
            />
          )}
        </Menu>
      </div>
    </div>
  );
};
