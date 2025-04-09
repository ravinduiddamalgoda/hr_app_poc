'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import WarningList from '../../../components/disciplinary/WarningList';
import Modal from '../../../components/ui/Modal';
import WarningForm from '../../../components/disciplinary/WarningForm';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { getActiveWarnings, getPendingAcknowledgements, addWarning, acknowledgeWarning } from '../../../lib/mockData/warnings';
import { employees } from '../../../lib/mockData/employees';
import { isHRorAdmin } from '../../../lib/auth';
import { Warning } from '../../../types';

export default function DisciplinaryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUserHRorAdmin, setIsUserHRorAdmin] = useState<boolean>(false);

  useEffect(() => {
    const loadData = () => {
      try {
        if (!user) return;

        const userIsHRorAdmin = isHRorAdmin(user);
        setIsUserHRorAdmin(userIsHRorAdmin);
        
        // Load warnings based on user role
        let warningsList;
        if (userIsHRorAdmin) {
          // HR/Admin sees all active warnings
          warningsList = getActiveWarnings();
        } else {
          // Regular employee only sees their own warnings
          warningsList = getActiveWarnings().filter(w => w.employeeId === user.id);
        }
        
        setWarnings(warningsList);
      } catch (err) {
        console.error('Error loading warnings:', err);
        error('Failed to load disciplinary records');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, error]);

  // Handle viewing a specific warning
  const handleViewWarning = (id: string) => {
    router.push(`/disciplinary/${id}`);
  };

  // Handle acknowledging a warning
  const handleAcknowledgeWarning = (id: string, comments?: string) => {
    try {
      const updatedWarning = acknowledgeWarning(id, comments);
      if (updatedWarning) {
        // Update the local warnings list
        setWarnings(warnings.map(w => w.id === id ? updatedWarning : w));
        success('Warning acknowledged successfully');
      }
    } catch (err) {
      error('Failed to acknowledge warning');
      console.error('Error acknowledging warning:', err);
    }
  };

  // Handle creating a new warning (HR/Admin only)
  const handleCreateWarning = (formData: any) => {
    try {
      const newWarning = addWarning(formData);
      setWarnings([...warnings, newWarning]);
      setShowAddModal(false);
      success('Warning issued successfully');
    } catch (err) {
      error('Failed to issue warning');
      console.error('Error creating warning:', err);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title="Disciplinary Actions">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
          </div>
        ) : (
          <WarningList
            warnings={warnings}
            onView={handleViewWarning}
            onAcknowledge={handleAcknowledgeWarning}
            onAddNew={isUserHRorAdmin ? () => setShowAddModal(true) : undefined}
          />
        )}
        
        {/* Add Warning Modal (HR/Admin only) */}
        {isUserHRorAdmin && (
          <Modal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            title="Issue Warning"
            size="lg"
          >
            <WarningForm
              employees={employees}
              onSubmit={handleCreateWarning}
              onCancel={() => setShowAddModal(false)}
            />
          </Modal>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}