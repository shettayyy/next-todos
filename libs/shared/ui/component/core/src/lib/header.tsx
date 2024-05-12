import { FC, PropsWithChildren } from 'react';

export interface HeaderProps {
  logo: React.ReactNode;
}

export const Header: FC<PropsWithChildren<HeaderProps>> = (props) => {
  const { logo, children } = props;

  return (
    <header className="sticky top-0 z-10 bg-neutral-800 shadow-lg">
      <div className="container mx-auto flex items-center justify-between p-4">
        {logo}

        {children}
      </div>
    </header>
  );
};
