import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import { useNotification } from '../../context/NotificationContext';
import { Employee, EmployeeFormProps } from '../../types';

const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData 
}) => {
  const { error } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    email: '',
    department: '',
    position: '',
    employeeId: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active',
    manager: '',
    contactInfo: {
      phone: '',
      address: '',
      emergencyContact: ''
    },
    salary: {
      amount: 0,
      currency: 'USD',
      lastReview: new Date().toISOString().split('T')[0]
    },
    documents: []
  });

  // If initialData is provided, use it to populate the form
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData
      });
    }
  }, [initialData]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects like contactInfo and salary
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.department || !formData.position) {
        throw new Error('Please fill in all required fields');
      }

      // Submit form data
      await onSubmit(formData as Employee);
      
    } catch (err) {
      if (err instanceof Error) {
        error(err.message);
      } else {
        error('An error occurred while saving the employee data');
      }
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {initialData ? 'Edit Employee' : 'Add New Employee'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-700 border-b pb-2">Basic Information</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 mb-1">
              Join Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="joinDate"
              name="joinDate"
              value={formData.joinDate || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status || 'active'}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Employment Information */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-700 border-b pb-2">Employment Information</h3>
          
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              id="department"
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Sales">Sales</option>
              <option value="Human Resources">Human Resources</option>
              <option value="IT">IT</option>
              <option value="Customer Support">Customer Support</option>
            </select>
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">
              Manager
            </label>
            <input
              type="text"
              id="manager"
              name="manager"
              value={formData.manager || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="salary.amount" className="block text-sm font-medium text-gray-700 mb-1">
              Salary Amount
            </label>
            <input
              type="number"
              id="salary.amount"
              name="salary.amount"
              value={formData.salary?.amount || 0}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="salary.currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              id="salary.currency"
              name="salary.currency"
              value={formData.salary?.currency || 'USD'}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-8 space-y-4">
        <h3 className="text-md font-medium text-gray-700 border-b pb-2">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="contactInfo.phone"
              name="contactInfo.phone"
              value={formData.contactInfo?.phone || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="contactInfo.emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact
            </label>
            <input
              type="text"
              id="contactInfo.emergencyContact"
              name="contactInfo.emergencyContact"
              value={formData.contactInfo?.emergencyContact || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Name, Relationship, Phone Number"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contactInfo.address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            id="contactInfo.address"
            name="contactInfo.address"
            rows={3}
            value={formData.contactInfo?.address || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
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
          {isSubmitting ? 'Saving...' : 'Save Employee'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;