import {
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { Task } from '@task-master/client/graphql';
import clsx from 'clsx';
import { memo, useEffect, useState } from 'react';

export interface TaskCardProps {
  task: Task;
  onDelete: () => void;
  deleting?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = memo((props) => {
  const { task, onDelete, deleting } = props;
  const { title, description, taskStatus, createdAt } = task;
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const handleDelete = () => {
    setDeleteInProgress(true);
    onDelete();
  };

  useEffect(() => {
    if (!deleting) {
      setDeleteInProgress(false);
    }
  }, [deleting]);

  // createdAt is a timestamp
  const formattedDate = new Date(Number(createdAt)).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  return (
    <li>
      <span
        className={clsx('px-3 py-1 text-xs font-semibold', {
          'bg-blue-100 text-blue-800': taskStatus.status === 'To Do',
          'bg-yellow-100 text-yellow-800': taskStatus.status === 'In Progress',
          'bg-green-100 text-green-800': taskStatus.status === 'Done',
        })}
      >
        {taskStatus.status}
      </span>

      <div className="rounded-lg bg-neutral-800 shadow-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-orange-400 text-xs">{formattedDate}</span>

          <div className="flex gap-2 items-center">
            <button>
              <PencilSquareIcon className="w-6 h-6 text-orange-400" />
            </button>

            <button onClick={handleDelete} disabled={deleteInProgress}>
              {deleteInProgress ? (
                <ArrowPathIcon className="w-6 h-6 text-neutral-400 animate-spin" />
              ) : (
                <TrashIcon className="w-6 h-6 text-red-400" />
              )}
            </button>
          </div>
        </div>

        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-neutral-400 text-sm capitalize">{description}</p>
      </div>
    </li>
  );
});
