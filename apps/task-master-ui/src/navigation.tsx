import { Header } from '@task-master/client/component/core';
import { Container } from '@task-master/shared/ui/component/layout';
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import LogoIcon from './assets/logo.svg';
import { useMemo } from 'react';
import { useAuth } from '@task-master/client/context';
import {
  ProtectedRoute,
  PublicRoute,
} from '@task-master/client/component/app-specific';
import { Login } from '@task-master/client/page';

export const Navigation = () => {
  const { user, isAuthenticated } = useAuth();

  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <Route
            path="/"
            element={
              <Container className="bg-neutral-900 text-slate-100 font-poppins font-light">
                <Header logo={LogoIcon} user={user} />
                <Outlet />
              </Container>
            }
            errorElement={
              <Container className="bg-neutral-900 text-slate-100 font-poppins font-light">
                <Header logo={LogoIcon} user={user} />
                <div>Not Found</div>
              </Container>
            }
          >
            <Route
              element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
            >
              <Route index element={<div>Contact</div>} />
            </Route>

            <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
              <Route index path="login" element={<Login />} />
              <Route path="register" element={<div>Register</div>} />
            </Route>
          </Route>
        )
      ),
    [isAuthenticated, user]
  );

  return <RouterProvider router={router} />;
};
