import { FC, PropsWithChildren } from 'react';
import { Link, LinkProps } from 'react-router-dom';

export const ButtonLink: FC<PropsWithChildren<LinkProps>> = (props) => {
  const { children, ...rest } = props;

  return (
    <Link
      className="bg-slate-100 text-black py-2 px-3 focus:outline-none transition-all rounded-full shadow-sm hover:bg-orange-400 hover:text-white text-sm justify-center items-center flex gap-1"
      {...rest}
    >
      {children}
    </Link>
  );
};
