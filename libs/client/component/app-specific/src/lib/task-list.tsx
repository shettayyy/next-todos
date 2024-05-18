import { ArrowPathIcon, PlusIcon } from '@heroicons/react/20/solid';
import { Task } from '@task-master/client/graphql';
import { Button, InfiniteScroll } from '@task-master/shared/ui/component/core';
import { FC } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { TaskCard } from './task-card';

export interface TaskListProps {
  loading: boolean;
  data?: Task[];
  handleIntersect: () => void;
  renderActionMenu: (task: Task) => JSX.Element;
  toggle: () => void;
}

export const TaskList: FC<TaskListProps> = (props) => {
  const { loading, data, handleIntersect, renderActionMenu, toggle } = props;

  const handleRenderActionMenu = (task: Task) => () => {
    return renderActionMenu(task);
  };

  if (loading && !data) {
    return (
      <div className="justify-center flex items-center flex-1 animate-spin">
        <ArrowPathIcon className="w-12 h-w-12" />
      </div>
    );
  }

  if (!data?.length) {
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

  return (
    <>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
        <Masonry gutter="2rem">
          {data.map((item) => (
            <TaskCard
              key={item.id}
              task={item as Task}
              renderActionMenu={handleRenderActionMenu(item as Task)}
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
