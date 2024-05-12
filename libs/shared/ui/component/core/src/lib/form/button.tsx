import { FC, forwardRef } from 'react';
import clsx from 'clsx';

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: 'primary' | 'danger' | 'success';
}

export const Button: FC<ButtonProps> = forwardRef<
  HTMLButtonElement,
  ButtonProps
>((props, ref) => {
  const { variant = 'primary' } = props;

  return (
    <button
      ref={ref}
      className={clsx(
        'border border-transparent shadow-sm bg-slate-100 text-black rounded-md p-2 mt-4 focus:outline-none transition-all',
        props.className,
        {
          'bg-slate-100 hover:bg-slate-400': variant === 'primary',
          'bg-red-500 hover:bg-red-600': variant === 'danger',
          'bg-green-500 hover:bg-green-600': variant === 'success',
        }
      )}
      {...props}
    >
      {props.children}
    </button>
  );
});
