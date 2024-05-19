import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { PageHeader } from '@task-master/client/component/layout';
import { useAuth } from '@task-master/client/context';
import { UserItemFragment } from '@task-master/client/graphql';
import { Button } from '@task-master/shared/ui/component/core';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { useToggle } from '@task-master/shared/ui/hooks';
import { useNavigate } from 'react-router-dom';

export const UserProfile = () => {
  const { user } = useAuth();
  const [isEdit, toggle] = useToggle();
  const navigate = useNavigate();

  const onBack = () => {
    navigate('/');
  };

  const renderUserProfile = (user?: UserItemFragment) => {
    if (!user) {
      return null;
    }

    return (
      <div className="flex flex-1 flex-col justify-center items-center gap-4">
        {/* <img
          src={user.avatar}
          alt="User Avatar"
          className="w-24 h-24 rounded-full"
        /> */}

        <div className="flex flex-col items-center gap-2">
          <span className="font-semibold text-xl">
            {user.firstName} {user.lastName}
          </span>

          <span className="text-neutral-500">{user.email}</span>
        </div>
      </div>
    );
  };

  return (
    <PageLayout className="space-y-8">
      <PageHeader title="User Profile 🧑‍💼" onBack={onBack}>
        <Button onClick={toggle} className="flex items-center gap-2">
          <PencilSquareIcon className="w-5 h-5" />

          <span>Edit Profile</span>
        </Button>
      </PageHeader>

      {renderUserProfile(user)}
    </PageLayout>
  );
};
