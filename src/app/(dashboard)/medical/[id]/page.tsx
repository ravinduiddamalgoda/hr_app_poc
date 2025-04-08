'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../../components/auth/ProtectedRoute';
import MedicalDocumentDetail from '../../../../components/medical/MedicalDocumentDetail';
import { useAuth } from '../../../../context/AuthContext';
import { useNotification } from '../../../../context/NotificationContext';
import { getMedicalDocumentById } from '../../../../lib/mockData/medicalDocuments';
import { MedicalDocument } from '../../../../types';

export default function MedicalDocumentDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [document, setDocument] = useState<MedicalDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const doc = getMedicalDocumentById(id);
        
        if (!doc) {
          error('Medical document not found');
          router.push('/medical');
          return;
        }
        
        setDocument(doc);
      } catch (err) {
        console.error('Error loading medical document data:', err);
        error('Failed to load medical document data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, error, router]);

  // Handle navigating back to documents list
  const handleBack = () => {
    router.push('/medical');
  };

  // Handle verifying a document
  const handleVerifyDocument = (id: string, comment?: string) => {
    try {
      // Mock updating the document
      if (!document) return;
      
      const updatedDocument = {
        ...document,
        status: 'verified',
        verifiedBy: user?.name || 'HR Manager',
        verificationDate: new Date().toISOString().split('T')[0],
        comments: comment ? [
          ...document.comments,
          {
            id: `c${document.comments.length + 1}`,
            userId: user?.id || '0',
            userName: user?.name || 'HR Manager',
            text: comment,
            date: new Date().toISOString().split('T')[0]
          }
        ] : document.comments
      };
      
      setDocument(updatedDocument);
      success('Document verified successfully');
    } catch (err) {
      error('Failed to verify document');
      console.error('Error verifying document:', err);
    }
  };

  // Handle rejecting a document
  const handleRejectDocument = (id: string, reason: string) => {
    try {
      // Mock updating the document
      if (!document) return;
      
      const updatedDocument = {
        ...document,
        status: 'rejected',
        verifiedBy: user?.name || 'HR Manager',
        verificationDate: new Date().toISOString().split('T')[0],
        comments: [
          ...document.comments,
          {
            id: `c${document.comments.length + 1}`,
            userId: user?.id || '0',
            userName: user?.name || 'HR Manager',
            text: reason,
            date: new Date().toISOString().split('T')[0]
          }
        ]
      };
      
      setDocument(updatedDocument);
      success('Document rejected successfully');
    } catch (err) {
      error('Failed to reject document');
      console.error('Error rejecting document:', err);
    }
  };

  // Handle adding a comment
  const handleAddComment = (id: string, text: string) => {
    try {
      // Mock adding a comment
      if (!document) return;
      
      const updatedDocument = {
        ...document,
        comments: [
          ...document.comments,
          {
            id: `c${document.comments.length + 1}`,
            userId: user?.id || '0',
            userName: user?.name || 'User',
            text: text,
            date: new Date().toISOString().split('T')[0]
          }
        ]
      };
      
      setDocument(updatedDocument);
      success('Comment added successfully');
    } catch (err) {
      error('Failed to add comment');
      console.error('Error adding comment:', err);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout title="Medical Document Details">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!document) {
    return (
      <ProtectedRoute>
        <DashboardLayout title="Medical Document Details">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Document Not Found</h3>
            <p className="text-gray-600 mb-4">The medical document you are looking for does not exist or has been removed.</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Documents
            </button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout title={`Medical Document: ${document.title}`}>
        <MedicalDocumentDetail
          document={document}
          onVerify={handleVerifyDocument}
          onReject={handleRejectDocument}
          onBack={handleBack}
          onAddComment={handleAddComment}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}