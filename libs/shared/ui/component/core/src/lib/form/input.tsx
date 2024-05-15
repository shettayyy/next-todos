import clsx from 'clsx';
import { FC, HTMLAttributes, HTMLInputTypeAttribute, forwardRef } from 'react';

export interface InputProps extends HTMLAttributes<HTMLInputElement> {
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  error?: string;
}

export const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return (
      <fieldset className="flex flex-col gap-2">
        <div>
          <label htmlFor={props.id} className={clsx('block text-xs')}>
            {props.label}
          </label>

          <input
            type="text"
            id={props.id}
            className={clsx(
              'mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm caret-white py-3 bg-transparent focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400 autofill:shadow-[inset_0_0_0px_1000px_rgb(23,23,23)] autofill:text-fill-white  placeholder-neutral-400',
              {
                'border-red-500 ring-red-500': props.error,
              }
            )}
            ref={ref}
            {...props}
          />
        </div>

        <p className="text-red-500 text-xs md:text-sm">{props.error}</p>
      </fieldset>
    );
  }
);
