import { MedicalDocument, Comment } from '../../types';

export const medicalDocuments: MedicalDocument[] = [
  {
    id: 'md1',
    employeeId: '4', // Jane Doe
    employeeName: 'Jane Doe',
    title: 'Doctor\'s Note',
    description: 'Medical certificate for cold and fever',
    filename: 'doctors_note_jane.pdf',
    uploadDate: '2023-11-09',
    leaveRequestId: 'l2',
    status: 'verified',
    verifiedBy: 'HR Manager',
    verificationDate: '2023-11-09',
    comments: [
      {
        id: 'md-c1',
        userId: '2', // HR Manager
        userName: 'HR Manager',
        text: 'Document verified',
        date: '2023-11-09'
      }
    ]
  },
  {
    id: 'md2',
    employeeId: '3', // John Smith
    employeeName: 'John Smith',
    title: 'Annual Health Checkup',
    description: 'Results from annual health assessment',
    filename: 'annual_checkup_john.pdf',
    uploadDate: '2023-10-15',
    leaveRequestId: null, // Not associated with a leave request
    status: 'verified',
    verifiedBy: 'HR Manager',
    verificationDate: '2023-10-16',
    comments: [
      {
        id: 'md-c2',
        userId: '2', // HR Manager
        userName: 'HR Manager',
        text: 'Annual checkup verified and recorded',
        date: '2023-10-16'
      }
    ]
  },
  {
    id: 'md3',
    employeeId: '5', // Bob Johnson
    employeeName: 'Bob Johnson',
    title: 'Physical Therapy Prescription',
    description: 'Prescription for physical therapy sessions',
    filename: 'pt_prescription_bob.pdf',
    uploadDate: '2023-09-20',
    leaveRequestId: null,
    status: 'verified',
    verifiedBy: 'HR Manager',
    verificationDate: '2023-09-21',
    comments: []
  },
  {
    id: 'md4',
    employeeId: '3', // John Smith
    employeeName: 'John Smith',
    title: 'Medical Expense Claim',
    description: 'Medical bills for reimbursement',
    filename: 'medical_expense_john.pdf',
    uploadDate: '2023-11-20',
    leaveRequestId: null,
    status: 'pending',
    verifiedBy: null,
    verificationDate: null,
    comments: []
  },
  {
    id: 'md5',
    employeeId: '7', // Mike Peters
    employeeName: 'Mike Peters',
    title: 'Specialist Referral',
    description: 'Referral to a specialist doctor',
    filename: 'specialist_referral_mike.pdf',
    uploadDate: '2023-11-15',
    leaveRequestId: null,
    status: 'pending',
    verifiedBy: null,
    verificationDate: null,
    comments: []
  }
];

// Helper functions
export const getMedicalDocumentById = (id: string): MedicalDocument | undefined => {
  return medicalDocuments.find(doc => doc.id === id);
};

export const getMedicalDocumentsByEmployee = (employeeId: string): MedicalDocument[] => {
  return medicalDocuments.filter(doc => doc.employeeId === employeeId);
};

export const getMedicalDocumentsByStatus = (status: MedicalDocument['status']): MedicalDocument[] => {
  return medicalDocuments.filter(doc => doc.status === status);
};

export const getMedicalDocumentsByLeaveRequest = (leaveRequestId: string): MedicalDocument[] => {
  return medicalDocuments.filter(doc => doc.leaveRequestId === leaveRequestId);
};

export const getPendingMedicalDocuments = (): MedicalDocument[] => {
  return medicalDocuments.filter(doc => doc.status === 'pending');
};

interface NewMedicalDocument {
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  filename: string;
  leaveRequestId: string | null;
  [key: string]: any;
}

// Mock function to add a new medical document
export const addMedicalDocument = (newDocument: NewMedicalDocument): MedicalDocument => {
  const document: MedicalDocument = {
    id: `md${medicalDocuments.length + 1}`,
    uploadDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    verifiedBy: null,
    verificationDate: null,
    comments: [],
    ...newDocument
  };
  
  medicalDocuments.push(document);
  return document;
};

interface MedicalDocumentUpdates {
  status?: MedicalDocument['status'];
  verifiedBy?: string | null;
  verificationDate?: string | null;
  comments?: Comment[];
  [key: string]: any;
}

// Mock function to update a medical document
export const updateMedicalDocument = (id: string, updates: MedicalDocumentUpdates): MedicalDocument | null => {
  const index = medicalDocuments.findIndex(doc => doc.id === id);
  if (index !== -1) {
    medicalDocuments[index] = { ...medicalDocuments[index], ...updates };
    return medicalDocuments[index];
  }
  return null;
};