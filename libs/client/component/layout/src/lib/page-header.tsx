import clsx from 'clsx';
import { FC, HTMLAttributes, PropsWithChildren } from 'react';

export interface PageHeaderProps
  extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  title: string;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  className,
  children,
}) => {
  return (
    <div className={clsx('flex justify-between items-center', className)}>
      <h2 className="font-raleway tracking-widest font-bold uppercase text-2xl">
        {title}
      </h2>

      {children}
    </div>
  );
};
