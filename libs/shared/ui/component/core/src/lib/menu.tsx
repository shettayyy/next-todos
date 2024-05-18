import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { FC } from 'react';
import { Float, FloatProps } from '@headlessui-float/react';
export interface MenuProps extends Omit<FloatProps, 'children'> {
  button: React.ReactNode;
  children:
    | ((props: { close: () => void }) => React.ReactElement)
    | React.ReactElement;
}

export const Menu: FC<MenuProps> = ({
  children,
  button,
  offset = 4,
  ...restProps
}) => {
  return (
    <Popover className="relative">
      <Float offset={offset} {...restProps}>
        <PopoverButton className="focus:outline-none transition-all">
          {button}
        </PopoverButton>

        <PopoverPanel className="w-48 bg-neutral-700 border-2 border-neutral-600 rounded shadow-lg">
          {({ close }) => {
            // check if children is a function
            if (typeof children === 'function') {
              return children({ close });
            }

            return children;
          }}
        </PopoverPanel>
      </Float>
    </Popover>
  );
};
