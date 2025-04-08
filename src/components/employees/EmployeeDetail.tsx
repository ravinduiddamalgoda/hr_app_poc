import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiFileText, FiDollarSign, FiEdit, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { Employee } from '../../types';

interface EmployeeDetailProps {
  employee: Employee;
  onEdit?: (id: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ 
  employee, 
  onEdit, 
  onBack, 
  showBackButton = true 
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'documents'>('profile');

  const handleEdit = () => {
    if (onEdit) {
      onEdit(employee.id);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div>
      {/* Back Button and Actions */}
      {showBackButton && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <button onClick={handleBack} className="text-primary-600 hover:text-primary-900 flex items-center">
              <FiArrowLeft className="mr-2" />
              Back to Employees
            </button>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={handleEdit}
              className="px-4 py-2 bg-primary-600 text-white rounded font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
            >
              <FiEdit className="mr-2" />
              Edit Employee
            </button>
          </div>
        </div>
      )}
      
      {/* Employee Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-800 font-bold text-2xl">
              {employee.name.charAt(0)}
            </span>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6">
            <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
            <div className="flex flex-col md:flex-row md:items-center mt-1 text-gray-600">
              <span className="mr-4">{employee.position}</span>
              <span className="mr-4">•</span>
              <span className="mr-4">{employee.department}</span>
              <span className="mr-4">•</span>
              <span>Employee ID: {employee.employeeId}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiUser className="inline-block mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiFileText className="inline-block mr-2" />
              Documents ({employee.documents.length})
            </button>
          </nav>
        </div>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'profile' ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FiUser className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-base">{employee.name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-base">{employee.contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-base">{employee.contactInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FiDollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Position</p>
                    <p className="text-base">{employee.position}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiDollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Department</p>
                    <p className="text-base">{employee.department}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Join Date</p>
                    <p className="text-base">{new Date(employee.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiDollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Salary</p>
                    <p className="text-base">{employee.salary.amount.toLocaleString()} {employee.salary.currency}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
            <p className="text-base">{employee.contactInfo.emergencyContact}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Documents</h3>
          
          {employee.documents.length === 0 ? (
            <p className="text-gray-500">No documents found for this employee.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employee.documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{doc.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          doc.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6">
            <button className="px-4 py-2 bg-primary-600 text-white rounded font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Upload New Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;