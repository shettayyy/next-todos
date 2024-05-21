import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { FC, HTMLAttributes, PropsWithChildren } from 'react';

export interface PageHeaderProps
  extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  title: string;
  onBack?: () => void;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  className,
  children,
  onBack,
}) => {
  return (
    <div className={clsx('flex justify-between items-center', className)}>
      <h2 className="flex items-center font-raleway tracking-widest font-bold uppercase text-lg md:text-2xl">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-400"
          >
            <ChevronLeftIcon className="w-10 h-10" />
          </button>
        )}
        <span>{title}</span>
      </h2>

      {children}
    </div>
  );
};
