import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiBell, 
  FiMenu, 
  FiUser, 
  FiSettings, 
  FiLogOut, 
  FiChevronDown
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title?: string;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ title = 'Dashboard', setIsMobileSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any[]>([]); // Replace with your notification type
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock notifications data
  useEffect(() => {
    // This would be replaced with actual notifications from your API/context
    setNotifications([
      {
        id: 'n1',
        title: 'Leave Request Approved',
        message: 'Your leave request for Dec 20-27 has been approved.',
        time: '5 min ago',
        read: false
      },
      {
        id: 'n2',
        title: 'New Performance Review',
        message: 'You have a new performance review to acknowledge.',
        time: '1 hour ago',
        read: false
      },
      {
        id: 'n3',
        title: 'Document Verified',
        message: 'Your medical document has been verified.',
        time: '3 hours ago',
        read: true
      }
    ]);
  }, []);

  // Handle mobile sidebar toggle
  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(true);
  };

  // Handle user menu toggle
  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };

  // Handle notifications toggle
  const handleNotificationsToggle = () => {
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };

  // Handle logout
  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <header className="bg-white shadow-sm h-16">
      <div className="flex justify-between items-center h-full px-4 md:px-6">
        {/* Left side - Hamburger menu and title */}
        <div className="flex items-center">
          <button
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={handleMobileSidebarToggle}
          >
            <span className="sr-only">Open sidebar</span>
            <FiMenu className="h-6 w-6" />
          </button>
          <h1 className="ml-2 md:ml-0 text-xl font-semibold text-gray-800">{title}</h1>
        </div>

        {/* Right side - Notifications and User dropdown */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              className="p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={handleNotificationsToggle}
            >
              <span className="sr-only">View notifications</span>
              <FiBell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                  </div>
                  {notifications.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.map((notification) => (
                        <a
                          key={notification.id}
                          href="#"
                          className={`block px-4 py-2 hover:bg-gray-100 ${notification.read ? '' : 'bg-blue-50'}`}
                        >
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">No new notifications</div>
                  )}
                  <div className="border-t border-gray-200 px-4 py-2">
                    <Link href="/notifications" className="text-sm text-primary-600 hover:text-primary-800">
                      View all notifications
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={handleUserMenuToggle}
            >
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-800 font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden md:inline-block text-sm font-medium">
                {user?.name}
              </span>
              <FiChevronDown className="h-4 w-4" />
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-gray-500">{user?.email}</div>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FiUser className="mr-3 h-4 w-4 text-gray-500" />
                    Your Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FiSettings className="mr-3 h-4 w-4 text-gray-500" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <FiLogOut className="mr-3 h-4 w-4 text-gray-500" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;