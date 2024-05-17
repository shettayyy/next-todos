import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { DotMenuIcon } from '@task-master/shared/ui/component/core';
import { FC, PropsWithChildren } from 'react';

export const TaskCardMenu: FC<PropsWithChildren> = ({ children }) => (
  <Popover className="relative">
    <PopoverButton className="focus:outline-none hover:scale-125 transition-all">
      <DotMenuIcon className="w-5 h-5" />
    </PopoverButton>

    <PopoverPanel className="absolute right-0 mt-2 w-48 bg-neutral-700 border-2 border-neutral-600 rounded shadow-lg">
      {children}
    </PopoverPanel>
  </Popover>
);
