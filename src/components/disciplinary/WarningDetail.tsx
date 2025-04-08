import React, { useState } from 'react';
import { FiArrowLeft, FiAlertTriangle, FiCalendar, FiPaperclip, FiCheck, FiDownload, FiEdit } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Warning } from '../../types';
import { isHRorAdmin } from '../../lib/auth';

interface WarningDetailProps {
  warning: Warning;
  onAcknowledge?: (id: string, comments: string) => void;
  onAddFollowUp?: (id: string, comments: string, date: string) => void;
  onEdit?: (id: string) => void;
  onBack?: () => void;
}

const WarningDetail: React.FC<WarningDetailProps> = ({
  warning,
  onAcknowledge,
  onAddFollowUp,
  onEdit,
  onBack
}) => {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [acknowledgementComment, setAcknowledgementComment] = useState<string>('');
  const [followUpComment, setFollowUpComment] = useState<string>('');
  const [followUpDate, setFollowUpDate] = useState<string>(
    new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isUserHRorAdmin = user ? isHRorAdmin(user) : false;
  const isOwner = user?.id === warning.employeeId;

  // Severity level style
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'minor':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderate':
        return 'bg-orange-100 text-orange-800';
      case 'serious':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle employee acknowledgement
  const handleAcknowledge = () => {
    if (!onAcknowledge) return;
    
    try {
      setIsSubmitting(true);
      onAcknowledge(warning.id, acknowledgementComment);
      success('Warning has been acknowledged');
    } catch (err) {
      error('Failed to acknowledge warning');
      console.error('Error acknowledging warning:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle HR follow-up addition
  const handleAddFollowUp = () => {
    if (!onAddFollowUp) return;
    
    try {
      setIsSubmitting(true);
      onAddFollowUp(warning.id, followUpComment, followUpDate);
      setFollowUpComment('');
      success('Follow-up added successfully');
    } catch (err) {
      error('Failed to add follow-up');
      console.error('Error adding follow-up:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit warning
  const handleEdit = () => {
    if (onEdit) {
      onEdit(warning.id);
    }
  };

  return (
    <div>
      {/* Back Button and Actions */}
      <div className="mb-6 flex justify-between">
        <button 
          onClick={onBack}
          className="text-primary-600 hover:text-primary-900 flex items-center"
        >
          <FiArrowLeft className="mr-2" />
          Back to Warnings
        </button>
        
        {/* Edit button (only for HR/admin) */}
        {isUserHRorAdmin && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-primary-600 text-white rounded font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
          >
            <FiEdit className="mr-2" />
            Edit Warning
          </button>
        )}
      </div>
      
      {/* Warning Details */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                <FiAlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{warning.title}</h2>
                <p className="text-gray-600">Issued to {warning.employeeName}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className={`mr-2 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityStyle(warning.severity)}`}>
                {warning.severity.charAt(0).toUpperCase() + warning.severity.slice(1)} Severity
              </span>
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${warning.acknowledgement.acknowledged ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {warning.acknowledgement.acknowledged ? 'Acknowledged' : 'Pending Acknowledgement'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Warning Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="text-base">{warning.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-base whitespace-pre-line">{warning.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Issue Date</p>
                  <p className="text-base flex items-center">
                    <FiCalendar className="mr-2 text-gray-400" />
                    {new Date(warning.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Issued By</p>
                  <p className="text-base">{warning.issuedBy}</p>
                </div>
              </div>

              {/* Supporting Documents */}
              {warning.attachments.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Supporting Documents</h4>
                  <div className="space-y-2">
                    {warning.attachments.map(attachment => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                        <div className="flex items-center">
                          <FiPaperclip className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm">{attachment.filename}</span>
                        </div>
                        <button className="text-primary-600 hover:text-primary-900">
                          <FiDownload className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Acknowledgement Information</h3>
              <div className="space-y-3">
                {warning.acknowledgement.acknowledged ? (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Acknowledged On</p>
                      <p className="text-base">{warning.acknowledgement.date && new Date(warning.acknowledgement.date).toLocaleDateString()}</p>
                    </div>
                    {warning.acknowledgement.comments && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Employee Comments</p>
                        <p className="text-base whitespace-pre-line">{warning.acknowledgement.comments}</p>
                      </div>
                    )}
                  </>
                ) : isOwner ? (
                  // Acknowledgement form for employee
                  <div className="border border-gray-200 rounded-md p-4">
                    <p className="text-sm text-gray-700 mb-4">
                      Please acknowledge that you have read and understood this warning. You can provide comments if you wish.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="acknowledgementComment" className="block text-sm font-medium text-gray-700">
                          Comments (Optional)
                        </label>
                        <textarea
                          id="acknowledgementComment"
                          rows={4}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Add your comments here..."
                          value={acknowledgementComment}
                          onChange={(e) => setAcknowledgementComment(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={handleAcknowledge}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                      >
                        <FiCheck className="mr-2" />
                        {isSubmitting ? 'Submitting...' : 'Acknowledge Warning'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-yellow-600">
                    This warning is pending acknowledgement from the employee.
                  </p>
                )}

                {/* Follow-up Section */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Follow-up</h4>
                  {warning.followUpDate ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Follow-up Date</p>
                        <p className="text-base">{new Date(warning.followUpDate).toLocaleDateString()}</p>
                      </div>
                      {warning.followUpComments && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Follow-up Comments</p>
                          <p className="text-base whitespace-pre-line">{warning.followUpComments}</p>
                        </div>
                      )}
                    </div>
                  ) : isUserHRorAdmin ? (
                    // Follow-up form for HR/admin
                    <div className="border border-gray-200 rounded-md p-4">
                      <p className="text-sm text-gray-700 mb-4">
                        Add a follow-up to this warning to monitor the employee's progress.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700">
                            Follow-up Date
                          </label>
                          <input
                            type="date"
                            id="followUpDate"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor="followUpComment" className="block text-sm font-medium text-gray-700">
                            Comments
                          </label>
                          <textarea
                            id="followUpComment"
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Add follow-up comments here..."
                            value={followUpComment}
                            onChange={(e) => setFollowUpComment(e.target.value)}
                          />
                        </div>
                        <button
                          onClick={handleAddFollowUp}
                          disabled={!followUpComment.trim() || isSubmitting}
                          className="px-4 py-2 bg-primary-600 text-white rounded font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          {isSubmitting ? 'Adding...' : 'Add Follow-up'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No follow-up has been scheduled yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningDetail;