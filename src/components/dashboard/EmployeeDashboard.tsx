import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiClipboard, FiCalendar, FiFileText, FiAlertTriangle, FiEdit } from 'react-icons/fi';
import DashboardCard from './DashboardCard';
import { getLeaveRequestsByEmployee } from '../../lib/mockData/leaveRequests';
import { getMedicalDocumentsByEmployee } from '../../lib/mockData/medicalDocuments';
import { getWarningsByEmployee } from '../../lib/mockData/warnings';
import { getPerformanceReviewsByEmployee } from '../../lib/mockData/performanceReviews';
import { User, ActivityItemProps } from '../../types';

// Employee Dashboard Activity Item
const EmployeeActivityItem: React.FC<ActivityItemProps> = ({ date, title, description, type }) => {
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

interface EmployeeDashboardProps {
  user: User;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState({
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    pendingMedical: 0,
    pendingWarnings: 0,
    pendingReviews: 0
  });

  const [recentActivities, setRecentActivities] = useState<ActivityItemProps[]>([]);

  useEffect(() => {
    if (user?.id) {
      // Get employee's leave requests
      const leaveRequests = getLeaveRequestsByEmployee(user.id);
      const pendingLeaves = leaveRequests.filter(leave => leave.status === 'pending').length;
      const approvedLeaves = leaveRequests.filter(leave => leave.status === 'approved').length;
      const rejectedLeaves = leaveRequests.filter(leave => leave.status === 'rejected').length;

      // Get employee's medical documents
      const medicalDocuments = getMedicalDocumentsByEmployee(user.id);
      const pendingMedical = medicalDocuments.filter(doc => doc.status === 'pending').length;

      // Get employee's warnings
      const warnings = getWarningsByEmployee(user.id);
      const pendingWarnings = warnings.filter(warning => !warning.acknowledgement.acknowledged).length;

      // Get employee's performance reviews
      const reviews = getPerformanceReviewsByEmployee(user.id);
      const pendingReviews = reviews.filter(review => 
        review.status === 'pending_employee' && !review.employeeAcknowledgement.acknowledged
      ).length;

      setStats({
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
        pendingMedical,
        pendingWarnings,
        pendingReviews
      });

      // Generate recent activities based on actual data
      const activities: ActivityItemProps[] = [];

      // Add recent leave requests
      leaveRequests.slice(0, 2).forEach(leave => {
        activities.push({
          id: `leave-${leave.id}`,
          date: leave.appliedDate,
          title: `Leave Request ${capitalize(leave.status)}`,
          description: `Your ${leave.type} request for ${formatDateRange(leave.startDate, leave.endDate)} is ${leave.status}`,
          type: 'leave'
        });
      });

      // Add recent warnings
      warnings.slice(0, 2).forEach(warning => {
        activities.push({
          id: `warning-${warning.id}`,
          date: warning.issueDate,
          title: 'Warning Issued',
          description: warning.title,
          type: 'warning'
        });
      });

      // Add recent performance reviews
      reviews.slice(0, 2).forEach(review => {
        activities.push({
          id: `review-${review.id}`,
          date: review.reviewDate,
          title: 'Performance Review',
          description: `${review.reviewPeriod} performance review is ${review.status === 'completed' ? 'completed' : 'pending your acknowledgement'}`,
          type: 'performance'
        });
      });

      // Sort by date (newest first) and limit to 5
      setRecentActivities(
        activities
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
      );
    }
  }, [user]);

  // Helper functions
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatDateRange = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (start === end) {
      return new Date(start).toLocaleDateString();
    }
    
    return `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name}!
        </h2>
        <p className="text-gray-600">
          Here's what's happening with your employee portal today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Leave Requests */}
        <DashboardCard 
          title="Pending Leave Requests" 
          count={stats.pendingLeaves} 
          icon={<FiCalendar className="h-6 w-6 text-white" />} 
          color="bg-green-500"
          link="/leave"
        />
        
        {/* Approved Leaves */}
        <DashboardCard 
          title="Approved Leaves" 
          count={stats.approvedLeaves} 
          icon={<FiCalendar className="h-6 w-6 text-white" />} 
          color="bg-blue-500"
          link="/leave"
        />
        
        {/* Medical Documents */}
        <DashboardCard 
          title="Medical Documents" 
          count={stats.pendingMedical} 
          icon={<FiFileText className="h-6 w-6 text-white" />} 
          color="bg-indigo-500"
          link="/medical"
        />
        
        {/* Warnings */}
        <DashboardCard 
          title="Warnings to Acknowledge" 
          count={stats.pendingWarnings} 
          icon={<FiAlertTriangle className="h-6 w-6 text-white" />} 
          color="bg-yellow-500"
          link="/disciplinary"
        />
        
        {/* Performance Reviews */}
        <DashboardCard 
          title="Performance Reviews" 
          count={stats.pendingReviews} 
          icon={<FiClipboard className="h-6 w-6 text-white" />} 
          color="bg-purple-500"
          link="/performance"
        />
      </div>

      {/* Employee Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Recent Activity</h3>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <EmployeeActivityItem
                id={activity.id}
                key={activity.id}
                date={activity.date}
                title={activity.title}
                description={activity.description}
                type={activity.type}
              />
            ))
          ) : (
            <p className="text-gray-500">No recent activities</p>
          )}
        </div>
      </div>

      {/* Quick Actions Section - Employee specific */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link href="/leave">
            <div className="bg-green-50 hover:bg-green-100 p-4 rounded-lg cursor-pointer transition-colors">
              <FiCalendar className="h-6 w-6 text-green-600 mb-2" />
              <p className="font-medium">Request Leave</p>
            </div>
          </Link>
          
          <Link href="/medical">
            <div className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg cursor-pointer transition-colors">
              <FiFileText className="h-6 w-6 text-blue-600 mb-2" />
              <p className="font-medium">Upload Medical Document</p>
            </div>
          </Link>
          
          <Link href="/profile">
            <div className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg cursor-pointer transition-colors">
              <FiEdit className="h-6 w-6 text-purple-600 mb-2" />
              <p className="font-medium">Update Profile</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;