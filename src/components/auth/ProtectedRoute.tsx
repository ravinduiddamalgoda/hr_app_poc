'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, ProtectedRouteProps } from '../../types';

// Component to protect routes that require authentication
const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  requiredPermissions = []
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  const { error } = useNotification();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      error('You must be logged in to access this page');
      router.push('/login');
      return;
    }

    // If role check is required
    if (!loading && isAuthenticated && requiredRole && user) {
      if (user.role !== requiredRole && user.role !== 'admin') { // Admin can access everything
        error(`You need ${requiredRole} access for this page`);
        router.push('/dashboard');
        return;
      }
    }

    // If permissions check is required
    if (!loading && isAuthenticated && requiredPermissions.length > 0 && user) {
      // Check if user has all required permissions or is admin
      const hasAllPermissions = requiredPermissions.every(
        permission => user.permissions.includes(permission) || user.permissions.includes('all')
      );

      if (!hasAllPermissions) {
        error('You do not have permission to access this page');
        router.push('/dashboard');
        return;
      }
    }
  }, [loading, isAuthenticated, user, requiredRole, requiredPermissions, router, error]);

  // Show loading or null while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return null;
  }

  // If role check is required and user doesn't have the role
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return null;
  }

  // If permissions check is required and user doesn't have all permissions
  if (requiredPermissions.length > 0 && user) {
    const hasAllPermissions = requiredPermissions.every(
      permission => user.permissions.includes(permission) || user.permissions.includes('all')
    );

    if (!hasAllPermissions) {
      return null;
    }
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;