import { FC } from 'react';
import { Header as HeaderCore } from '@task-master/shared/ui/component/core';
import { UserItemFragment } from '@task-master/client/graphql';

export interface HeaderProps {
  logo: string;
  user?: UserItemFragment;
}

export const Header: FC<HeaderProps> = (props) => {
  const { user, logo } = props;

  return (
    <HeaderCore logo={<img src={logo} alt="Task Master" className="h-8" />}>
      {user && (
        <div className="flex items-center space-x-4">
          <p>Welcome, {user.firstName}</p>
          <span>Logout</span>
        </div>
      )}
    </HeaderCore>
  );
};
