import { Navigate } from 'react-router-dom';
import React from 'react';
import useUserState from '../state/useUserState';

export const AdminGuard = ({ children }: React.PropsWithChildren) => {
  const { user } = useUserState();

  if (!user) {
    return <Navigate to={'/'} replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
