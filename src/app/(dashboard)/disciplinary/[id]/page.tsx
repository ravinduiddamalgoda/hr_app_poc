'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../../components/auth/ProtectedRoute';
import WarningDetail from '../../../../components/disciplinary/WarningDetail';
import { useAuth } from '../../../../context/AuthContext';
import { useNotification } from '../../../../context/NotificationContext';
import { getWarningById, acknowledgeWarning, updateWarning } from '../../../../lib/mockData/warnings';
import { Warning } from '../../../../types';
import { canViewResource } from '../../../../lib/auth';

export default function DisciplinaryDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [warning, setWarning] = useState<Warning | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const warningData = getWarningById(id);
        
        if (!warningData) {
          error('Warning not found');
          router.push('/disciplinary');
          return;
        }
        
        // Check if user has permission to view this warning
        if (user && !canViewResource(user, warningData.employeeId)) {
          error('You do not have permission to view this warning');
          router.push('/disciplinary');
          return;
        }
        
        setWarning(warningData);
      } catch (err) {
        console.error('Error loading warning data:', err);
        error('Failed to load warning data');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadData();
    }
  }, [id, user, error, router]);

  // Handle acknowledging the warning
  const handleAcknowledge = (id: string, comments: string) => {
    try {
      const updatedWarning = acknowledgeWarning(id, comments);
      if (updatedWarning) {
        setWarning(updatedWarning);
        success('Warning acknowledged successfully');
      }
    } catch (err) {
      error('Failed to acknowledge warning');
      console.error('Error acknowledging warning:', err);
    }
  };

  // Handle adding a follow-up (HR/Admin only)
  const handleAddFollowUp = (id: string, comments: string, date: string) => {
    try {
      const updatedWarning = updateWarning(id, {
        followUpDate: date,
        followUpComments: comments
      });
      
      if (updatedWarning) {
        setWarning(updatedWarning);
        success('Follow-up added successfully');
      }
    } catch (err) {
      error('Failed to add follow-up');
      console.error('Error adding follow-up:', err);
    }
  };

  // Handle navigating back to warnings list
  const handleBack = () => {
    router.push('/disciplinary');
  };

  // Handle editing a warning (not implemented in detail here)
  const handleEdit = (id: string) => {
    // This would typically open a modal or navigate to an edit page
    router.push(`/disciplinary/edit/${id}`);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout title="Warning Details">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!warning) {
    return (
      <ProtectedRoute>
        <DashboardLayout title="Warning Details">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Warning Not Found</h3>
            <p className="text-gray-600 mb-4">The warning you are looking for does not exist or has been removed.</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Warnings
            </button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout title={`Warning: ${warning.title}`}>
        <WarningDetail
          warning={warning}
          onAcknowledge={handleAcknowledge}
          onAddFollowUp={handleAddFollowUp}
          onEdit={handleEdit}
          onBack={handleBack}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}