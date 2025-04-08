'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { users } from '../lib/mockData/users'; // Adjust the import path as necessary
import { User, AuthContextType } from '../types';


// Create context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is stored in localStorage (for demo purposes)
    try {
      const storedUser = localStorage.getItem('hr_portal_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // For POC, we're using a simple authentication
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Remove password from user object before storing
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('hr_portal_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('hr_portal_user');
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}