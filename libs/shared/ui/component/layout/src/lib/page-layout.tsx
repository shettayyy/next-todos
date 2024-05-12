import clsx from 'clsx';
import { FC, HTMLAttributes, PropsWithChildren } from 'react';

export const PageLayout: FC<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
> = ({ children, className }) => {
  return (
    <main
      className={clsx(
        'container mx-auto flex flex-1 flex-col p-4 sm:px-2',
        className
      )}
    >
      {children}
    </main>
  );
};
