import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleProtectedRoute({ allowRoles, requireApprovedVendor = false, redirectTo = '/login' }) {
  const { user, isAuthenticated, getDefaultRouteForUser } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowRoles?.length && !allowRoles.includes(user.role)) {
    return <Navigate to={getDefaultRouteForUser(user)} replace />;
  }

  if (requireApprovedVendor && user.role === 'vendor' && user.vendorStatus !== 'approved') {
    return <Navigate to="/vendor/pending" replace />;
  }

  return <Outlet />;
}
