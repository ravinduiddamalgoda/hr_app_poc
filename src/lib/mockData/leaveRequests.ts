import { LeaveRequest, Comment, MedicalDocumentRef } from '../../types';

export const leaveRequests: LeaveRequest[] = [
  {
    id: 'l1',
    employeeId: '3', // John Smith
    employeeName: 'John Smith',
    type: 'Annual Leave',
    startDate: '2023-12-20',
    endDate: '2023-12-27',
    totalDays: 8,
    reason: 'Christmas vacation with family',
    status: 'pending',
    appliedDate: '2023-11-25',
    approvedBy: null,
    approvedDate: null,
    comments: [],
  },
  {
    id: 'l2',
    employeeId: '4', // Jane Doe
    employeeName: 'Jane Doe',
    type: 'Sick Leave',
    startDate: '2023-11-10',
    endDate: '2023-11-12',
    totalDays: 3,
    reason: 'Cold and fever',
    status: 'approved',
    appliedDate: '2023-11-09',
    approvedBy: 'HR Manager',
    approvedDate: '2023-11-09',
    comments: [
      {
        id: 'c1',
        userId: '2', // HR Manager
        userName: 'HR Manager',
        text: 'Get well soon!',
        date: '2023-11-09'
      }
    ],
    medicalDocuments: [
      {
        id: 'm1',
        fileName: 'doctors_note.pdf',
        uploadDate: '2023-11-09',
        status: 'verified'
      }
    ]
  },
  {
    id: 'l3',
    employeeId: '5', // Bob Johnson
    employeeName: 'Bob Johnson',
    type: 'Annual Leave',
    startDate: '2023-12-01',
    endDate: '2023-12-05',
    totalDays: 5,
    reason: 'Family event',
    status: 'approved',
    appliedDate: '2023-11-15',
    approvedBy: 'HR Manager',
    approvedDate: '2023-11-16',
    comments: []
  },
  {
    id: 'l4',
    employeeId: '3', // John Smith
    employeeName: 'John Smith',
    type: 'Personal Leave',
    startDate: '2023-11-20',
    endDate: '2023-11-20',
    totalDays: 1,
    reason: 'Personal appointment',
    status: 'rejected',
    appliedDate: '2023-11-18',
    approvedBy: 'HR Manager',
    approvedDate: '2023-11-19',
    comments: [
      {
        id: 'c2',
        userId: '2', // HR Manager
        userName: 'HR Manager',
        text: 'We have an important client meeting on this day that requires your presence.',
        date: '2023-11-19'
      }
    ]
  },
  {
    id: 'l5',
    employeeId: '4', // Jane Doe
    employeeName: 'Jane Doe',
    type: 'Annual Leave',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    totalDays: 5,
    reason: 'Winter vacation',
    status: 'pending',
    appliedDate: '2023-11-25',
    approvedBy: null,
    approvedDate: null,
    comments: []
  }
];

// Helper functions
export const getLeaveRequestById = (id: string): LeaveRequest | undefined => {
  return leaveRequests.find(request => request.id === id);
};

export const getLeaveRequestsByEmployee = (employeeId: string): LeaveRequest[] => {
  return leaveRequests.filter(request => request.employeeId === employeeId);
};

export const getLeaveRequestsByStatus = (status: LeaveRequest['status']): LeaveRequest[] => {
  return leaveRequests.filter(request => request.status === status);
};

export const getPendingLeaveRequests = (): LeaveRequest[] => {
  return leaveRequests.filter(request => request.status === 'pending');
};

interface NewLeaveRequest {
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  [key: string]: any;
}

// Mock function to add a new leave request
export const addLeaveRequest = (newRequest: NewLeaveRequest): LeaveRequest => {
  const request: LeaveRequest = {
    id: `l${leaveRequests.length + 1}`,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    approvedBy: null,
    approvedDate: null,
    comments: [],
    ...newRequest
  };
  
  leaveRequests.push(request);
  return request;
};

interface LeaveRequestUpdates {
  status?: LeaveRequest['status'];
  approvedBy?: string | null;
  approvedDate?: string | null;
  comments?: Comment[];
  [key: string]: any;
}

// Mock function to update a leave request
export const updateLeaveRequest = (id: string, updates: LeaveRequestUpdates): LeaveRequest | null => {
  const index = leaveRequests.findIndex(request => request.id === id);
  if (index !== -1) {
    leaveRequests[index] = { ...leaveRequests[index], ...updates };
    return leaveRequests[index];
  }
  return null;
};