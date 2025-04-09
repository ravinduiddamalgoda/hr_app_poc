'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../../components/auth/ProtectedRoute';
import PerformanceReviewDetail from '../../../../components/performance/PerformanceReviewDetail';
import { useAuth } from '../../../../context/AuthContext';
import { useNotification } from '../../../../context/NotificationContext';
import { 
  getPerformanceReviewById, 
  acknowledgePerformanceReview,
  updatePerformanceReview 
} from '../../../../lib/mockData/performanceReviews';
import { PerformanceReview } from '../../../../types';
import { canViewResource } from '../../../../lib/auth';

export default function PerformanceReviewDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [review, setReview] = useState<PerformanceReview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const reviewData = getPerformanceReviewById(id);
        
        if (!reviewData) {
          error('Performance review not found');
          router.push('/performance');
          return;
        }
        
        // Check if user has permission to view this review
        if (user && !canViewResource(user, reviewData.employeeId)) {
          error('You do not have permission to view this performance review');
          router.push('/performance');
          return;
        }
        
        setReview(reviewData);
      } catch (err) {
        console.error('Error loading performance review data:', err);
        error('Failed to load performance review data');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadData();
    }
  }, [id, user, error, router]);

  // Handle employee acknowledging the review
  const handleAcknowledge = (id: string, comments: string) => {
    try {
      const updatedReview = acknowledgePerformanceReview(id, comments);
      if (updatedReview) {
        setReview(updatedReview);
        success('Performance review acknowledged successfully');
      }
    } catch (err) {
      error('Failed to acknowledge performance review');
      console.error('Error acknowledging performance review:', err);
    }
  };

  // Handle editing the review (for HR/Admin)
  const handleEdit = (id: string) => {
    // This would typically open a modal or navigate to an edit page
    router.push(`/performance/edit/${id}`);
  };

  // Handle navigating back to the reviews list
  const handleBack = () => {
    router.push('/performance');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout title="Performance Review Details">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!review) {
    return (
      <ProtectedRoute>
        <DashboardLayout title="Performance Review Details">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Review Not Found</h3>
            <p className="text-gray-600 mb-4">The performance review you are looking for does not exist or has been removed.</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Performance Reviews
            </button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout title={`Performance Review: ${review.employeeName} - ${review.reviewPeriod}`}>
        <PerformanceReviewDetail
          review={review}
          onAcknowledge={handleAcknowledge}
          onEdit={handleEdit}
          onBack={handleBack}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}