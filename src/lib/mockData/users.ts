import { User } from '../../types';

// Mock user data with different access levels
export const users: User[] = [
  // Admin user
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@company.com',
    password: 'admin123', // In a real app, this would be hashed
    role: 'admin',
    department: 'IT',
    avatar: '/avatars/admin.png',
    permissions: ['all'], // Admin has all permissions
  },
  
  // HR Team users
  {
    id: '2',
    name: 'HR Manager',
    email: 'hr@company.com',
    password: 'hr123',
    role: 'hr',
    department: 'Human Resources',
    avatar: '/avatars/hr.png',
    permissions: [
      'view_employees', 
      'edit_employees', 
      'approve_leave', 
      'manage_performance',
      'manage_warnings'
    ],
  },
  
  // Regular employees
  {
    id: '3',
    name: 'John Smith',
    email: 'john@company.com',
    password: 'john123',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Developer',
    avatar: '/avatars/john.png',
    manager: 'Jane Doe',
    permissions: ['view_self', 'request_leave'],
  },
  {
    id: '4',
    name: 'Jane Doe',
    email: 'jane@company.com',
    password: 'jane123',
    role: 'employee',
    department: 'Marketing',
    position: 'Marketing Specialist',
    avatar: '/avatars/jane.png',
    manager: 'HR Manager',
    permissions: ['view_self', 'request_leave'],
  },
  {
    id: '5',
    name: 'Bob Johnson',
    email: 'bob@company.com',
    password: 'bob123',
    role: 'employee',
    department: 'Finance',
    position: 'Financial Analyst',
    avatar: '/avatars/bob.png',
    manager: 'HR Manager',
    permissions: ['view_self', 'request_leave'],
  },
];

// Exported function to get a user by id
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Get users by role
export const getUsersByRole = (role: User['role']): User[] => {
  return users.filter(user => user.role === role);
};