import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEye, FiPlus, FiCheck, FiClipboard } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { PerformanceReview } from '../../types';
import { isHRorAdmin } from '../../lib/auth';
import { formatDate } from '../../lib/utils';

interface PerformanceReviewListProps {
  reviews: PerformanceReview[];
  onView?: (id: string) => void;
  onAcknowledge?: (id: string, comments: string) => void;
  onAddNew?: () => void;
}

const PerformanceReviewList: React.FC<PerformanceReviewListProps> = ({
  reviews,
  onView,
  onAcknowledge,
  onAddNew
}) => {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [periodFilter, setPeriodFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [filteredReviews, setFilteredReviews] = useState<PerformanceReview[]>([]);
  const [isUserHRorAdmin, setIsUserHRorAdmin] = useState<boolean>(false);

  // Check if user is HR or admin
  useEffect(() => {
    if (user) {
      setIsUserHRorAdmin(isHRorAdmin(user));
    }
  }, [user]);

  // Filter reviews based on search term, period and status filter
  useEffect(() => {
    let filtered = [...reviews];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply period filter
    if (periodFilter) {
      filtered = filtered.filter(review => review.reviewPeriod === periodFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(review => review.status === statusFilter);
    }
    
    setFilteredReviews(filtered);
  }, [reviews, searchTerm, periodFilter, statusFilter]);

  // Get unique review periods for filter dropdown
  const reviewPeriods = [...new Set(reviews.map(review => review.reviewPeriod))];

  // Handle view review
  const handleView = (id: string) => {
    if (onView) {
      onView(id);
    }
  };

  // Handle acknowledge review
  const handleAcknowledge = (id: string) => {
    // In a real app, this would open a modal or form to add comments
    const comments = prompt('Please add any comments (optional):');
    
    if (onAcknowledge && comments !== null) {
      onAcknowledge(id, comments);
    }
  };

  // Calculate rating color based on rating value
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-100 text-green-800';
    if (rating >= 3.5) return 'bg-blue-100 text-blue-800';
    if (rating >= 2.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div>
      {/* Header with action buttons */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Performance Reviews</h2>
        
        {isUserHRorAdmin && (
          <div className="mt-4 sm:mt-0">
            <button 
              onClick={onAddNew}
              className="px-4 py-2 bg-primary-600 text-white rounded font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
            >
              <FiPlus className="mr-2" />
              Create New Review
            </button>
          </div>
        )}
      </div>
      
      {/* Filters and search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search employees..."
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
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            <option value="">All Periods</option>
            {reviewPeriods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
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
            <option value="pending_employee">Pending Acknowledgement</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {/* Reviews Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isUserHRorAdmin && (
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
                  Review Period
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Review Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Overall Rating
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
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
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  {isUserHRorAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-800 font-medium">
                            {review.employeeName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{review.employeeName}</div>
                          <div className="text-xs text-gray-500">Reviewer: {review.reviewerName}</div>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiClipboard className="h-5 w-5 text-purple-500 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{review.reviewPeriod}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(review.reviewDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRatingColor(review.overallRating)}`}>
                      {review.overallRating.toFixed(1)} / 5.0
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${review.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {review.status === 'completed' ? 'Completed' : 'Pending Acknowledgement'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(review.id)}
                        className="text-primary-600 hover:text-primary-900"
                        title="View"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      
                      {/* Acknowledge button (only for the employee who's being reviewed) */}
                      {review.status === 'pending_employee' && 
                       user?.id === review.employeeId && 
                       !review.employeeAcknowledgement.acknowledged && (
                        <button
                          onClick={() => handleAcknowledge(review.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Acknowledge"
                        >
                          <FiCheck className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={isUserHRorAdmin ? 6 : 5} className="px-6 py-4 text-center text-gray-500">
                    No performance reviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination (static for demo) */}
      {filteredReviews.length > 0 && (
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredReviews.length}</span> of{' '}
                <span className="font-medium">{filteredReviews.length}</span> results
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

export default PerformanceReviewList;