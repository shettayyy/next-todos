import clsx from 'clsx';
import { forwardRef } from 'react';

export interface RadioboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Array of options
   *
   * @example
   *
   * const options = [
   * { value: 'red', label: 'Red' },
   * { value: 'blue', label: 'Blue' },
   * { value: 'green', label: 'Green' },
   * ];
   */
  option: {
    value: string;
    label: string;
  };
  /**
   * Error message
   *
   * @default undefined
   *
   * @example
   *
   * 'This field is required'
   */
  error?: string;
  /**
   * Style prop
   *
   * @default undefined
   *
   * @example
   * { color: 'red' }
   */
  labelStyle?: React.CSSProperties;
}

/**
 * Radiobox component
 *
 * @param options - Array of options
 * @param ref - Ref for input element
 * @param restProps - Rest of the props
 *
 * @returns Radiobox component
 *
 * @example
 *
 * const options = [
 *  { value: 'red', label: 'Red' },
 *  { value: 'blue', label: 'Blue' },
 *  { value: 'green', label: 'Green' },
 * ];
 *
 * <Radiobox options={options} ref={ref} {...restProps} />
 */
export const Radiobox = forwardRef<HTMLInputElement, RadioboxProps>(
  (props, ref) => {
    const { option, error, labelStyle, ...restProps } = props;

    return (
      <label
        key={option.value}
        htmlFor={option.value}
        className={clsx(
          'flex cursor-pointer items-center justify-center rounded-md bg-white px-2 md:px-4 py-2 text-gray-900 transition-all duration-200 ease-in-out has-[:checked]:border-orange-400 has-[:checked]:bg-orange-400 pointer-events-auto hover:scale-105',
          {
            'border-red-500 border': !!error,
          }
        )}
        style={labelStyle}
      >
        <input
          {...restProps}
          type="radio"
          value={option.value}
          id={option.value}
          className="sr-only"
          ref={ref}
          checked={restProps.value === option.value}
        />

        <p className="text-xs md:text-sm font-medium">{option.label}</p>
      </label>
    );
  }
);
