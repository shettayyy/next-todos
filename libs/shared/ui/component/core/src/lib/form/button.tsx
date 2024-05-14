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
  const { variant = 'primary', className, ...restProps } = props;

  return (
    <button
      ref={ref}
      className={clsx(
        'border border-transparent shadow-sm bg-slate-100 text-black rounded-md p-2 mt-4 focus:outline-none hover:scale-105 transition-all',
        {
          'bg-slate-100 hover:bg-orange-400': variant === 'primary',
          'bg-red-500 hover:bg-red-600': variant === 'danger',
          'bg-green-500 hover:bg-green-600': variant === 'success',
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
