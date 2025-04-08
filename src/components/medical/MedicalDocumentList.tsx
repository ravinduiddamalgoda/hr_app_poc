import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEye, FiCheck, FiX, FiPaperclip, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { MedicalDocument } from '../../types';
import { isHRorAdmin } from '../../lib/auth';

interface MedicalDocumentListProps {
  documents: MedicalDocument[];
  onView?: (id: string) => void;
  onVerify?: (id: string) => void;
  onReject?: (id: string) => void;
  onAddNew?: () => void;
}

const MedicalDocumentList: React.FC<MedicalDocumentListProps> = ({
  documents,
  onView,
  onVerify,
  onReject,
  onAddNew
}) => {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [filteredDocuments, setFilteredDocuments] = useState<MedicalDocument[]>([]);
  const [isUserHRorAdmin, setIsUserHRorAdmin] = useState<boolean>(false);

  // Check if user is HR or admin
  useEffect(() => {
    if (user) {
      setIsUserHRorAdmin(isHRorAdmin(user));
    }
  }, [user]);

  // Filter documents based on search term and status filter
  useEffect(() => {
    let filtered = [...documents];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }
    
    setFilteredDocuments(filtered);
  }, [documents, searchTerm, statusFilter]);

  // Handle document view
  const handleView = (id: string) => {
    if (onView) {
      onView(id);
    }
  };

  // Handle document verification
  const handleVerify = (id: string) => {
    try {
      if (onVerify) {
        onVerify(id);
      }
      success('Document verified successfully');
    } catch (err) {
      error('Failed to verify document');
      console.error('Error verifying document:', err);
    }
  };

  // Handle document rejection
  const handleReject = (id: string) => {
    try {
      if (onReject) {
        onReject(id);
      }
      success('Document rejected successfully');
    } catch (err) {
      error('Failed to reject document');
      console.error('Error rejecting document:', err);
    }
  };

  return (
    <div>
      {/* Header with action buttons */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Medical Documents</h2>
        
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={onAddNew}
            className="px-4 py-2 bg-primary-600 text-white rounded font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
          >
            <FiPlus className="mr-2" />
            Upload New Document
          </button>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search documents..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      {/* Medical Documents Table */}
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
                  Document
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Upload Date
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
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50">
                  {isUserHRorAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-800 font-medium">
                            {document.employeeName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{document.employeeName}</div>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiPaperclip className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{document.title}</div>
                        <div className="text-sm text-gray-500">{document.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(document.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${document.status === 'verified' ? 'bg-green-100 text-green-800' : 
                      document.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                      {document.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(document.id)}
                        className="text-primary-600 hover:text-primary-900"
                        title="View"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      
                      {/* Verify/Reject buttons (only for HR/admin and pending documents) */}
                      {isUserHRorAdmin && document.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVerify(document.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Verify"
                          >
                            <FiCheck className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleReject(document.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredDocuments.length === 0 && (
                <tr>
                  <td colSpan={isUserHRorAdmin ? 5 : 4} className="px-6 py-4 text-center text-gray-500">
                    No medical documents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination (static for demo) */}
      {filteredDocuments.length > 0 && (
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredDocuments.length}</span> of{' '}
                <span className="font-medium">{filteredDocuments.length}</span> results
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

export default MedicalDocumentList;