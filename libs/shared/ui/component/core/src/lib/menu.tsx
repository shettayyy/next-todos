import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { FC } from 'react';

export interface MenuProps {
  button: React.ReactNode;
  children:
    | ((props: { close: () => void }) => React.ReactElement)
    | React.ReactElement;
}

export const Menu: FC<MenuProps> = ({ children, button }) => (
  <Popover className="relative">
    <PopoverButton className="focus:outline-none hover:scale-125 transition-all">
      {button}
    </PopoverButton>

    <PopoverPanel className="absolute right-0 mt-2 w-48 bg-neutral-700 border-2 border-neutral-600 rounded shadow-lg z-10">
      {({ close }) => {
        // check if children is a function
        if (typeof children === 'function') {
          return children({ close });
        }

        return children;
      }}
    </PopoverPanel>
  </Popover>
);
