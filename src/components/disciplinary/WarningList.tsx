import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEye, FiPlus, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Warning } from '../../types';
import { isHRorAdmin } from '../../lib/auth';

interface WarningListProps {
  warnings: Warning[];
  onView?: (id: string) => void;
  onAcknowledge?: (id: string, comments: string) => void;
  onAddNew?: () => void;
}

const WarningList: React.FC<WarningListProps> = ({
  warnings,
  onView,
  onAcknowledge,
  onAddNew
}) => {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [filteredWarnings, setFilteredWarnings] = useState<Warning[]>([]);
  const [isUserHRorAdmin, setIsUserHRorAdmin] = useState<boolean>(false);

  // Check if user is HR or admin
  useEffect(() => {
    if (user) {
      setIsUserHRorAdmin(isHRorAdmin(user));
    }
  }, [user]);

  // Filter warnings based on search term, type and status filter
  useEffect(() => {
    let filtered = [...warnings];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(warning => 
        warning.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warning.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warning.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(warning => warning.type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      if (statusFilter === 'acknowledged') {
        filtered = filtered.filter(warning => warning.acknowledgement.acknowledged);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(warning => !warning.acknowledgement.acknowledged);
      }
    }
    
    setFilteredWarnings(filtered);
  }, [warnings, searchTerm, typeFilter, statusFilter]);

  // Get unique warning types for filter dropdown
  const warningTypes = [...new Set(warnings.map(warning => warning.type))];

  // Handle view warning
  const handleView = (id: string) => {
    if (onView) {
      onView(id);
    }
  };

  // Severity badge style
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'minor':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderate':
        return 'bg-orange-100 text-orange-800';
      case 'serious':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Header with action buttons */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Warnings & Disciplinary Actions</h2>
        
        {isUserHRorAdmin && (
          <div className="mt-4 sm:mt-0">
            <button 
              onClick={onAddNew}
              className="px-4 py-2 bg-primary-600 text-white rounded font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
            >
              <FiPlus className="mr-2" />
              Issue New Warning
            </button>
          </div>
        )}
      </div>
      
      {/* Filters and search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search warnings..."
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {warningTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="pending">Pending Acknowledgement</option>
          </select>
        </div>
      </div>
      
      {/* Warnings Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isUserHRorAdmin && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Employee
                  </th>
                )}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Warning
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Severity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Issue Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
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
              {filteredWarnings.map((warning) => (
                <tr key={warning.id} className="hover:bg-gray-50">
                  {isUserHRorAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-800 font-medium">
                            {warning.employeeName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{warning.employeeName}</div>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiAlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{warning.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{warning.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityStyle(warning.severity)}`}>
                      {warning.severity.charAt(0).toUpperCase() + warning.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(warning.issueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${warning.acknowledgement.acknowledged ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {warning.acknowledgement.acknowledged ? 'Acknowledged' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(warning.id)}
                        className="text-primary-600 hover:text-primary-900"
                        title="View"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      
                      {/* Acknowledge button (only for the employee who received the warning) */}
                      {!warning.acknowledgement.acknowledged && 
                       user?.id === warning.employeeId && (
                        <button
                          onClick={() => onAcknowledge && onAcknowledge(warning.id, '')}
                          className="text-green-600 hover:text-green-900"
                          title="Acknowledge"
                        >
                          <FiCheck className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredWarnings.length === 0 && (
                <tr>
                  <td colSpan={isUserHRorAdmin ? 7 : 6} className="px-6 py-4 text-center text-gray-500">
                    No warnings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination (static for demo) */}
      {filteredWarnings.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredWarnings.length}</span> of{' '}
                <span className="font-medium">{filteredWarnings.length}</span> results
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

export default WarningList;