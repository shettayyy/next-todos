import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export interface ProtectedRouteProps {
  isAuthenticated: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  isAuthenticated,
}) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
