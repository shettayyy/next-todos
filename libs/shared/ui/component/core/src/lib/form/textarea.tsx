import clsx from 'clsx';
import { FC, HTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends HTMLAttributes<HTMLTextAreaElement> {
  label: string;
  placeholder?: string;
  error?: string;
}

export const Textarea: FC<TextareaProps> = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>((props, ref) => {
  return (
    <fieldset className="flex flex-col gap-2">
      <div>
        <label htmlFor={props.id} className={clsx('block text-xs')}>
          {props.label}
        </label>

        <textarea
          id={props.id}
          className={clsx(
            'mt-1 w-full min-h-28 md:min-h-16 rounded-md border-gray-200 shadow-sm sm:text-sm caret-white py-3 bg-transparent focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400 autofill:shadow-[inset_0_0_0px_1000px_rgb(23,23,23)] autofill:text-fill-white placeholder-neutral-400',
            {
              'border-red-500 ring-red-500': props.error,
            }
          )}
          ref={ref}
          {...props}
        />
      </div>

      <div className="text-red-500 text-xs md:text-sm">{props.error}</div>
    </fieldset>
  );
});
