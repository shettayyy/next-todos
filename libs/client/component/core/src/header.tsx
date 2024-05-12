import { FC } from 'react';
import {
  Avatar,
  Header as HeaderCore,
} from '@task-master/shared/ui/component/core';
import { UserItemFragment } from '@task-master/client/graphql';
import { getInitials } from '@task-master/shared/utils';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Link } from 'react-router-dom';

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
          <PopoverButton className="focus:outline-none">
            <Avatar
              text={getInitials(user.firstName, user.lastName)}
              className="w-10 h-10"
            />
          </PopoverButton>

          <PopoverPanel className="absolute right-0 mt-2 w-48 bg-neutral-700 border-2 border-neutral-600 rounded shadow-lg">
            <div className="font-semibold bg-neutral-800 p-4">
              {user.firstName} {user.lastName}
            </div>

            <ul>
              <li className="block px-4 py-2 text-neutral-200 hover:bg-neutral-600 cursor-pointer">
                <Link to="/profile">Profile</Link>
              </li>

              <li
                onClick={onLogout}
                className="block px-4 py-2 text-neutral-200 hover:bg-neutral-600 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </PopoverPanel>
        </Popover>
      )}
    </HeaderCore>
  );
};
