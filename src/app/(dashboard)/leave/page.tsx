'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { getLeaveRequestsByEmployee, getPendingLeaveRequests } from '../../../lib/mockData/leaveRequests';
import { LeaveRequest } from '../../../types';
import { FiCalendar, FiPlus, FiEye, FiCheck, FiX, FiFilter, FiSearch } from 'react-icons/fi';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';

export default function LeavePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const isHR = user?.role === 'hr' || user?.role === 'admin';

  useEffect(() => {
    if (user) {
      try {
        // Load leave requests based on user role
        const requests = isHR 
          ? getPendingLeaveRequests() 
          : getLeaveRequestsByEmployee(user.id);
        
        setLeaveRequests(requests);
        setFilteredRequests(requests);
      } catch (err) {
        console.error('Error fetching leave requests:', err);
        error('Failed to load leave requests');
      } finally {
        setLoading(false);
      }
    }
  }, [user, isHR, error]);

  // Apply filters
  useEffect(() => {
    let filtered = [...leaveRequests];
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredRequests(filtered);
  }, [leaveRequests, statusFilter, searchTerm]);

  // View leave request details
  const handleViewRequest = (id: string) => {
    router.push(`/leave/${id}`);
  };

  // Handle approving a leave request (HR only)
  const handleApproveRequest = (id: string) => {
    try {
      // In a real app, this would send a request to the backend
      // and then handle the response
      
      // Update local state to reflect the change
      const updatedRequests : LeaveRequest[] = leaveRequests.map(request=> 
        request.id === id 
          ? { ...request, status: 'approved', approvedBy: user?.name || 'HR Manager', approvedDate: new Date().toISOString().split('T')[0] } 
          : request
      );
      
      setLeaveRequests(updatedRequests);
      success('Leave request approved successfully');
    } catch (err) {
      error('Failed to approve leave request');
      console.error('Error approving leave request:', err);
    }
  };

  // Handle rejecting a leave request (HR only)
  const handleRejectRequest = (id: string) => {
    try {
      // In a real app, this would send a request to the backend
      // and then handle the response
      
      // Update local state to reflect the change
      const updatedRequests  : LeaveRequest[] = leaveRequests.map(request => 
        request.id === id 
          ? { ...request, status: 'rejected', approvedBy: user?.name || 'HR Manager', approvedDate: new Date().toISOString().split('T')[0] } 
          : request
      );
      
      setLeaveRequests(updatedRequests);
      success('Leave request rejected successfully');
    } catch (err) {
      error('Failed to reject leave request');
      console.error('Error rejecting leave request:', err);
    }
  };

  // Get status badge style
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title="Leave Management">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {isHR ? 'Leave Requests' : 'My Leave Requests'}
          </h1>
          
          <div className="mt-4 sm:mt-0">
            <button 
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2 -ml-1 h-5 w-5" />
              Request Leave
            </button>
          </div>
        </div>

        {/* Filters and search */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search leaves..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="py-10 px-6 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500">Loading leave requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-10 px-6 text-center">
              <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No leave requests</h3>
              <p className="mt-1 text-sm text-gray-500">
                {statusFilter ? `No ${statusFilter} leave requests found.` : 'Get started by creating a new leave request.'}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                  New Leave Request
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <li key={request.id}>
                  <div className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <FiCalendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <p className="ml-2 truncate text-sm font-medium text-blue-600">
                            {request.type}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex gap-2">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                          {!isHR && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              {request.totalDays} days
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          {isHR && (
                            <p className="flex items-center text-sm text-gray-500">
                              {request.employeeName}
                            </p>
                          )}
                          <p className={`${isHR ? 'mt-2 sm:mt-0 sm:ml-6' : ''} flex items-center text-sm text-gray-500`}>
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Applied on {new Date(request.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewRequest(request.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FiEye className="mr-1.5 -ml-0.5 h-4 w-4" />
                          View
                        </button>
                        
                        {isHR && request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveRequest(request.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <FiCheck className="mr-1.5 -ml-0.5 h-4 w-4" />
                              Approve
                            </button>
                            
                            <button
                              onClick={() => handleRejectRequest(request.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <FiX className="mr-1.5 -ml-0.5 h-4 w-4" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Request Leave Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Request Leave"
          size="lg"
        >
          <div className="p-6">
            <form>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">
                    Leave Type
                  </label>
                  <select
                    id="leaveType"
                    name="leaveType"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                    <option>Personal Leave</option>
                    <option>Maternity/Paternity Leave</option>
                    <option>Bereavement Leave</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                    Reason
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={3}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Please provide a reason for your leave request"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Attach Medical Certificate (if applicable)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    success('Leave request submitted successfully');
                  }}
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </DashboardLayout>
    </ProtectedRoute>
  );
}