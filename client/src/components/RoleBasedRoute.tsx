import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import type { UserType } from '../context/UserContext';

interface RoleBasedRouteProps {
  allowedRoles: UserType[];
}

const RoleBasedRoute = ({ allowedRoles }: RoleBasedRouteProps) => {
  const { user } = useUser();

  if (!user.isLoggedIn || !allowedRoles.includes(user.type)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
