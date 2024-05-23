import { FC, forwardRef } from 'react';
import clsx from 'clsx';

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: 'primary' | 'danger' | 'success' | 'default';
}

export const Button: FC<ButtonProps> = forwardRef<
  HTMLButtonElement,
  ButtonProps
>((props, ref) => {
  const { variant = 'primary', className, ...restProps } = props;

  return (
    <button
      ref={ref}
      className={clsx(
        'border border-transparent shadow-sm text-black rounded-md p-2 focus:outline-none hover:scale-105 transition-all text-sm',
        {
          'bg-slate-100 hover:bg-orange-400': variant === 'primary',
          'bg-slate-100 hover:text-black': variant === 'default',
          'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
          'bg-green-500 text-white hover:bg-green-600': variant === 'success',
          'cursor-not-allowed opacity-50': props.disabled,
        },
        className
      )}
      {...restProps}
    >
      {props.children}
    </button>
  );
});
