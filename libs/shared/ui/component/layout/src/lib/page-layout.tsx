import { FC, PropsWithChildren } from 'react';

export const PageLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="container mx-auto flex flex-1 flex-col items-center justify-center p-4 sm:px-2">
      {children}
    </main>
  );
};
