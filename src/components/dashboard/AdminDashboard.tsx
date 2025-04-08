import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiUsers, FiClipboard, FiCalendar, FiFileText, FiAlertTriangle, FiSettings } from 'react-icons/fi';
import DashboardCard from '../dashboard/DashboardCard';
import { getPendingLeaveRequests } from '../../lib/mockData/leaveRequests';
import { getPendingMedicalDocuments } from '../../lib/mockData/medicalDocuments';
import { getPendingAcknowledgements } from '../../lib/mockData/warnings';
import { getPendingEmployeeAcknowledgements } from '../../lib/mockData/performanceReviews';
import { employees } from '../../lib/mockData/employees';
import { ActivityItemProps } from '../../types';

// Admin Dashboard specific activity item
const AdminActivityItem: React.FC<ActivityItemProps> = ({ date, title, description, type }) => {
  const getTypeColor = () => {
    switch (type) {
      case 'leave':
        return 'bg-green-100 text-green-800';
      case 'medical':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'performance':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="flex items-start">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getTypeColor()}`}>
            {new Date(date).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

interface AdminDashboardProps {
  userName: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userName }) => {
  const [stats, setStats] = useState({
    pendingLeaves: 0,
    pendingMedical: 0,
    pendingWarnings: 0,
    pendingReviews: 0,
    employeeCount: 0,
    systemSettings: 5
  });

  const [recentActivities, setRecentActivities] = useState<ActivityItemProps[]>([]);

  useEffect(() => {
    // Load dashboard stats
    const pendingLeaves = getPendingLeaveRequests().length;
    const pendingMedical = getPendingMedicalDocuments().length;
    const pendingWarnings = getPendingAcknowledgements().length;
    const pendingReviews = getPendingEmployeeAcknowledgements().length;
    const employeeCount = employees.length;
    
    setStats({
      pendingLeaves,
      pendingMedical,
      pendingWarnings,
      pendingReviews,
      employeeCount,
      systemSettings: 5 // Mock data for admin-specific setting
    });

    // Mock recent activities for Admin
    setRecentActivities([
      {
        id: 'a1',
        date: '2023-11-25',
        title: 'System Update',
        description: 'Updated HR policy settings for vacation accrual',
        type: 'leave'
      },
      {
        id: 'a2',
        date: '2023-11-24',
        title: 'New Department Added',
        description: 'Added Research & Development department to organization structure',
        type: 'medical'
      },
      {
        id: 'a3',
        date: '2023-11-23',
        title: 'User Role Updated',
        description: 'Promoted Jane Doe to HR Manager with expanded permissions',
        type: 'warning'
      },
      {
        id: 'a4',
        date: '2023-11-20',
        title: 'System Backup',
        description: 'Completed full system backup and performance optimization',
        type: 'performance'
      }
    ]);
  }, []);

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome, {userName}!
        </h2>
        <p className="text-gray-600">
          Here's an overview of your HR portal system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Employees */}
        <DashboardCard 
          title="Total Employees" 
          count={stats.employeeCount} 
          icon={<FiUsers className="h-6 w-6 text-white" />} 
          color="bg-indigo-500"
          link="/employees"
        />
        
        {/* Pending Leave Requests */}
        <DashboardCard 
          title="Pending Leave Requests" 
          count={stats.pendingLeaves} 
          icon={<FiCalendar className="h-6 w-6 text-white" />} 
          color="bg-green-500"
          link="/leave"
        />
        
        {/* Pending Medical Documents */}
        <DashboardCard 
          title="Medical Documents" 
          count={stats.pendingMedical} 
          icon={<FiFileText className="h-6 w-6 text-white" />} 
          color="bg-blue-500"
          link="/medical"
        />
        
        {/* Pending Warnings */}
        <DashboardCard 
          title="Pending Warnings" 
          count={stats.pendingWarnings} 
          icon={<FiAlertTriangle className="h-6 w-6 text-white" />} 
          color="bg-yellow-500"
          link="/disciplinary"
        />
        
        {/* Pending Performance Reviews */}
        <DashboardCard 
          title="Performance Reviews" 
          count={stats.pendingReviews} 
          icon={<FiClipboard className="h-6 w-6 text-white" />} 
          color="bg-purple-500"
          link="/performance"
        />

        {/* System Settings - Admin specific */}
        <DashboardCard 
          title="System Settings" 
          count={stats.systemSettings} 
          icon={<FiSettings className="h-6 w-6 text-white" />} 
          color="bg-gray-500"
          link="/settings"
        />
      </div>

      {/* Admin Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Activity</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <AdminActivityItem
              id={activity.id}
              key={activity.id}
              date={activity.date}
              title={activity.title}
              description={activity.description}
              type={activity.type}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions Section - Admin specific */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/settings">
            <div className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg cursor-pointer transition-colors">
              <FiSettings className="h-6 w-6 text-gray-600 mb-2" />
              <p className="font-medium">System Settings</p>
            </div>
          </Link>
          
          <Link href="/employees">
            <div className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg cursor-pointer transition-colors">
              <FiUsers className="h-6 w-6 text-indigo-600 mb-2" />
              <p className="font-medium">Manage Employees</p>
            </div>
          </Link>
          
          <Link href="/settings/roles">
            <div className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg cursor-pointer transition-colors">
              <FiClipboard className="h-6 w-6 text-purple-600 mb-2" />
              <p className="font-medium">Manage Roles & Permissions</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;