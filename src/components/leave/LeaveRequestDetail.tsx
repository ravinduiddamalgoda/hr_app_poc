import React, { useState } from 'react';
import { FiArrowLeft, FiCheck, FiX, FiMessageSquare, FiPaperclip } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { LeaveRequest } from '../../types';

interface LeaveRequestDetailProps {
  leaveRequest: LeaveRequest;
  onApprove?: (id: string, comments?: string) => void;
  onReject?: (id: string, comments?: string) => void;
  onAddComment?: (id: string, text: string) => void;
  onUploadDocument?: (id: string, file: File) => void;
  onBack?: () => void;
  isHRorAdmin?: boolean;
}

const LeaveRequestDetail: React.FC<LeaveRequestDetailProps> = ({
  leaveRequest,
  onApprove,
  onReject,
  onAddComment,
  onUploadDocument,
  onBack,
  isHRorAdmin = false
}) => {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Handle approve leave request
  const handleApprove = () => {
    if (!onApprove) return;
    
    try {
      setIsSubmitting(true);
      onApprove(leaveRequest.id, comment);
      setComment('');
      success('Leave request approved successfully');
    } catch (err) {
      error('Failed to approve leave request');
      console.error('Error approving leave request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reject leave request
  const handleReject = () => {
    if (!onReject) return;
    
    try {
      setIsSubmitting(true);
      onReject(leaveRequest.id, comment);
      setComment('');
      success('Leave request rejected successfully');
    } catch (err) {
      error('Failed to reject leave request');
      console.error('Error rejecting leave request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle adding a comment
  const handleAddComment = () => {
    if (!comment.trim() || !onAddComment) return;
    
    try {
      setIsSubmitting(true);
      onAddComment(leaveRequest.id, comment);
      setComment('');
      success('Comment added successfully');
    } catch (err) {
      error('Failed to add comment');
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    if (!fileUpload || !onUploadDocument) return;
    
    try {
      setIsUploading(true);
      onUploadDocument(leaveRequest.id, fileUpload);
      setFileUpload(null);
      success('Document uploaded successfully');
    } catch (err) {
      error('Failed to upload document');
      console.error('Error uploading document:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUpload(e.target.files[0]);
    }
  };

  return (
    <div>
      {/* Back Button */}
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="text-primary-600 hover:text-primary-900 flex items-center"
        >
          <FiArrowLeft className="mr-2" />
          Back to Leave Requests
        </button>
      </div>
      
      {/* Leave Request Details */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{leaveRequest.type}</h2>
              <p className="text-gray-600">Requested by {leaveRequest.employeeName}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${leaveRequest.status === 'approved' ? 'bg-green-100 text-green-800' : 
                leaveRequest.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'}`}>
                {leaveRequest.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Leave Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="text-base">
                    {new Date(leaveRequest.startDate).toLocaleDateString()} to {new Date(leaveRequest.endDate).toLocaleDateString()}
                    <span className="ml-2 text-gray-500">({leaveRequest.totalDays} days)</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Reason</p>
                  <p className="text-base">{leaveRequest.reason}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Applied On</p>
                  <p className="text-base">{new Date(leaveRequest.appliedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status Information</h3>
              <div className="space-y-3">
                {leaveRequest.approvedBy && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reviewed By</p>
                      <p className="text-base">{leaveRequest.approvedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reviewed On</p>
                      <p className="text-base">{leaveRequest.approvedDate ? new Date(leaveRequest.approvedDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </>
                )}
                
                {leaveRequest.status === 'pending' && isHRorAdmin && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-500 mb-2">Actions</p>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleApprove}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                      >
                        <FiCheck className="mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                      >
                        <FiX className="mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Medical Documents Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Medical Documents</h3>
        </div>
        
        <div className="p-6">
          {!leaveRequest.medicalDocuments || leaveRequest.medicalDocuments.length === 0 ? (
            <p className="text-gray-500">No medical documents attached to this leave request.</p>
          ) : (
            <div className="space-y-4">
              {leaveRequest.medicalDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <FiPaperclip className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${doc.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                          {doc.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <button className="text-primary-600 hover:text-primary-900">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Upload Document Section (only for the employee who owns the request) */}
          {leaveRequest.employeeId === user?.id && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Upload Medical Document</h4>
              <div className="flex space-x-3">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <button
                  onClick={handleFileUpload}
                  disabled={!fileUpload || isUploading}
                  className="px-4 py-2 bg-primary-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Comments</h3>
        </div>
        
        <div className="p-6">
          {leaveRequest.comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {leaveRequest.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-800 font-medium">
                        {comment.userName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{comment.userName}</h3>
                      <p className="text-xs text-gray-500">{new Date(comment.date).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm text-gray-800 mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Add Comment Form */}
          <div className="mt-6">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
              Add a comment
            </label>
            <div className="mt-1 flex space-x-3">
              <textarea
                id="comment"
                name="comment"
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={handleAddComment}
                disabled={!comment.trim() || isSubmitting}
                className="self-end px-4 py-2 bg-primary-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestDetail;