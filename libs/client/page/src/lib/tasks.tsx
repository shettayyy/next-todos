import { PageHeader } from '@task-master/client/component/layout';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { Link } from 'react-router-dom';

export const Tasks = () => {
  return (
    <PageLayout>
      <PageHeader title="Tasks">
        <Link
          to="/create-task"
          className="bg-slate-100 text-black py-2 px-4 focus:outline-none transition-all rounded-full shadow-sm hover:bg-orange-400 text-sm"
        >
          Create Task
        </Link>
      </PageHeader>
    </PageLayout>
  );
};
