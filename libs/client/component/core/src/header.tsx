import { FC } from 'react';
import {
  Header as HeaderCore,
  Menu,
  UserAvatar,
} from '@task-master/shared/ui/component/core';
import { UserItemFragment } from '@task-master/client/graphql';
import { Link, useNavigate } from 'react-router-dom';
import { LockClosedIcon, UserIcon } from '@heroicons/react/20/solid';

export interface HeaderProps {
  logo: string;
  user?: UserItemFragment;
  onLogout: () => void;
}

export const Header: FC<HeaderProps> = (props) => {
  const { user, logo, onLogout } = props;
  const navigate = useNavigate();

  const onProfileClick = (close: () => void) => () => {
    close();
    navigate('/user-profile');
  };

  const handleLogout = (close: () => void) => () => {
    close();
    onLogout();
  };

  return (
    <HeaderCore
      logo={
        <Link to="/">
          <img src={logo} alt="Task Master" className="h-8" />
        </Link>
      }
    >
      {user && (
        <Menu
          placement="bottom-end"
          button={
            <UserAvatar
              url={user.profilePictureURL ?? ''}
              firstName={user.firstName}
              lastName={user.lastName}
              width={3}
              height={3}
            />
          }
        >
          {({ close }) => (
            <>
              <div className="font-semibold bg-neutral-800 mb-4 py-6 flex flex-col items-center gap-2">
                <UserAvatar
                  url={user.profilePictureURL ?? ''}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  width={4}
                  height={4}
                />
                {user.firstName} {user.lastName}
              </div>

              <ul>
                <li
                  className="text-neutral-200 hover:bg-neutral-600 cursor-pointer hover:scale-105 transition-all px-4 py-2 flex items-center gap-2"
                  onClick={onProfileClick(close)}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Profile</span>
                </li>

                <li
                  onClick={handleLogout(close)}
                  className="px-4 py-2 text-neutral-200 hover:bg-neutral-600 cursor-pointer flex items-center gap-2 hover:scale-105 transition-all"
                >
                  <LockClosedIcon className="w-5 h-5" />
                  <span>Logout</span>
                </li>
              </ul>
            </>
          )}
        </Menu>
      )}
    </HeaderCore>
  );
};
