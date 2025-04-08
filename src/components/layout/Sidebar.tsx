import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiFileText, 
  FiAlertTriangle, 
  FiClipboard, 
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { isAdmin, isHRorAdmin } from '../../lib/auth';

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isMobileSidebarOpen,
  setIsMobileSidebarOpen
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    employees: false,
    leave: false,
    medical: false,
    disciplinary: false,
    performance: false,
    settings: false
  });

  // Check if user is admin or HR
  const isUserAdmin = user ? isAdmin(user) : false;
  const isUserHRorAdmin = user ? isHRorAdmin(user) : false;

  // Expand menus based on current path
  useEffect(() => {
    if (pathname) {
      const menuKeys = Object.keys(expandedMenus);
      const updatedMenus = { ...expandedMenus };
      
      menuKeys.forEach(key => {
        if (pathname.includes(`/${key}`)) {
          updatedMenus[key] = true;
        }
      });
      
      setExpandedMenus(updatedMenus);
    }
  }, [pathname]);

  // Toggle menu expansion
  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // Check if a menu item is active
  const isMenuActive = (path: string) => {
    return pathname === path;
  };

  // Handle mobile sidebar close
  const handleCloseMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  // Sidebar nav items based on user role
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <FiHome className="h-5 w-5" />,
      showFor: 'all'
    },
    {
      name: 'Employees',
      path: '/employees',
      icon: <FiUsers className="h-5 w-5" />,
      showFor: 'hradmin',
      submenu: [
        { name: 'All Employees', path: '/employees' },
        { name: 'Add Employee', path: '/employees/add' }
      ]
    },
    {
      name: 'Leave Management',
      path: '/leave',
      icon: <FiCalendar className="h-5 w-5" />,
      showFor: 'all',
      submenu: [
        { name: 'Leave Requests', path: '/leave' },
        { name: 'Request Leave', path: '/leave/request' }
      ]
    },
    {
      name: 'Medical Documents',
      path: '/medical',
      icon: <FiFileText className="h-5 w-5" />,
      showFor: 'all',
      submenu: [
        { name: 'Documents', path: '/medical' },
        { name: 'Upload Document', path: '/medical/upload' }
      ]
    },
    {
      name: 'Disciplinary Actions',
      path: '/disciplinary',
      icon: <FiAlertTriangle className="h-5 w-5" />,
      showFor: 'all',
      submenu: [
        { name: 'Warnings', path: '/disciplinary' },
        { name: 'Issue Warning', path: '/disciplinary/create', showFor: 'hradmin' }
      ]
    },
    {
      name: 'Performance Reviews',
      path: '/performance',
      icon: <FiClipboard className="h-5 w-5" />,
      showFor: 'all',
      submenu: [
        { name: 'Reviews', path: '/performance' },
        { name: 'Create Review', path: '/performance/create', showFor: 'hradmin' }
      ]
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <FiSettings className="h-5 w-5" />,
      showFor: 'admin',
      submenu: [
        { name: 'General Settings', path: '/settings' },
        { name: 'Roles & Permissions', path: '/settings/roles' }
      ]
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-secondary-800 text-white">
        {/* Sidebar Header - Logo */}
        <div className="h-16 flex items-center justify-center border-b border-secondary-700">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold">HR Portal</span>
          </Link>
        </div>

        {/* Sidebar Content - Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              // Check if the item should be shown for the current user
              const shouldShow = 
                item.showFor === 'all' || 
                (item.showFor === 'hradmin' && isUserHRorAdmin) ||
                (item.showFor === 'admin' && isUserAdmin);

              if (!shouldShow) return null;

              const isExpanded = expandedMenus[item.path.replace('/', '')];
              const isActive = isMenuActive(item.path);

              return (
                <div key={item.name} className="space-y-1">
                  {/* Menu Item */}
                  {item.submenu ? (
                    <button
                      onClick={() => toggleMenu(item.path.replace('/', ''))}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                        pathname?.includes(item.path)
                          ? 'bg-secondary-700 text-white'
                          : 'text-secondary-200 hover:bg-secondary-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </div>
                      {isExpanded ? (
                        <FiChevronDown className="h-4 w-4" />
                      ) : (
                        <FiChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-secondary-700 text-white'
                          : 'text-secondary-200 hover:bg-secondary-700 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  )}

                  {/* Submenu */}
                  {item.submenu && isExpanded && (
                    <div className="pl-4 space-y-1">
                      {item.submenu.map((subitem) => {
                        // Check if the subitem should be shown for the current user
                        const shouldShowSubitem = 
                          !subitem.showFor || 
                          (subitem.showFor === 'hradmin' && isUserHRorAdmin) ||
                          (subitem.showFor === 'admin' && isUserAdmin);

                        if (!shouldShowSubitem) return null;

                        const isSubActive = isMenuActive(subitem.path);

                        return (
                          <Link
                            key={subitem.name}
                            href={subitem.path}
                            className={`flex items-center pl-3 pr-4 py-2 text-sm font-medium rounded-md ${
                              isSubActive
                                ? 'bg-secondary-700 text-white'
                                : 'text-secondary-300 hover:bg-secondary-700 hover:text-white'
                            }`}
                          >
                            <span className="ml-3">{subitem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-secondary-700 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-secondary-200 hover:bg-secondary-700 hover:text-white"
          >
            <FiLogOut className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 flex z-40">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={handleCloseMobileSidebar}
          ></div>

          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-secondary-800 text-white">
            {/* Close button */}
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={handleCloseMobileSidebar}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Close sidebar</span>
                <FiX className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Sidebar Header - Logo */}
            <div className="h-16 flex items-center justify-center border-b border-secondary-700">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-bold">HR Portal</span>
              </Link>
            </div>

            {/* Sidebar Content - Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
              <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                  // Check if the item should be shown for the current user
                  const shouldShow = 
                    item.showFor === 'all' || 
                    (item.showFor === 'hradmin' && isUserHRorAdmin) ||
                    (item.showFor === 'admin' && isUserAdmin);

                  if (!shouldShow) return null;

                  const isExpanded = expandedMenus[item.path.replace('/', '')];
                  const isActive = isMenuActive(item.path);

                  return (
                    <div key={item.name} className="space-y-1">
                      {/* Menu Item */}
                      {item.submenu ? (
                        <button
                          onClick={() => toggleMenu(item.path.replace('/', ''))}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                            pathname?.includes(item.path)
                              ? 'bg-secondary-700 text-white'
                              : 'text-secondary-200 hover:bg-secondary-700 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center">
                            {item.icon}
                            <span className="ml-3">{item.name}</span>
                          </div>
                          {isExpanded ? (
                            <FiChevronDown className="h-4 w-4" />
                          ) : (
                            <FiChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      ) : (
                        <Link
                          href={item.path}
                          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                            isActive
                              ? 'bg-secondary-700 text-white'
                              : 'text-secondary-200 hover:bg-secondary-700 hover:text-white'
                          }`}
                          onClick={handleCloseMobileSidebar}
                        >
                          {item.icon}
                          <span className="ml-3">{item.name}</span>
                        </Link>
                      )}

                      {/* Submenu */}
                      {item.submenu && isExpanded && (
                        <div className="pl-4 space-y-1">
                          {item.submenu.map((subitem) => {
                            // Check if the subitem should be shown for the current user
                            const shouldShowSubitem = 
                              !subitem.showFor || 
                              (subitem.showFor === 'hradmin' && isUserHRorAdmin) ||
                              (subitem.showFor === 'admin' && isUserAdmin);

                            if (!shouldShowSubitem) return null;

                            const isSubActive = isMenuActive(subitem.path);

                            return (
                              <Link
                                key={subitem.name}
                                href={subitem.path}
                                className={`flex items-center pl-3 pr-4 py-2 text-sm font-medium rounded-md ${
                                  isSubActive
                                    ? 'bg-secondary-700 text-white'
                                    : 'text-secondary-300 hover:bg-secondary-700 hover:text-white'
                                }`}
                                onClick={handleCloseMobileSidebar}
                              >
                                <span className="ml-3">{subitem.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="border-t border-secondary-700 p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-secondary-200 hover:bg-secondary-700 hover:text-white"
              >
                <FiLogOut className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;