import clsx from 'clsx';
import { FC } from 'react';

// conditional prop to select src or text
type AvatarProps = {
  src?: string;
  alt?: string;
  text?: string;
  className?: string;
} & ({ src: string; alt: string } | { src?: never; alt?: never });

export const Avatar: FC<AvatarProps> = ({ src, alt, text, className }) => {
  if (src) {
    return (
      <img src={src} alt={alt} className={clsx('rounded-full', className)} />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full bg-gray-200 text-black font-semibold flex items-center justify-center hover:bg-orange-400 transition-all',
        className
      )}
    >
      {text}
    </div>
  );
};
