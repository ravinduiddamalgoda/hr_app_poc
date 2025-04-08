import React, { useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayoutProps } from '../../types';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          title={title}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white p-4 border-t border-gray-200">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} HR Portal. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;