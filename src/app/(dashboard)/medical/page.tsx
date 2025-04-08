'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import MedicalDocumentList from '../../../components/medical/MedicalDocumentList';
import MedicalDocumentForm from '../../../components/medical/MedicalDocumentForm';
import Modal from '../../../components/ui/Modal';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { getMedicalDocumentsByEmployee, getPendingMedicalDocuments } from '../../../lib/mockData/medicalDocuments';
import { MedicalDocument } from '../../../types';
import { isHRorAdmin } from '../../../lib/auth';

export default function MedicalPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [isUserHRorAdmin, setIsUserHRorAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = () => {
      try {
        if (!user) return;

        const userIsHRorAdmin = isHRorAdmin(user);
        setIsUserHRorAdmin(userIsHRorAdmin);
        
        // Load documents based on user role
        let docs;
        if (userIsHRorAdmin) {
          docs = getPendingMedicalDocuments();
        } else {
          docs = getMedicalDocumentsByEmployee(user.id);
        }
        
        setDocuments(docs);
      } catch (err) {
        console.error('Error loading medical documents:', err);
        error('Failed to load medical documents');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, error]);

  // Handle viewing document details
  const handleViewDocument = (id: string) => {
    router.push(`/medical/${id}`);
  };

  // Handle verifying a document
const handleVerifyDocument = (id: string) => {
    try {
      // Mock updating the document
      const updatedDocuments = documents.map(doc => {
        if (doc.id === id) {
          return {
            ...doc,
            status: 'verified',
            verifiedBy: user?.name || 'HR Manager',
            verificationDate: new Date().toISOString().split('T')[0]
          };
        }
        return doc;
      });
      
      setDocuments(updatedDocuments);
      success('Document verified successfully');
    } catch (err) {
      error('Failed to verify document');
      console.error('Error verifying document:', err);
    }
  };
  
  // Handle rejecting a document
  const handleRejectDocument = (id: string) => {
    try {
      // Mock updating the document
      const updatedDocuments = documents.map(doc => {
        if (doc.id === id) {
          return {
            ...doc,
            status: 'rejected',
            verifiedBy: user?.name || 'HR Manager',
            verificationDate: new Date().toISOString().split('T')[0]
          };
        }
        return doc;
      });
      
      setDocuments(updatedDocuments);
      success('Document rejected successfully');
    } catch (err) {
      error('Failed to reject document');
      console.error('Error rejecting document:', err);
    }
  };
  
  // Handle uploading a new document
  const handleUploadDocument = (formData: any) => {
    try {
      // Mock creating a new document
      const newDocument: MedicalDocument = {
        id: `md${documents.length + 1}`,
        employeeId: user?.id || '',
        employeeName: user?.name || '',
        title: formData.title,
        description: formData.description,
        filename: formData.filename,
        uploadDate: new Date().toISOString().split('T')[0],
        leaveRequestId: formData.leaveRequestId || null,
        status: 'pending',
        verifiedBy: null,
        verificationDate: null,
        comments: []
      };
      
      setDocuments([...documents, newDocument]);
      setShowUploadModal(false);
      success('Document uploaded successfully');
    } catch (err) {
      error('Failed to upload document');
      console.error('Error uploading document:', err);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title="Medical Documents">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <MedicalDocumentList
            documents={documents}
            onView={handleViewDocument}
            onVerify={handleVerifyDocument}
            onReject={handleRejectDocument}
            onAddNew={() => setShowUploadModal(true)}
          />
        )}
        
        {/* Upload Document Modal */}
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Upload Medical Document"
          size="lg"
        >
          <MedicalDocumentForm
            onSubmit={handleUploadDocument}
            onCancel={() => setShowUploadModal(false)}
          />
        </Modal>
      </DashboardLayout>
    </ProtectedRoute>
  );
}