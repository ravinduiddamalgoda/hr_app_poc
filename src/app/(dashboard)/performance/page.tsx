'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import PerformanceReviewList from '../../../components/performance/PerformanceReviewList';
import Modal from '../../../components/ui/Modal';
import PerformanceReviewForm from '../../../components/performance/PerformanceReviewForm';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  getPerformanceReviewsByEmployee, 
  getPendingEmployeeAcknowledgements, 
  addPerformanceReview,
  acknowledgePerformanceReview
} from '../../../lib/mockData/performanceReviews';
import { employees } from '../../../lib/mockData/employees';
import { isHRorAdmin } from '../../../lib/auth';
import { PerformanceReview } from '../../../types';

export default function PerformancePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUserHRorAdmin, setIsUserHRorAdmin] = useState<boolean>(false);

  useEffect(() => {
    const loadData = () => {
      try {
        if (!user) return;

        const userIsHRorAdmin = isHRorAdmin(user);
        setIsUserHRorAdmin(userIsHRorAdmin);
        
        // Load performance reviews based on user role
        let reviewsList;
        if (userIsHRorAdmin) {
          // HR/Admin sees all pending reviews that need acknowledgement
          reviewsList = getPendingEmployeeAcknowledgements();
        } else {
          // Regular employee only sees their own reviews
          reviewsList = getPerformanceReviewsByEmployee(user.id);
        }
        
        setReviews(reviewsList);
      } catch (err) {
        console.error('Error loading performance reviews:', err);
        error('Failed to load performance review data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, error]);

  // Handle viewing a specific performance review
  const handleViewReview = (id: string) => {
    router.push(`/performance/${id}`);
  };

  // Handle acknowledging a review (for employees)
  const handleAcknowledgeReview = (id: string, comments: string) => {
    try {
      const updatedReview = acknowledgePerformanceReview(id, comments);
      if (updatedReview) {
        // Update the local reviews list
        setReviews(prevReviews => prevReviews.filter(review => review.id !== id));
        success('Performance review acknowledged successfully');
      }
    } catch (err) {
      error('Failed to acknowledge performance review');
      console.error('Error acknowledging performance review:', err);
    }
  };

  // Handle creating a new performance review (HR/Admin only)
  const handleCreateReview = (formData: any) => {
    try {
      const newReview = addPerformanceReview(formData);
      
      // Only add to the displayed list if it's relevant to the current view
      if (isUserHRorAdmin && newReview.status === 'pending_employee') {
        setReviews([...reviews, newReview]);
      }
      
      setShowCreateModal(false);
      success('Performance review created successfully');
    } catch (err) {
      error('Failed to create performance review');
      console.error('Error creating performance review:', err);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title="Performance Reviews">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
          </div>
        ) : (
          <PerformanceReviewList
            reviews={reviews}
            onView={handleViewReview}
            onAcknowledge={handleAcknowledgeReview}
            onAddNew={isUserHRorAdmin ? () => setShowCreateModal(true) : undefined}
          />
        )}
        
        {/* Create Review Modal (HR/Admin only) */}
        {isUserHRorAdmin && (
          <Modal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            title="Create Performance Review"
            size="lg"
          >
            <PerformanceReviewForm
              employees={employees}
              onSubmit={handleCreateReview}
              onCancel={() => setShowCreateModal(false)}
            />
          </Modal>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}