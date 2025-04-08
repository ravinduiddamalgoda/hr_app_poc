'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../../components/auth/LoginForm';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // While checking authentication status, show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Return null for a moment while redirecting
  return null;
}