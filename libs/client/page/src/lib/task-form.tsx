import { PageHeader } from '@task-master/client/component/layout';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { ButtonLink } from '@task-master/client/component/core';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';

export const TaskForm = () => {
  return (
    <PageLayout>
      <PageHeader title="Form">
        <ButtonLink to="/">
          <ChevronLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </ButtonLink>
      </PageHeader>
    </PageLayout>
  );
};
