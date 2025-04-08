import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEye, FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { LeaveRequest } from '../../types';

interface LeaveRequestListProps {
  leaveRequests: LeaveRequest[];
  onView?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isHRorAdmin?: boolean;
}

const LeaveRequestList: React.FC<LeaveRequestListProps> = ({
  leaveRequests,
  onView,
  onApprove,
  onReject,
  isHRorAdmin = false
}) => {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);

  // Apply filters to leave requests
  useEffect(() => {
    let filtered = [...leaveRequests];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    setFilteredRequests(filtered);
  }, [leaveRequests, searchTerm, statusFilter]);

  // Handle view leave request details
  const handleView = (id: string) => {
    if (onView) {
      onView(id);
    }
  };

  // Handle approve leave request
  const handleApprove = (id: string) => {
    try {
      if (onApprove) {
        onApprove(id);
      }
      success('Leave request approved successfully');
    } catch (err) {
      error('Failed to approve leave request');
      console.error('Error approving leave request:', err);
    }
  };

  // Handle reject leave request
  const handleReject = (id: string) => {
    try {
      if (onReject) {
        onReject(id);
      }
      success('Leave request rejected successfully');
    } catch (err) {
      error('Failed to reject leave request');
      console.error('Error rejecting leave request:', err);
    }
  };

  return (
    <div>
      {/* Filters and search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search leave requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      {/* Leave Requests Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isHRorAdmin && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Employee
                  </th>
                )}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Leave Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applied On
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  {isHRorAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-800 font-medium">
                            {leave.employeeName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{leave.employeeName}</div>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{leave.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {leave.totalDays} {leave.totalDays === 1 ? 'day' : 'days'}
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
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(leave.id)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      
                      {/* Approve/Reject buttons (only for HR/admin and pending leaves) */}
                      {isHRorAdmin && leave.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(leave.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <FiCheck className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleReject(leave.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={isHRorAdmin ? 6 : 5} className="px-6 py-4 text-center text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination (static for demo) */}
      {filteredRequests.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredRequests.length}</span> of{' '}
                <span className="font-medium">{filteredRequests.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestList;