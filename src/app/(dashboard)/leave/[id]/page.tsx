'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../../components/auth/ProtectedRoute';
import Modal from '../../../../components/ui/Modal';
import Button from '../../../../components/ui/Button';
import { useAuth } from '../../../../context/AuthContext';
import { useNotification } from '../../../../context/NotificationContext';
import { getLeaveRequestById } from '../../../../lib/mockData/leaveRequests';
import { getMedicalDocumentsByLeaveRequest } from '../../../../lib/mockData/medicalDocuments';
import { LeaveRequest, MedicalDocument } from '../../../../types';
import { isHRorAdmin } from '../../../../lib/auth';
import { 
  FiCalendar, 
  FiClock, 
  FiCheck, 
  FiX, 
  FiArrowLeft, 
  FiUser, 
  FiFileText,
  FiMessageSquare,
  FiPaperclip,
  FiSend
} from 'react-icons/fi';

export default function LeaveDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);
  const [medicalDocuments, setMedicalDocuments] = useState<MedicalDocument[]>([]);
  const [isUserHRorAdmin, setIsUserHRorAdmin] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [actionReason, setActionReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const request = getLeaveRequestById(id);
        
        if (!request) {
          error('Leave request not found');
          router.push('/leave');
          return;
        }
        
        setLeaveRequest(request);
        
        // Load associated medical documents
        if (request.medicalDocuments) {
          setMedicalDocuments(getMedicalDocumentsByLeaveRequest(id));
        } else {
          setMedicalDocuments([]);
        }

        // Check if user is HR or admin
        if (user) {
          setIsUserHRorAdmin(isHRorAdmin(user));
        }
      } catch (err) {
        console.error('Error loading leave request data:', err);
        error('Failed to load leave request data');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadData();
    }
  }, [id, user, error, router]);

  // Handle back button
  const handleBack = () => {
    router.push('/leave');
  };

  // Handle approve request
  const handleApprove = () => {
    try {
      if (!leaveRequest) return;
      
      const updatedRequest : LeaveRequest = {
        ...leaveRequest,
        status: 'approved',
        approvedBy: user?.name || 'HR Manager',
        approvedDate: new Date().toISOString().split('T')[0],
        comments: [
          ...leaveRequest.comments,
          {
            id: `c${leaveRequest.comments.length + 1}`,
            userId: user?.id || '0',
            userName: user?.name || 'HR Manager',
            text: actionReason || 'Request approved',
            date: new Date().toISOString().split('T')[0]
          }
        ]
      };
      
      setLeaveRequest(updatedRequest);
      setShowApproveModal(false);
      setActionReason('');
      success('Leave request approved successfully');
    } catch (err) {
      error('Failed to approve leave request');
      console.error('Error approving leave request:', err);
    }
  };

  // Handle reject request
  const handleReject = () => {
    try {
      if (!leaveRequest) return;
      
      const updatedRequest : LeaveRequest = {
        ...leaveRequest,
        status: 'rejected',
        approvedBy: user?.name || 'HR Manager',
        approvedDate: new Date().toISOString().split('T')[0],
        comments: [
          ...leaveRequest.comments,
          {
            id: `c${leaveRequest.comments.length + 1}`,
            userId: user?.id || '0',
            userName: user?.name || 'HR Manager',
            text: actionReason || 'Request rejected',
            date: new Date().toISOString().split('T')[0]
          }
        ]
      };
      
      setLeaveRequest(updatedRequest);
      setShowRejectModal(false);
      setActionReason('');
      success('Leave request rejected successfully');
    } catch (err) {
      error('Failed to reject leave request');
      console.error('Error rejecting leave request:', err);
    }
  };

  // Handle adding a comment
  const handleAddComment = () => {
    try {
      if (!leaveRequest || !comment.trim()) return;
      
      const updatedRequest = {
        ...leaveRequest,
        comments: [
          ...leaveRequest.comments,
          {
            id: `c${leaveRequest.comments.length + 1}`,
            userId: user?.id || '0',
            userName: user?.name || 'User',
            text: comment,
            date: new Date().toISOString().split('T')[0]
          }
        ]
      };
      
      setLeaveRequest(updatedRequest);
      setComment('');
      success('Comment added successfully');
    } catch (err) {
      error('Failed to add comment');
      console.error('Error adding comment:', err);
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
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

  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (startDate === endDate) {
      return start.toLocaleDateString();
    }
    
    return `${start.toLocaleDateString()} to ${end.toLocaleDateString()}`;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout title="Leave Request Details">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!leaveRequest) {
    return (
      <ProtectedRoute>
        <DashboardLayout title="Leave Request Details">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Leave Request Not Found</h3>
            <p className="text-gray-600 mb-4">The leave request you are looking for does not exist or has been removed.</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Leave Requests
            </button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout title="Leave Request Details">
        {/* Back Button and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <button onClick={handleBack} className="text-blue-600 hover:text-blue-900 flex items-center">
              <FiArrowLeft className="mr-2" />
              Back to Leave Requests
            </button>
          </div>
          
          {/* Action Buttons for HR/Admin */}
          {isUserHRorAdmin && leaveRequest.status === 'pending' && (
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button 
                onClick={() => setShowApproveModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
              >
                <FiCheck className="mr-2" />
                Approve
              </button>
              <button 
                onClick={() => setShowRejectModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
              >
                <FiX className="mr-2" />
                Reject
              </button>
            </div>
          )}
        </div>
        
        {/* Leave Request Details */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {leaveRequest.type}
              </h3>
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full ${getStatusBadgeColor(leaveRequest.status)}`}>
                {leaveRequest.status.charAt(0).toUpperCase() + leaveRequest.status.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Employee Information</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiUser className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Employee Name</p>
                      <p className="text-base">{leaveRequest.employeeName}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiCalendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Applied Date</p>
                      <p className="text-base">{new Date(leaveRequest.appliedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Leave Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Leave Details</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiCalendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Leave Period</p>
                      <p className="text-base">{formatDateRange(leaveRequest.startDate, leaveRequest.endDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiClock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Days</p>
                      <p className="text-base">{leaveRequest.totalDays} {leaveRequest.totalDays === 1 ? 'day' : 'days'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Reason */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Reason</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{leaveRequest.reason}</p>
            </div>
            
            {/* Additional Information */}
            {leaveRequest.status !== 'pending' && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Approval Information</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiUser className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">{leaveRequest.status === 'approved' ? 'Approved By' : 'Rejected By'}</p>
                      <p className="text-base">{leaveRequest.approvedBy || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiCalendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Decision Date</p>
                      <p className="text-base">{leaveRequest.approvedDate ? new Date(leaveRequest.approvedDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Medical Documents */}
            {medicalDocuments && medicalDocuments.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Medical Documents</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <ul className="space-y-2">
                    {medicalDocuments.map((doc) => (
                      <li key={doc.id} className="flex items-center">
                        <FiFileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">{doc.title}</span>
                        <span className={`ml-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {doc.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Comments</h3>
          </div>
          
          <div className="px-6 py-4">
            {leaveRequest.comments && leaveRequest.comments.length > 0 ? (
              <div className="space-y-4 mb-6">
                {leaveRequest.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-800 font-medium">
                        {comment.userName.charAt(0)}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{comment.userName}</p>
                        <p className="text-xs text-gray-500">{new Date(comment.date).toLocaleDateString()}</p>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 my-6">No comments yet</div>
            )}
            
            {/* Add Comment Form */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-800 font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="relative">
                  <textarea
                    rows={3}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <button 
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                    onClick={handleAddComment}
                    disabled={!comment.trim()}
                  >
                    <FiSend className="mr-2" />
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Approve Modal */}
        <Modal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          title="Approve Leave Request"
        >
          <div className="p-4">
            <p className="mb-4 text-gray-700">Are you sure you want to approve this leave request?</p>
            <div className="mb-4">
              <label htmlFor="approveReason" className="block text-sm font-medium text-gray-700 mb-1">
                Comments (Optional)
              </label>
              <textarea
                id="approveReason"
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Add any comments about this approval..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowApproveModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={handleApprove}
              >
                Approve
              </button>
            </div>
          </div>
        </Modal>
        
        {/* Reject Modal */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title="Reject Leave Request"
        >
          <div className="p-4">
            <p className="mb-4 text-gray-700">Are you sure you want to reject this leave request?</p>
            <div className="mb-4">
              <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejectReason"
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this request..."
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleReject}
                disabled={!actionReason.trim()}
              >
                Reject
              </button>
            </div>
          </div>
        </Modal>
      </DashboardLayout>
    </ProtectedRoute>
  );
}