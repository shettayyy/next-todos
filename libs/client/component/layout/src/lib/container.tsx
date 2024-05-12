import { Container as ContainerLayout } from '@task-master/shared/ui/component/layout';
import clsx from 'clsx';
import { HTMLAttributes, PropsWithChildren } from 'react';

export const Container: React.FC<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
> = ({ children, className }) => (
  <ContainerLayout
    className={clsx(
      'bg-neutral-900 text-slate-100 font-poppins font-light',
      className
    )}
  >
    {children}
  </ContainerLayout>
);
