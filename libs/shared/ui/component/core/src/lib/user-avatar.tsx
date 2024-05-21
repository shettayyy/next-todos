import { getInitials } from '@task-master/shared/utils';
import { Avatar } from './avatar';
import { FC } from 'react';

export interface UserAvatarProps {
  url?: string;
  firstName?: string;
  lastName?: string;
  width?: number;
  height?: number;
}

export const UserAvatar: FC<UserAvatarProps> = ({
  url = '',
  firstName = '-',
  lastName = '-',
  width = 4,
  height = 4,
}) => {
  if (url) {
    return (
      <div
        className="rounded-full bg-neutral-200"
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: `${width}rem`,
          height: `${height}rem`,
        }}
      />
    );
  }

  return (
    <Avatar text={getInitials(firstName, lastName)} className="w-16 h-16" />
  );
};
