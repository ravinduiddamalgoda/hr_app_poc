import { Employee } from '../../types'; // Adjust the import path as necessary



// Mock employee data with more detailed information than the users file
export const employees: Employee[] = [
  {
    id: '3', // Matches user id for John Smith
    name: 'John Smith',
    email: 'john@company.com',
    department: 'Engineering',
    position: 'Software Developer',
    employeeId: 'EMP001',
    joinDate: '2022-01-15',
    status: 'active',
    manager: 'Jane Doe',
    contactInfo: {
      phone: '555-123-4567',
      address: '123 Tech Street, San Francisco, CA',
      emergencyContact: 'Mary Smith, 555-987-6543'
    },
    salary: {
      amount: 85000,
      currency: 'USD',
      lastReview: '2023-01-15'
    },
    documents: [
      { id: 'd1', type: 'ID', status: 'verified', uploadDate: '2022-01-10' },
      { id: 'd2', type: 'Resume', status: 'verified', uploadDate: '2022-01-10' },
      { id: 'd3', type: 'Contract', status: 'verified', uploadDate: '2022-01-14' }
    ]
  },
  {
    id: '4', // Matches user id for Jane Doe
    name: 'Jane Doe',
    email: 'jane@company.com',
    department: 'Marketing',
    position: 'Marketing Specialist',
    employeeId: 'EMP002',
    joinDate: '2021-09-05',
    status: 'active',
    manager: 'HR Manager',
    contactInfo: {
      phone: '555-234-5678',
      address: '456 Market Street, San Francisco, CA',
      emergencyContact: 'John Doe, 555-876-5432'
    },
    salary: {
      amount: 75000,
      currency: 'USD',
      lastReview: '2022-09-05'
    },
    documents: [
      { id: 'd4', type: 'ID', status: 'verified', uploadDate: '2021-09-01' },
      { id: 'd5', type: 'Resume', status: 'verified', uploadDate: '2021-09-01' },
      { id: 'd6', type: 'Contract', status: 'verified', uploadDate: '2021-09-04' }
    ]
  },
  {
    id: '5', // Matches user id for Bob Johnson
    name: 'Bob Johnson',
    email: 'bob@company.com',
    department: 'Finance',
    position: 'Financial Analyst',
    employeeId: 'EMP003',
    joinDate: '2022-03-20',
    status: 'active',
    manager: 'HR Manager',
    contactInfo: {
      phone: '555-345-6789',
      address: '789 Finance Ave, San Francisco, CA',
      emergencyContact: 'Sarah Johnson, 555-765-4321'
    },
    salary: {
      amount: 80000,
      currency: 'USD',
      lastReview: '2023-03-20'
    },
    documents: [
      { id: 'd7', type: 'ID', status: 'verified', uploadDate: '2022-03-15' },
      { id: 'd8', type: 'Resume', status: 'verified', uploadDate: '2022-03-15' },
      { id: 'd9', type: 'Contract', status: 'verified', uploadDate: '2022-03-19' }
    ]
  },
  {
    id: '6',
    name: 'Sarah Williams',
    email: 'sarah@company.com',
    department: 'Engineering',
    position: 'QA Engineer',
    employeeId: 'EMP004',
    joinDate: '2022-06-10',
    status: 'active',
    manager: 'John Smith',
    contactInfo: {
      phone: '555-456-7890',
      address: '101 Test Drive, San Francisco, CA',
      emergencyContact: 'Mike Williams, 555-654-3210'
    },
    salary: {
      amount: 72000,
      currency: 'USD',
      lastReview: '2023-06-10'
    },
    documents: [
      { id: 'd10', type: 'ID', status: 'verified', uploadDate: '2022-06-05' },
      { id: 'd11', type: 'Resume', status: 'verified', uploadDate: '2022-06-05' },
      { id: 'd12', type: 'Contract', status: 'verified', uploadDate: '2022-06-09' }
    ]
  },
  {
    id: '7',
    name: 'Mike Peters',
    email: 'mike@company.com',
    department: 'Sales',
    position: 'Sales Representative',
    employeeId: 'EMP005',
    joinDate: '2021-11-15',
    status: 'active',
    manager: 'HR Manager',
    contactInfo: {
      phone: '555-567-8901',
      address: '202 Sales Court, San Francisco, CA',
      emergencyContact: 'Lisa Peters, 555-543-2109'
    },
    salary: {
      amount: 65000,
      currency: 'USD',
      lastReview: '2022-11-15'
    },
    documents: [
      { id: 'd13', type: 'ID', status: 'verified', uploadDate: '2021-11-10' },
      { id: 'd14', type: 'Resume', status: 'verified', uploadDate: '2021-11-10' },
      { id: 'd15', type: 'Contract', status: 'verified', uploadDate: '2021-11-14' }
    ]
  }
];

// Helper functions
export const getEmployeeById = (id: string): Employee | undefined => {
  return employees.find(employee => employee.id === id);
};

export const getEmployeesByDepartment = (department: string): Employee[] => {
  return employees.filter(employee => employee.department === department);
};

export const getActiveEmployees = (): Employee[] => {
  return employees.filter(employee => employee.status === 'active');
};