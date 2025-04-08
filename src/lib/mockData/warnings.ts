import { Warning, Acknowledgement } from '../../types';

export const warnings: Warning[] = [
  {
    id: 'w1',
    employeeId: '7', // Mike Peters
    employeeName: 'Mike Peters',
    type: 'Attendance',
    title: 'Frequent Late Arrivals',
    description: 'You have been late to work more than 5 times in the past month.',
    issueDate: '2023-10-05',
    issuedBy: 'HR Manager',
    severity: 'minor',
    status: 'active',
    acknowledgement: {
      acknowledged: true,
      date: '2023-10-06',
      comments: 'I acknowledge this issue and will improve my punctuality.'
    },
    followUpDate: '2023-11-05',
    followUpComments: 'Improvement noted. Punctuality has improved significantly.',
    attachments: [
      {
        id: 'wa1',
        filename: 'attendance_record.pdf',
        uploadDate: '2023-10-05'
      }
    ]
  },
  {
    id: 'w2',
    employeeId: '3', // John Smith
    employeeName: 'John Smith',
    type: 'Performance',
    title: 'Missed Project Deadline',
    description: 'You missed the deadline for the XYZ project which impacted client delivery.',
    issueDate: '2023-09-15',
    issuedBy: 'HR Manager',
    severity: 'moderate',
    status: 'active',
    acknowledgement: {
      acknowledged: true,
      date: '2023-09-16',
      comments: 'I acknowledge the missed deadline and have implemented a better project tracking system.'
    },
    followUpDate: '2023-10-15',
    followUpComments: 'Improvement seen in subsequent project delivery. Will continue to monitor.',
    attachments: [
      {
        id: 'wa2',
        filename: 'project_timeline.pdf',
        uploadDate: '2023-09-15'
      }
    ]
  },
  {
    id: 'w3',
    employeeId: '5', // Bob Johnson
    employeeName: 'Bob Johnson',
    type: 'Conduct',
    title: 'Inappropriate Communication',
    description: 'Your email communication with the client was deemed unprofessional and did not meet company standards.',
    issueDate: '2023-11-10',
    issuedBy: 'HR Manager',
    severity: 'serious',
    status: 'pending',
    acknowledgement: {
      acknowledged: false,
      date: null,
      comments: null
    },
    followUpDate: null,
    followUpComments: null,
    attachments: [
      {
        id: 'wa3',
        filename: 'email_transcript.pdf',
        uploadDate: '2023-11-10'
      }
    ]
  },
  {
    id: 'w4',
    employeeId: '7', // Mike Peters
    employeeName: 'Mike Peters',
    type: 'Performance',
    title: 'Sales Target Shortfall',
    description: 'You have consistently missed your sales targets for the past quarter.',
    issueDate: '2023-10-20',
    issuedBy: 'HR Manager',
    severity: 'moderate',
    status: 'active',
    acknowledgement: {
      acknowledged: true,
      date: '2023-10-21',
      comments: 'I acknowledge this shortfall and will work with my manager on an improvement plan.'
    },
    followUpDate: '2023-11-20',
    followUpComments: null, // Still pending follow-up
    attachments: [
      {
        id: 'wa4',
        filename: 'sales_performance.pdf',
        uploadDate: '2023-10-20'
      }
    ]
  },
  {
    id: 'w5',
    employeeId: '6', // Sarah Williams
    employeeName: 'Sarah Williams',
    type: 'Attendance',
    title: 'Unauthorized Absence',
    description: 'You were absent on Nov 6-7 without prior approval or notification.',
    issueDate: '2023-11-08',
    issuedBy: 'HR Manager',
    severity: 'moderate',
    status: 'active',
    acknowledgement: {
      acknowledged: true,
      date: '2023-11-09',
      comments: 'I had a family emergency and was unable to notify. I will ensure proper communication in the future.'
    },
    followUpDate: '2023-12-08',
    followUpComments: null, // Still pending follow-up
    attachments: []
  }
];

// Helper functions
export const getWarningById = (id: string): Warning | undefined => {
  return warnings.find(warning => warning.id === id);
};

export const getWarningsByEmployee = (employeeId: string): Warning[] => {
  return warnings.filter(warning => warning.employeeId === employeeId);
};

export const getWarningsByType = (type: string): Warning[] => {
  return warnings.filter(warning => warning.type === type);
};

export const getWarningsBySeverity = (severity: Warning['severity']): Warning[] => {
  return warnings.filter(warning => warning.severity === severity);
};

export const getActiveWarnings = (): Warning[] => {
  return warnings.filter(warning => warning.status === 'active');
};

export const getPendingAcknowledgements = (): Warning[] => {
  return warnings.filter(warning => !warning.acknowledgement.acknowledged);
};

interface NewWarning {
  employeeId: string;
  employeeName: string;
  type: string;
  title: string;
  description: string;
  issuedBy: string;
  severity: Warning['severity'];
  [key: string]: any;
}

// Mock function to add a new warning
export const addWarning = (newWarning: NewWarning): Warning => {
  const warning: Warning = {
    id: `w${warnings.length + 1}`,
    issueDate: new Date().toISOString().split('T')[0],
    status: 'active',
    acknowledgement: {
      acknowledged: false,
      date: null,
      comments: null
    },
    followUpDate: null,
    followUpComments: null,
    attachments: [],
    ...newWarning
  };
  
  warnings.push(warning);
  return warning;
};

interface WarningUpdates {
  status?: Warning['status'];
  acknowledgement?: Acknowledgement;
  followUpDate?: string | null;
  followUpComments?: string | null;
  [key: string]: any;
}

// Mock function to update a warning
export const updateWarning = (id: string, updates: WarningUpdates): Warning | null => {
  const index = warnings.findIndex(warning => warning.id === id);
  if (index !== -1) {
    warnings[index] = { ...warnings[index], ...updates };
    return warnings[index];
  }
  return null;
};

// Mock function to acknowledge a warning
export const acknowledgeWarning = (id: string, comments?: string): Warning | null => {
  const index = warnings.findIndex(warning => warning.id === id);
  if (index !== -1) {
    warnings[index].acknowledgement = {
      acknowledged: true,
      date: new Date().toISOString().split('T')[0],
      comments: comments || 'Acknowledged'
    };
    return warnings[index];
  }
  return null;
};