import React, { useState } from 'react';
import { 
  FiClipboard, 
  FiUser, 
  FiCalendar, 
  FiEdit, 
  FiArrowLeft, 
  FiStar, 
  FiCheck,
  FiX 
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { PerformanceReview } from '../../types';
import { isHRorAdmin } from '../../lib/auth';
import { formatDate } from '../../lib/utils';

interface PerformanceReviewDetailProps {
  review: PerformanceReview;
  onAcknowledge?: (id: string, comments: string) => void;
  onEdit?: (id: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

const PerformanceReviewDetail: React.FC<PerformanceReviewDetailProps> = ({
  review,
  onAcknowledge,
  onEdit,
  onBack,
  showBackButton = true
}) => {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [acknowledgementComments, setAcknowledgementComments] = useState<string>('');
  const [showAcknowledgeForm, setShowAcknowledgeForm] = useState<boolean>(false);
  const isUserHRorAdmin = user && isHRorAdmin(user);
  const canEditReview = isUserHRorAdmin;
  const isReviewSubject = user?.id === review.employeeId;
  
  // Handle acknowledging the review
  const handleAcknowledge = () => {
    if (!onAcknowledge) return;
    
    try {
      onAcknowledge(review.id, acknowledgementComments);
      success('Review acknowledged successfully');
      setShowAcknowledgeForm(false);
    } catch (err) {
      error('Failed to acknowledge review');
      console.error('Error acknowledging review:', err);
    }
  };

  // Handle editing the review
  const handleEdit = () => {
    if (onEdit) {
      onEdit(review.id);
    }
  };

  // Handle back button
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  // Get color for rating
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-100 text-green-800';
    if (rating >= 3.5) return 'bg-blue-100 text-blue-800';
    if (rating >= 2.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Rating descriptions
  const getRatingDescription = (rating: number) => {
    if (rating >= 4.5) return 'Outstanding';
    if (rating >= 3.5) return 'Exceeds Expectations';
    if (rating >= 2.5) return 'Meets Expectations';
    if (rating >= 1.5) return 'Needs Improvement';
    return 'Unsatisfactory';
  };

  return (
    <div>
      {/* Back Button and Actions */}
      {showBackButton && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <button onClick={handleBack} className="text-primary-600 hover:text-primary-900 flex items-center">
              <FiArrowLeft className="mr-2" />
              Back to Reviews
            </button>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {canEditReview && review.status !== 'completed' && (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-primary-600 text-white rounded font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
              >
                <FiEdit className="mr-2" />
                Edit Review
              </button>
            )}
            
            {isReviewSubject && review.status === 'pending_employee' && !review.employeeAcknowledgement.acknowledged && (
              <button
                onClick={() => setShowAcknowledgeForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
              >
                <FiCheck className="mr-2" />
                Acknowledge Review
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Review Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-800 font-bold text-2xl">
                {review.employeeName.charAt(0)}
              </span>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
              <h1 className="text-2xl font-bold text-gray-900">{review.employeeName}</h1>
              <div className="flex flex-col md:flex-row md:items-center mt-1 text-gray-600">
                <span className="flex items-center">
                  <FiClipboard className="mr-1" />
                  {review.reviewPeriod}
                </span>
                <span className="hidden md:inline mx-2">•</span>
                <span className="flex items-center">
                  <FiCalendar className="mr-1" />
                  {formatDate(review.reviewDate)}
                </span>
                <span className="hidden md:inline mx-2">•</span>
                <span className="flex items-center">
                  <FiUser className="mr-1" />
                  Reviewer: {review.reviewerName}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-center">
            <div className={`flex items-center justify-center h-16 w-16 rounded-full ${getRatingColor(review.overallRating)}`}>
              <span className="text-xl font-bold">{review.overallRating.toFixed(1)}</span>
            </div>
            <span className="mt-1 text-sm font-medium">{getRatingDescription(review.overallRating)}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
            review.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {review.status === 'completed' ? 'Completed' : 'Pending Acknowledgement'}
          </span>
        </div>
      </div>
      
      {/* Acknowledgement Form */}
      {showAcknowledgeForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Acknowledge Performance Review</h2>
          <p className="text-gray-600 mb-4">
            Please review your performance evaluation and provide any comments before acknowledging.
          </p>
          
          <div className="mb-4">
            <label htmlFor="acknowledgementComments" className="block text-sm font-medium text-gray-700 mb-1">
              Your Comments (Optional)
            </label>
            <textarea
              id="acknowledgementComments"
              value={acknowledgementComments}
              onChange={(e) => setAcknowledgementComments(e.target.value)}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Add your comments, feedback, or concerns about this review..."
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAcknowledgeForm(false)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FiX className="inline-block mr-2" />
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleAcknowledge}
              className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FiCheck className="inline-block mr-2" />
              Acknowledge Review
            </button>
          </div>
        </div>
      )}
      
      {/* Performance Categories */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Evaluation</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {review.categories.map((category, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-gray-800">{category.name}</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`h-5 w-5 ${
                        star <= category.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {category.rating}/5
                  </span>
                </div>
              </div>
              {category.comments && (
                <p className="text-sm text-gray-600">{category.comments}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Strengths and Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Strengths</h2>
          <p className="text-gray-600 whitespace-pre-line">{review.strengths}</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Areas for Improvement</h2>
          <p className="text-gray-600 whitespace-pre-line">{review.areasForImprovement}</p>
        </div>
      </div>
      
      {/* Performance Goals */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Goals</h2>
        
        <ul className="space-y-2">
          {review.goals.map((goal, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs font-medium text-primary-800">{index + 1}</span>
              </div>
              <span className="text-gray-600">{goal}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Employee Acknowledgement */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Employee Acknowledgement</h2>
        
        {review.employeeAcknowledgement.acknowledged ? (
          <div>
            <div className="flex items-center text-green-700 mb-2">
              <FiCheck className="h-5 w-5 mr-2" />
              <span className="font-medium">Acknowledged on {formatDate(review.employeeAcknowledgement.date || '')}</span>
            </div>
            {review.employeeComments && (
              <div className="mt-3">
                <h3 className="text-md font-medium text-gray-800 mb-2">Employee Comments:</h3>
                <p className="text-gray-600 whitespace-pre-line border-l-4 border-gray-200 pl-4 py-1">
                  {review.employeeComments}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center text-yellow-700">
            <FiX className="h-5 w-5 mr-2" />
            <span className="font-medium">Pending employee acknowledgement</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceReviewDetail;