import React, { useState } from 'react';
import { FiArrowLeft, FiCheck, FiX, FiMessageSquare, FiPaperclip, FiDownload, FiEdit } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { MedicalDocument } from '../../types';
import { isHRorAdmin } from '../../lib/auth';

interface MedicalDocumentDetailProps {
  document: MedicalDocument;
  onVerify?: (id: string, comment?: string) => void;
  onReject?: (id: string, comment: string) => void | undefined;
  onAddComment?: (id: string, text: string) => void;
  onEdit?: (id: string) => void;
  onBack?: () => void;
}

const MedicalDocumentDetail: React.FC<MedicalDocumentDetailProps> = ({
  document,
  onVerify,
  onReject,
  onAddComment,
  onEdit,
  onBack
}) => {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isUserHRorAdmin = user ? isHRorAdmin(user) : false;
  const isOwner = user?.id === document.employeeId;

  // Handle document verification
  const handleVerify = () => {
    if (!onVerify) return;
    
    try {
      setIsSubmitting(true);
      onVerify(document.id, comment);
      setComment('');
      success('Document verified successfully');
    } catch (err) {
      error('Failed to verify document');
      console.error('Error verifying document:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle document rejection
  const handleReject = () => {
    if (!onReject) return;
    
    try {
      setIsSubmitting(true);
      onReject(document.id, comment);
      setComment('');
      success('Document rejected successfully');
    } catch (err) {
      error('Failed to reject document');
      console.error('Error rejecting document:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle adding a comment
  const handleAddComment = () => {
    if (!comment.trim() || !onAddComment) return;
    
    try {
      setIsSubmitting(true);
      onAddComment(document.id, comment);
      setComment('');
      success('Comment added successfully');
    } catch (err) {
      error('Failed to add comment');
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit document
  const handleEdit = () => {
    if (onEdit) {
      onEdit(document.id);
    }
  };

  return (
    <div>
      {/* Back Button */}
      <div className="mb-6 flex justify-between">
        <button 
          onClick={onBack}
          className="text-primary-600 hover:text-primary-900 flex items-center"
        >
          <FiArrowLeft className="mr-2" />
          Back to Medical Documents
        </button>
        
        {/* Edit button (only for document owner or admin) */}
        {(isOwner || isUserHRorAdmin) && document.status === 'pending' && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-primary-600 text-white rounded font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
          >
            <FiEdit className="mr-2" />
            Edit Document
          </button>
        )}
      </div>
      
      {/* Document Details */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <FiPaperclip className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{document.title}</h2>
                <p className="text-gray-600">Uploaded by {document.employeeName}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${document.status === 'verified' ? 'bg-green-100 text-green-800' : 
                document.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'}`}>
                {document.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Document Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-base">{document.description || 'No description provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">File Name</p>
                  <p className="text-base flex items-center">
                    <FiPaperclip className="mr-2 text-gray-400" />
                    {document.filename}
                    <button className="ml-2 text-primary-600 hover:text-primary-900">
                      <FiDownload className="h-4 w-4" />
                    </button>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Upload Date</p>
                  <p className="text-base">{new Date(document.uploadDate).toLocaleDateString()}</p>
                </div>
                {document.leaveRequestId && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Related Leave Request</p>
                    <a href={`/leave/${document.leaveRequestId}`} className="text-primary-600 hover:text-primary-900">
                      View Leave Request
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Information</h3>
              <div className="space-y-3">
                {document.status !== 'pending' && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="text-base">{document.status === 'verified' ? 'Verified' : 'Rejected'}</p>
                    </div>
                    {document.verifiedBy && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Verified/Rejected By</p>
                        <p className="text-base">{document.verifiedBy}</p>
                      </div>
                    )}
                    {document.verificationDate && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Verification Date</p>
                        <p className="text-base">{new Date(document.verificationDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </>
                )}
                
                {/* Verification actions for HR/Admin */}
                {isUserHRorAdmin && document.status === 'pending' && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-500 mb-2">Actions</p>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleVerify}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                      >
                        <FiCheck className="mr-2" />
                        Verify
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
          
          {/* Document Preview (mock) */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Document Preview</h3>
            <div className="border border-gray-300 rounded-md bg-gray-100 h-64 flex items-center justify-center">
              <div className="text-center">
                <FiPaperclip className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Preview not available</p>
                <button className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Download Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Comments</h3>
        </div>
        
        <div className="p-6">
          {document.comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {document.comments.map((comment) => (
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

export default MedicalDocumentDetail;