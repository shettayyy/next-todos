import { Task } from '@task-master/client/graphql';
import clsx from 'clsx';
import { DetailedHTMLProps, memo } from 'react';

export interface TaskCardProps
  extends DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  task: Task;
  renderActionMenu?: (task: Task) => React.ReactNode;
}

export const TaskCard: React.FC<TaskCardProps> = memo((props) => {
  const { task, renderActionMenu, ...restProps } = props;
  const { title, description, taskStatus, createdAt } = task;

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
    <div {...restProps}>
      <span
        className={clsx('px-3 py-1 text-xs font-semibold')}
        style={{
          backgroundColor: taskStatus.bgColor,
          color: taskStatus.textColor,
        }}
      >
        {taskStatus.status}
      </span>

      <div className="rounded-lg bg-neutral-800 shadow-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-orange-400 text-xs">{formattedDate}</span>

          {renderActionMenu?.(task)}
        </div>

        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-neutral-400 text-sm capitalize">{description}</p>
      </div>
    </div>
  );
});
