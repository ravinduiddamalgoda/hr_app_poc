'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import { getPendingLeaveRequests } from '../../../lib/mockData/leaveRequests';
import { getPendingMedicalDocuments } from '../../../lib/mockData/medicalDocuments';
import { getPendingAcknowledgements } from '../../../lib/mockData/warnings';
import { getPendingEmployeeAcknowledgements } from '../../../lib/mockData/performanceReviews';
import { FiUsers, FiClipboard, FiCalendar, FiFileText, FiAlertTriangle } from 'react-icons/fi';
import Link from 'next/link';
import { User } from '../../../types';

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  link: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, count, icon, color, link }) => (
  <div className="bg-white rounded-lg shadow-md p-6 transition-transform duration-200 transform hover:scale-105 border-l-4 border-primary-500">
    <Link href={link}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-1">{count}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </Link>
  </div>
);

// Recent Activity Item Component
interface ActivityItemProps {
  date: string;
  title: string;
  description: string;
  type: 'leave' | 'medical' | 'warning' | 'performance';
}

const ActivityItem: React.FC<ActivityItemProps> = ({ date, title, description, type }) => {
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

interface DashboardStats {
  pendingLeaves: number;
  pendingMedical: number;
  pendingWarnings: number;
  pendingReviews: number;
  employeeCount: number;
}

interface RecentActivity {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'leave' | 'medical' | 'warning' | 'performance';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    pendingLeaves: 0,
    pendingMedical: 0,
    pendingWarnings: 0,
    pendingReviews: 0,
    employeeCount: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    // Load dashboard stats based on user role
    if (user) {
      if (user.role === 'admin' || user.role === 'hr') {
        // Admin and HR see all pending items
        const pendingLeaves = getPendingLeaveRequests().length;
        const pendingMedical = getPendingMedicalDocuments().length;
        const pendingWarnings = getPendingAcknowledgements().length;
        const pendingReviews = getPendingEmployeeAcknowledgements().length;
        
        setStats({
          pendingLeaves,
          pendingMedical,
          pendingWarnings,
          pendingReviews,
          employeeCount: 5 // Mock data
        });

        // Mock recent activities for HR/Admin
        setRecentActivities([
          {
            id: 'a1',
            date: '2023-11-25',
            title: 'Leave Request Submitted',
            description: 'John Smith requested annual leave for Dec 20-27',
            type: 'leave'
          },
          {
            id: 'a2',
            date: '2023-11-24',
            title: 'Medical Document Uploaded',
            description: 'Jane Doe submitted medical certificate for sick leave',
            type: 'medical'
          },
          {
            id: 'a3',
            date: '2023-11-23',
            title: 'Warning Issued',
            description: 'Warning issued to Bob Johnson for inappropriate communication',
            type: 'warning'
          },
          {
            id: 'a4',
            date: '2023-11-20',
            title: 'Performance Review Completed',
            description: 'Q4 performance review completed for Jane Doe',
            type: 'performance'
          }
        ]);
      } else {
        // Employee sees only their pending items
        const employeeLeaves = getPendingLeaveRequests().filter(
          leave => leave.employeeId === user.id
        ).length;
        
        const employeeMedical = getPendingMedicalDocuments().filter(
          doc => doc.employeeId === user.id
        ).length;
        
        const employeeWarnings = getPendingAcknowledgements().filter(
          warning => warning.employeeId === user.id
        ).length;
        
        const employeeReviews = getPendingEmployeeAcknowledgements().filter(
          review => review.employeeId === user.id
        ).length;

        setStats({
          pendingLeaves: employeeLeaves,
          pendingMedical: employeeMedical,
          pendingWarnings: employeeWarnings,
          pendingReviews: employeeReviews,
          employeeCount: 0
        });

        // Mock recent activities for employee
        setRecentActivities([
          {
            id: 'a1',
            date: '2023-11-25',
            title: 'Leave Request Submitted',
            description: 'You requested annual leave for Dec 20-27',
            type: 'leave'
          },
          {
            id: 'a2',
            date: '2023-11-15',
            title: 'Performance Review',
            description: 'Your Q4 performance review is ready for acknowledgement',
            type: 'performance'
          },
          {
            id: 'a3',
            date: '2023-11-10',
            title: 'Medical Document Verified',
            description: 'Your medical certificate has been verified by HR',
            type: 'medical'
          }
        ]);
      }
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <DashboardLayout title="Dashboard">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your HR portal today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          
          {/* Total Employees - Only visible to HR and Admin */}
          {(user?.role === 'admin' || user?.role === 'hr') && (
            <DashboardCard 
              title="Total Employees" 
              count={stats.employeeCount} 
              icon={<FiUsers className="h-6 w-6 text-white" />} 
              color="bg-indigo-500"
              link="/employees"
            />
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                date={activity.date}
                title={activity.title}
                description={activity.description}
                type={activity.type}
              />
            ))}
          </div>
          {recentActivities.length === 0 && (
            <p className="text-gray-500">No recent activities</p>
          )}
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Link href="/leave">
              <div className="bg-primary-50 hover:bg-primary-100 p-4 rounded-lg cursor-pointer transition-colors">
                <FiCalendar className="h-6 w-6 text-primary-600 mb-2" />
                <p className="font-medium">Request Leave</p>
              </div>
            </Link>
            
            <Link href="/medical">
              <div className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg cursor-pointer transition-colors">
                <FiFileText className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium">Upload Medical Document</p>
              </div>
            </Link>
            
            {(user?.role === 'admin' || user?.role === 'hr') && (
              <Link href="/employees">
                <div className="bg-green-50 hover:bg-green-100 p-4 rounded-lg cursor-pointer transition-colors">
                  <FiUsers className="h-6 w-6 text-green-600 mb-2" />
                  <p className="font-medium">View All Employees</p>
                </div>
              </Link>
            )}
            
            {(user?.role === 'admin' || user?.role === 'hr') && (
              <Link href="/disciplinary">
                <div className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg cursor-pointer transition-colors">
                  <FiAlertTriangle className="h-6 w-6 text-yellow-600 mb-2" />
                  <p className="font-medium">Issue Warning</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}