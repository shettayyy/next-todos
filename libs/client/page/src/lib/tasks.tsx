import { PageHeader } from '@task-master/client/component/layout';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { ButtonLink } from '@task-master/client/component/core';
import { PlusIcon } from '@heroicons/react/20/solid';

export const Tasks = () => {
  return (
    <PageLayout>
      <PageHeader title="Tasks">
        <ButtonLink to="/add-task">
          <PlusIcon className="w-5 h-5" />

          <span>Add Task</span>
        </ButtonLink>
      </PageHeader>
    </PageLayout>
  );
};
