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
    <fieldset className="space-y-2">
      <label
        htmlFor={props.id}
        className={clsx(
          'relative block rounded-md border border-gray-200 shadow-sm focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400',
          {
            'border-red-500 ring-red-500': props.error,
          }
        )}
      >
        <textarea
          id={props.id}
          className="peer min-h-[60px] border-none w-full bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 focus:placeholder-slate-400 py-3 text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(23,23,23)] autofill:text-fill-white caret-white"
          ref={ref}
          placeholder={props.label || props.placeholder}
          {...props}
        />

        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 p-0.5 bg-slate-900 text-xs text-white transition-all peer-placeholder-shown:top-5 left-3 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
          {props.label}
        </span>
      </label>

      <div className="text-red-500 text-xs md:text-sm">{props.error}</div>
    </fieldset>
  );
});
