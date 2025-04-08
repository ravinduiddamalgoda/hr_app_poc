'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../../components/auth/ProtectedRoute';
import { useAuth } from '../../../../context/AuthContext';
import { useNotification } from '../../../../context/NotificationContext';
import { getEmployeeById } from '../../../../lib/mockData/employees';
import { getLeaveRequestsByEmployee } from '../../../../lib/mockData/leaveRequests';
import {LeaveRequest} from '../../../../types';
import { getMedicalDocumentsByEmployee } from '../../../../lib/mockData/medicalDocuments';
import { MedicalDocument } from '../../../../types';
import { getWarningsByEmployee } from '../../../../lib/mockData/warnings';
import { Warning } from '../../../../types';
import { getPerformanceReviewsByEmployee } from '../../../../lib/mockData/performanceReviews';
import { PerformanceReview } from '../../../../types';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiFileText, FiAlertTriangle, FiBarChart2, FiDollarSign, FiArrowLeft, FiEdit } from 'react-icons/fi';
import { Employee } from '../../../../types';

type TabType = 'profile' | 'leave' | 'documents' | 'warnings' | 'performance';

export default function EmployeeDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();
  const { error } = useNotification();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [medicalDocuments, setMedicalDocuments] = useState<MedicalDocument[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  useEffect(() => {
    const loadData = () => {
      try {
        const employeeData = getEmployeeById(id);
        
        if (!employeeData) {
          error('Employee not found');
          router.push('/employees');
          return;
        }
        
        setEmployee(employeeData);
        
        // Load related data
        setLeaveRequests(getLeaveRequestsByEmployee(id));
        setMedicalDocuments(getMedicalDocumentsByEmployee(id));
        setWarnings(getWarningsByEmployee(id));
        setPerformanceReviews(getPerformanceReviewsByEmployee(id));
      } catch (err) {
        console.error('Error loading employee data:', err);
        error('Failed to load employee data');
      }
    };
    
    loadData();
  }, [id, error, router]);

  if (!employee) {
    return (
      <ProtectedRoute requiredRole="hr">
        <DashboardLayout title="Employee Details">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiUser className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-base">{employee.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base">{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-base">{employee.contactInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiMapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-base">{employee.contactInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiDollarSign className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Position</p>
                      <p className="text-base">{employee.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiDollarSign className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Department</p>
                      <p className="text-base">{employee.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Join Date</p>
                      <p className="text-base">{new Date(employee.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiDollarSign className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Salary</p>
                      <p className="text-base">{employee.salary.amount.toLocaleString()} {employee.salary.currency}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
              <p className="text-base">{employee.contactInfo.emergencyContact}</p>
            </div>
          </div>
        );
        
      case 'leave':
        return (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Leave Requests</h3>
            </div>
            {leaveRequests.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No leave requests found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied On
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveRequests.map((leave) => (
                      <tr key={leave.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{leave.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {leave.totalDays} days
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${leave.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            leave.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(leave.appliedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/leave/${leave.id}`} className="text-primary-600 hover:text-primary-900">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
        
      case 'documents':
        return (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Medical Documents</h3>
            </div>
            {medicalDocuments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No medical documents found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Upload Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {medicalDocuments.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{doc.title}</div>
                          <div className="text-sm text-gray-500">{doc.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${doc.status === 'verified' ? 'bg-green-100 text-green-800' : 
                            doc.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/medical/${doc.id}`} className="text-primary-600 hover:text-primary-900">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
        
      case 'warnings':
        return (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Warnings & Disciplinary Actions</h3>
            </div>
            {warnings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No warnings found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issue Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {warnings.map((warning) => (
                      <tr key={warning.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{warning.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${warning.type === 'Attendance' ? 'bg-yellow-100 text-yellow-800' : 
                            warning.type === 'Performance' ? 'bg-blue-100 text-blue-800' : 
                            warning.type === 'Conduct' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                            {warning.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(warning.issueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${warning.acknowledgement.acknowledged ? 
                            'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {warning.acknowledgement.acknowledged ? 'Acknowledged' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/disciplinary/${warning.id}`} className="text-primary-600 hover:text-primary-900">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
        
      case 'performance':
        return (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Performance Reviews</h3>
            </div>
            {performanceReviews.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No performance reviews found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Review Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Overall Rating
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceReviews.map((review) => (
                      <tr key={review.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{review.reviewPeriod}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(review.reviewDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium">{review.overallRating.toFixed(1)}</span>
                            <div className="ml-2 bg-gray-200 w-24 h-3 rounded-full overflow-hidden">
                              <div 
                                className="bg-primary-600 h-full" 
                                style={{ width: `${(review.overallRating / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${review.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                            {review.status === 'completed' ? 'Completed' : 'Pending Acknowledgement'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/performance/${review.id}`} className="text-primary-600 hover:text-primary-900">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
        
      default:
        return <div>Invalid tab</div>;
    }
  };
  
  return (
    <ProtectedRoute requiredRole="hr">
      <DashboardLayout title="Employee Details">
        {/* Back Button and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <Link href="/employees" className="text-primary-600 hover:text-primary-900 flex items-center">
              <FiArrowLeft className="mr-2" />
              Back to Employees
            </Link>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-primary-600 text-white rounded font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center">
              <FiEdit className="mr-2" />
              Edit Employee
            </button>
          </div>
        </div>
        
        {/* Employee Header */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-shrink-0 h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-800 font-bold text-2xl">
                {employee.name.charAt(0)}
              </span>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
              <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
              <div className="flex flex-col md:flex-row md:items-center mt-1 text-gray-600">
                <span className="mr-4">{employee.position}</span>
                <span className="mr-4">•</span>
                <span className="mr-4">{employee.department}</span>
                <span className="mr-4">•</span>
                <span>Employee ID: {employee.employeeId}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiUser className="inline-block mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('leave')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'leave'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiCalendar className="inline-block mr-2" />
                Leave ({leaveRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiFileText className="inline-block mr-2" />
                Documents ({medicalDocuments.length})
              </button>
              <button
                onClick={() => setActiveTab('warnings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'warnings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiAlertTriangle className="inline-block mr-2" />
                Warnings ({warnings.length})
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'performance'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiBarChart2 className="inline-block mr-2" />
                Performance ({performanceReviews.length})
              </button>
            </nav>
          </div>
        </div>
        
        {/* Tab Content */}
        {renderTabContent()}
      </DashboardLayout>
    </ProtectedRoute>
  );
}