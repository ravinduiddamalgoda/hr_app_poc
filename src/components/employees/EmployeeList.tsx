import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiFilter, FiEdit, FiEye, FiTrash2, FiUserPlus } from 'react-icons/fi';
import { useNotification } from '../../context/NotificationContext';
import { employees } from '../../lib/mockData/employees';
import { Employee } from '../../types';

interface EmployeeListProps {
  onViewEmployee?: (id: string) => void;
  onEditEmployee?: (id: string) => void;
  onDeleteEmployee?: (id: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee
}) => {
  const { success, error } = useNotification();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  
  // Extract unique departments from employees data
  useEffect(() => {
    const uniqueDepartments = [...new Set(employees.map(employee => employee.department))];
    setDepartments(uniqueDepartments);
    setFilteredEmployees(employees);
  }, []);

  // Handle search and filter
  useEffect(() => {
    const results = employees.filter(employee => {
      const matchesSearch = searchTerm === '' || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = filterDepartment === '' || 
        employee.department === filterDepartment;
      
      return matchesSearch && matchesDepartment;
    });
    
    setFilteredEmployees(results);
  }, [searchTerm, filterDepartment]);

  // Handle view employee details
  const handleViewEmployee = (id: string) => {
    if (onViewEmployee) {
      onViewEmployee(id);
    }
  };

  // Handle edit employee
  const handleEditEmployee = (id: string) => {
    if (onEditEmployee) {
      onEditEmployee(id);
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = (id: string) => {
    // In a real app, this would send a request to the backend
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        // Mock successful deletion
        setFilteredEmployees(filteredEmployees.filter(employee => employee.id !== id));
        success('Employee deleted successfully');
        
        if (onDeleteEmployee) {
          onDeleteEmployee(id);
        }
      } catch (err) {
        error('Failed to delete employee. Please try again.');
        console.error('Error deleting employee:', err);
      }
    }
  };
  
  return (
    <div>
      {/* Header with action buttons */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Manage Employees</h2>
        
        <div className="mt-4 sm:mt-0">
          <Link href="/employees/add" className="px-4 py-2 bg-primary-600 text-white rounded font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center inline-flex">
            <FiUserPlus className="mr-2" />
            Add New Employee
          </Link>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Employees Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Employee
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Position
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Join Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-800 font-medium">
                          {employee.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(employee.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleViewEmployee(employee.id)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleEditEmployee(employee.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination (static for demo) */}
      {filteredEmployees.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="px-4 py-2 bg-secondary-100 text-secondary-800 rounded font-medium hover:bg-secondary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
              Previous
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-800 rounded font-medium hover:bg-secondary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEmployees.length}</span> of{' '}
                <span className="font-medium">{filteredEmployees.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;