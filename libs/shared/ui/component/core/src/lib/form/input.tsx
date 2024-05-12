import { FC, HTMLAttributes, HTMLInputTypeAttribute, forwardRef } from 'react';

export interface InputProps extends HTMLAttributes<HTMLInputElement> {
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
}

export const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return (
      <label
        htmlFor={props.id}
        className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
      >
        <input
          type="text"
          id={props.id}
          className="peer border-none w-full bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 focus:placeholder-slate-400 py-3 text-sm"
          ref={ref}
          placeholder={props.label || props.placeholder}
          {...props}
        />

        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 p-0.5 bg-slate-900 text-xs text-white transition-all peer-placeholder-shown:top-1/2 left-3 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
          {props.label}
        </span>
      </label>
    );
  }
);
