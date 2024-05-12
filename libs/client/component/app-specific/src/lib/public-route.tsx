import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export interface PublicRouteProps {
  isAuthenticated: boolean;
}

export const PublicRoute: FC<PublicRouteProps> = ({ isAuthenticated }) => {
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};
