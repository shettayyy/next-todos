import { FC } from 'react';
import {
  Avatar,
  Header as HeaderCore,
} from '@task-master/shared/ui/component/core';
import { UserItemFragment } from '@task-master/client/graphql';
import { getInitials } from '@task-master/shared/utils';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { LockClosedIcon, UserIcon } from '@heroicons/react/20/solid';

export interface HeaderProps {
  logo: string;
  user?: UserItemFragment;
  onLogout: () => void;
}

export const Header: FC<HeaderProps> = (props) => {
  const { user, logo, onLogout } = props;

  return (
    <HeaderCore logo={<img src={logo} alt="Task Master" className="h-8" />}>
      {user && (
        <Popover className="relative">
          <PopoverButton className="focus:outline-none hover:scale-105 transition-all">
            <Avatar
              text={getInitials(user.firstName, user.lastName)}
              className="w-10 h-10"
            />
          </PopoverButton>

          <PopoverPanel className="absolute right-0 flex-col min-w-60 p-2 bg-neutral-700 border-2 border-neutral-600 rounded shadow-lg">
            <div className="font-semibold bg-neutral-800 mb-4 py-6 flex flex-col items-center gap-2">
              <Avatar
                text={getInitials(user.firstName, user.lastName)}
                className="w-10 h-10"
              />
              {user.firstName} {user.lastName}
            </div>

            <ul>
              <li className="px-4 py-2 text-neutral-200 hover:bg-neutral-600 cursor-pointer hover:scale-105 transition-all">
                <Link to="/profile" className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
              </li>

              <li
                onClick={onLogout}
                className="px-4 py-2 text-neutral-200 hover:bg-neutral-600 cursor-pointer flex items-center gap-2 hover:scale-105 transition-all"
              >
                <LockClosedIcon className="w-5 h-5" />
                <span>Logout</span>
              </li>
            </ul>
          </PopoverPanel>
        </Popover>
      )}
    </HeaderCore>
  );
};
