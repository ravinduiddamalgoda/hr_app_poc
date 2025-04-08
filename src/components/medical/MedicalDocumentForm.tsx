import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiPaperclip } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { LeaveRequest } from '../../types';

interface MedicalDocumentFormProps {
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  leaveRequests?: LeaveRequest[];
  initialData?: {
    title?: string;
    description?: string;
    leaveRequestId?: string | null;
  };
}

const MedicalDocumentForm: React.FC<MedicalDocumentFormProps> = ({
  onSubmit,
  onCancel,
  leaveRequests = [],
  initialData
}) => {
  const { user } = useAuth();
  const { error } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    leaveRequestId: initialData?.leaveRequestId || ''
  });

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.title) {
        throw new Error('Please enter a title for the document');
      }

      if (!selectedFile && !initialData) {
        throw new Error('Please select a file to upload');
      }

      // Create FormData object to handle file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      
      if (formData.leaveRequestId) {
        submitData.append('leaveRequestId', formData.leaveRequestId);
      }
      
      if (user) {
        submitData.append('employeeId', user.id);
        submitData.append('employeeName', user.name);
      }
      
      if (selectedFile) {
        submitData.append('file', selectedFile);
      }

      // Submit the form data
      onSubmit(submitData);
    } catch (err) {
      if (err instanceof Error) {
        error(err.message);
      } else {
        error('An error occurred when submitting the form');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {initialData ? 'Update Medical Document' : 'Upload Medical Document'}
      </h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Document Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {leaveRequests.length > 0 && (
          <div>
            <label htmlFor="leaveRequestId" className="block text-sm font-medium text-gray-700 mb-1">
              Related Leave Request
            </label>
            <select
              id="leaveRequestId"
              name="leaveRequestId"
              value={formData.leaveRequestId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">None</option>
              {leaveRequests.map(request => (
                <option key={request.id} value={request.id}>
                  {request.type} ({new Date(request.startDate).toLocaleDateString()} to {new Date(request.endDate).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            Document File {!initialData && <span className="text-red-500">*</span>}
          </label>
          <div className="mt-1 flex items-center">
            <label className="relative cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <span className="flex items-center">
                <FiPaperclip className="mr-2" />
                {selectedFile ? selectedFile.name : 'Choose file'}
              </span>
              <input
                id="file"
                name="file"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                required={!initialData}
              />
            </label>
            {selectedFile && (
              <span className="ml-3 text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Accepted file types: PDF, JPEG, PNG. Maximum file size: 10MB.
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-8 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FiX className="inline-block mr-2" />
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FiSave className="inline-block mr-2" />
          {isSubmitting ? 'Saving...' : initialData ? 'Update Document' : 'Upload Document'}
        </button>
      </div>
    </form>
  );
};

export default MedicalDocumentForm;