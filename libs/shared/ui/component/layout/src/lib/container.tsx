import clsx from 'clsx';
import { FC, HTMLAttributes, PropsWithChildren } from 'react';

export type ContainerProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export const Container: FC<ContainerProps> = (props) => {
  const { children, className } = props;

  return (
    <div className={clsx('mx-auto flex flex-col h-screen', className)}>
      {children}
    </div>
  );
};
