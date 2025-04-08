import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiPaperclip } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Employee } from '../../types';

interface WarningFormProps {
  employees: Employee[];
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  initialData?: {
    employeeId?: string;
    type?: string;
    title?: string;
    description?: string;
    severity?: 'minor' | 'moderate' | 'serious';
  };
}

const WarningForm: React.FC<WarningFormProps> = ({
  employees,
  onSubmit,
  onCancel,
  initialData
}) => {
  const { user } = useAuth();
  const { error } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    employeeId: initialData?.employeeId || '',
    type: initialData?.type || 'Attendance',
    title: initialData?.title || '',
    description: initialData?.description || '',
    severity: initialData?.severity || 'minor'
  });

  // Get employee name when employee ID changes
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>('');
  
  useEffect(() => {
    if (formData.employeeId) {
      const employee = employees.find(emp => emp.id === formData.employeeId);
      if (employee) {
        setSelectedEmployeeName(employee.name);
      }
    }
  }, [formData.employeeId, employees]);

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
      if (!formData.employeeId) {
        throw new Error('Please select an employee');
      }

      if (!formData.title) {
        throw new Error('Please enter a title for the warning');
      }

      if (!formData.description) {
        throw new Error('Please enter a description');
      }

      // Create submission data
      const warningData = {
        ...formData,
        employeeName: selectedEmployeeName,
        issuedBy: user?.name || 'HR Manager',
        issueDate: new Date().toISOString().split('T')[0],
        selectedFile: selectedFile
      };

      // Submit the form data
      onSubmit(warningData);
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
        {initialData ? 'Edit Warning' : 'Issue New Warning'}
      </h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
            Employee <span className="text-red-500">*</span>
          </label>
          <select
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="">Select Employee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name} - {employee.position}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Warning Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="Attendance">Attendance</option>
            <option value="Performance">Performance</option>
            <option value="Conduct">Conduct</option>
            <option value="Policy Violation">Policy Violation</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
            Severity <span className="text-red-500">*</span>
          </label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="serious">Serious</option>
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Warning Title <span className="text-red-500">*</span>
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
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
            placeholder="Provide a detailed description of the incident or behavior that led to this warning..."
          />
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            Supporting Document (Optional)
          </label>
          <div className="mt-1 flex items-center">
            <label className="relative cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <span className="flex items-center">
                <FiPaperclip className="mr-2" />
                {selectedFile ? selectedFile.name : 'Attach document'}
              </span>
              <input
                id="file"
                name="file"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
            {selectedFile && (
              <span className="ml-3 text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Attach any relevant documents such as attendance records, email transcripts, etc.
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
          {isSubmitting ? 'Saving...' : initialData ? 'Update Warning' : 'Issue Warning'}
        </button>
      </div>
    </form>
  );
};

export default WarningForm;