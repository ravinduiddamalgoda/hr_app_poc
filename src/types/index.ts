// User types
export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: 'admin' | 'hr' | 'employee';
    department: string;
    avatar?: string;
    permissions: string[];
    position?: string;
    manager?: string;
  }
  
  // Employee types
  export interface ContactInfo {
    phone: string;
    address: string;
    emergencyContact: string;
  }
  
  export interface SalaryInfo {
    amount: number;
    currency: string;
    lastReview: string;
  }
  
  export interface Document {
    id: string;
    type: string;
    status: 'verified' | 'pending';
    uploadDate: string;
  }
  
  export interface Employee {
    id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    employeeId: string;
    joinDate: string;
    status: 'active' | 'inactive';
    manager: string;
    contactInfo: ContactInfo;
    salary: SalaryInfo;
    documents: Document[];
  }
  
  // Leave Request types
  export interface Comment {
    id: string;
    userId: string;
    userName: string;
    text: string;
    date: string;
  }
  
  export interface MedicalDocumentRef {
    id: string;
    fileName: string;
    uploadDate: string;
    status: 'verified' | 'pending' | 'rejected';
  }
  
  export interface LeaveRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    type: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    appliedDate: string;
    approvedBy: string | null;
    approvedDate: string | null;
    comments: Comment[];
    medicalDocuments?: MedicalDocumentRef[];
  }
  
  // Medical Document types
  export interface MedicalDocument {
    id: string;
    employeeId: string;
    employeeName: string;
    title: string;
    description: string;
    filename: string;
    uploadDate: string;
    leaveRequestId: string | null;
    status: string;
    verifiedBy: string | null;
    verificationDate: string | null;
    comments: Comment[];
  }
  
  // Warning types
  export interface Acknowledgement {
    acknowledged: boolean;
    date: string | null;
    comments: string | null;
  }
  
  export interface Attachment {
    id: string;
    filename: string;
    uploadDate: string;
  }
  
  export interface Warning {
    id: string;
    employeeId: string;
    employeeName: string;
    type: string;
    title: string;
    description: string;
    issueDate: string;
    issuedBy: string;
    severity: 'minor' | 'moderate' | 'serious';
    status: 'active' | 'pending' | 'resolved';
    acknowledgement: Acknowledgement;
    followUpDate: string | null;
    followUpComments: string | null;
    attachments: Attachment[];
  }
  
  // Performance Review types
  export interface ReviewCategory {
    name: string;
    rating: number;
    comments: string;
  }
  
  export interface PerformanceReview {
    id: string;
    employeeId: string;
    employeeName: string;
    reviewerId: string;
    reviewerName: string;
    reviewPeriod: string;
    reviewDate: string;
    status: 'pending_employee' | 'completed';
    categories: ReviewCategory[];
    overallRating: number;
    strengths: string;
    areasForImprovement: string;
    goals: string[];
    employeeComments: string | null;
    employeeAcknowledgement: {
      acknowledged: boolean;
      date: string | null;
    };
    attachments: Attachment[];
  }
  
  // Context types
  export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
  }
  
  export interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    timestamp: Date;
  }
  
  export interface NotificationContextType {
    notifications: Notification[];
    addNotification: (type: Notification['type'], message: string) => string;
    removeNotification: (id: string) => void;
    success: (message: string) => string;
    error: (message: string) => string;
    info: (message: string) => string;
    warning: (message: string) => string;
  }
  
  // Component props types
  export interface DashboardCardProps {
    title: string;
    count: number;
    icon: React.ReactNode;
    color: string;
    link: string;
  }
  
  export interface ActivityItemProps {
    id:string;
    date: string;
    title: string;
    description: string;
    type: 'leave' | 'medical' | 'warning' | 'performance';
  }
  
  export interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
  }
  
  export interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: User['role'] | null;
    requiredPermissions?: string[];
  }
  
  export interface NotificationProps {
    id: string;
    type: Notification['type'];
    message: string;
    onClose: (id: string) => void;
  }
  
  export interface LeaveRequestFormProps {
    onSubmit: (data: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate' | 'approvedBy' | 'approvedDate' | 'comments'>) => void;
    onCancel: () => void;
    initialData?: Partial<LeaveRequest>;
  }
  
  export interface EmployeeFormProps {
    onSubmit: (data: Omit<Employee, 'id'>) => void;
    onCancel: () => void;
    initialData?: Partial<Employee>;
  }