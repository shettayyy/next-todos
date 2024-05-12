import { ButtonLink } from '@task-master/client/component/core';
import { Container } from '@task-master/client/component/layout';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { FC, HTMLAttributes, PropsWithChildren } from 'react';

export const NotFound: FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = (
  props
) => {
  const { children, ...rest } = props;
  return (
    <Container {...rest}>
      {children}

      <PageLayout className="justify-center items-center">
        <h1 className="text-9xl font-bold text-orange-400 mb-4">404</h1>
        <p className="text-2xl font-bold mb-8">Oops! Page Not Found</p>

        <div className="flex justify-center mb-8 animate-pulse">
          <span role="img" aria-label="Sad face" className="text-6xl mr-2">
            🥺
          </span>
        </div>

        <p className="text-lg mb-8">
          Looks like the page you're looking for doesn't exist or has been
          moved.
          <br />
          Let's get you back on track!
        </p>

        <ButtonLink to="/">Go Home</ButtonLink>
      </PageLayout>
    </Container>
  );
};
