import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiPlusCircle, FiMinusCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { PerformanceReview, ReviewCategory, Employee } from '../../types';

interface PerformanceReviewFormProps {
  employees: Employee[];
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  initialData?: Partial<PerformanceReview>;
}

const PerformanceReviewForm: React.FC<PerformanceReviewFormProps> = ({
  employees,
  onSubmit,
  onCancel,
  initialData
}) => {
  const { user } = useAuth();
  const { error } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>('');

  const [formData, setFormData] = useState<Partial<PerformanceReview>>({
    employeeId: initialData?.employeeId || '',
    employeeName: initialData?.employeeName || '',
    reviewerId: user?.id || '',
    reviewerName: user?.name || '',
    reviewPeriod: initialData?.reviewPeriod || 'Q1 2024',
    reviewDate: initialData?.reviewDate || new Date().toISOString().split('T')[0],
    status: initialData?.status || 'pending_employee',
    categories: initialData?.categories || [
      {
        name: 'Job Knowledge',
        rating: 3,
        comments: ''
      },
      {
        name: 'Quality of Work',
        rating: 3,
        comments: ''
      },
      {
        name: 'Communication',
        rating: 3,
        comments: ''
      }
    ],
    overallRating: initialData?.overallRating || 3,
    strengths: initialData?.strengths || '',
    areasForImprovement: initialData?.areasForImprovement || '',
    goals: initialData?.goals || [''],
    employeeComments: initialData?.employeeComments || null,
    employeeAcknowledgement: initialData?.employeeAcknowledgement || {
      acknowledged: false,
      date: null
    },
    attachments: initialData?.attachments || []
  });

  // Get employee name when employee ID changes
  useEffect(() => {
    if (formData.employeeId) {
      const employee = employees.find(emp => emp.id === formData.employeeId);
      if (employee) {
        setSelectedEmployeeName(employee.name);
        setFormData(prev => ({
          ...prev,
          employeeName: employee.name
        }));
      }
    }
  }, [formData.employeeId, employees]);

  // Calculate average rating whenever categories change
  useEffect(() => {
    if (formData.categories && formData.categories.length > 0) {
      const sum = formData.categories.reduce((total, category) => total + category.rating, 0);
      const avg = parseFloat((sum / formData.categories.length).toFixed(1));
      
      setFormData(prev => ({
        ...prev,
        overallRating: avg
      }));
    }
  }, [formData.categories]);

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

  // Handle category changes
  const handleCategoryChange = (index: number, field: string, value: string | number) => {
    if (!formData.categories) return;
    
    const updatedCategories = [...formData.categories];
    updatedCategories[index] = {
      ...updatedCategories[index],
      [field]: field === 'rating' ? parseInt(value as string) : value
    };
    
    setFormData(prev => ({
      ...prev,
      categories: updatedCategories
    }));
  };

  // Add new category
  const handleAddCategory = () => {
    if (!formData.categories) return;
    
    setFormData(prev => ({
      ...prev,
      categories: [
        ...prev.categories!,
        {
          name: '',
          rating: 3,
          comments: ''
        }
      ]
    }));
  };

  // Remove a category
  const handleRemoveCategory = (index: number) => {
    if (!formData.categories || formData.categories.length <= 1) return;
    
    const updatedCategories = formData.categories.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      categories: updatedCategories
    }));
  };

  // Handle goal changes
  const handleGoalChange = (index: number, value: string) => {
    if (!formData.goals) return;
    
    const updatedGoals = [...formData.goals];
    updatedGoals[index] = value;
    
    setFormData(prev => ({
      ...prev,
      goals: updatedGoals
    }));
  };

  // Add new goal
  const handleAddGoal = () => {
    if (!formData.goals) return;
    
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals!, '']
    }));
  };

  // Remove a goal
  const handleRemoveGoal = (index: number) => {
    if (!formData.goals || formData.goals.length <= 1) return;
    
    const updatedGoals = formData.goals.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      goals: updatedGoals
    }));
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

      if (!formData.reviewPeriod) {
        throw new Error('Please enter a review period');
      }

      if (!formData.categories || formData.categories.some(cat => !cat.name)) {
        throw new Error('Please fill in all category names');
      }

      if (!formData.strengths) {
        throw new Error('Please enter employee strengths');
      }

      if (!formData.areasForImprovement) {
        throw new Error('Please enter areas for improvement');
      }

      if (!formData.goals || !formData.goals.length || formData.goals.some(goal => !goal)) {
        throw new Error('Please fill in all goals');
      }

      // Submit form data
      onSubmit(formData);
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
        {initialData ? 'Edit Performance Review' : 'Create New Performance Review'}
      </h2>

      <div className="space-y-6">
        {/* Review Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
              Employee <span className="text-red-500">*</span>
            </label>
            <select
              id="employeeId"
              name="employeeId"
              value={formData.employeeId || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
              disabled={!!initialData}
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
            <label htmlFor="reviewPeriod" className="block text-sm font-medium text-gray-700 mb-1">
              Review Period <span className="text-red-500">*</span>
            </label>
            <select
              id="reviewPeriod"
              name="reviewPeriod"
              value={formData.reviewPeriod || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="Q1 2024">Q1 2024</option>
              <option value="Q2 2024">Q2 2024</option>
              <option value="Q3 2024">Q3 2024</option>
              <option value="Q4 2024">Q4 2024</option>
              <option value="Annual 2024">Annual 2024</option>
            </select>
          </div>

          <div>
            <label htmlFor="reviewDate" className="block text-sm font-medium text-gray-700 mb-1">
              Review Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="reviewDate"
              name="reviewDate"
              value={formData.reviewDate || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="overallRating" className="block text-sm font-medium text-gray-700 mb-1">
              Overall Rating (Calculated)
            </label>
            <input
              type="text"
              id="overallRating"
              name="overallRating"
              value={formData.overallRating || 0}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 shadow-sm focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              This is calculated automatically based on category ratings
            </p>
          </div>
        </div>

        {/* Performance Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-800">Performance Categories</h3>
            <button
              type="button"
              onClick={handleAddCategory}
              className="text-primary-600 hover:text-primary-900 flex items-center text-sm"
            >
              <FiPlusCircle className="mr-1" /> Add Category
            </button>
          </div>

          {formData.categories?.map((category, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor={`category-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={`category-name-${index}`}
                        value={category.name}
                        onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`category-rating-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Rating (1-5) <span className="text-red-500">*</span>
                      </label>
                      <select
                        id={`category-rating-${index}`}
                        value={category.rating}
                        onChange={(e) => handleCategoryChange(index, 'rating', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value={1}>1 - Needs Improvement</option>
                        <option value={2}>2 - Fair</option>
                        <option value={3}>3 - Meets Expectations</option>
                        <option value={4}>4 - Exceeds Expectations</option>
                        <option value={5}>5 - Outstanding</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex justify-between">
                        <label htmlFor={`category-comments-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Comments
                        </label>
                        {formData.categories!.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(index)}
                            className="text-red-600 hover:text-red-900 text-sm flex items-center"
                          >
                            <FiMinusCircle className="mr-1" /> Remove
                          </button>
                        )}
                      </div>
                      <textarea
                        id={`category-comments-${index}`}
                        value={category.comments}
                        onChange={(e) => handleCategoryChange(index, 'comments', e.target.value)}
                        rows={2}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Strengths and Areas for Improvement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="strengths" className="block text-sm font-medium text-gray-700 mb-1">
              Strengths <span className="text-red-500">*</span>
            </label>
            <textarea
              id="strengths"
              name="strengths"
              value={formData.strengths || ''}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
              placeholder="Describe the employee's key strengths..."
            />
          </div>
          <div>
            <label htmlFor="areasForImprovement" className="block text-sm font-medium text-gray-700 mb-1">
              Areas for Improvement <span className="text-red-500">*</span>
            </label>
            <textarea
              id="areasForImprovement"
              name="areasForImprovement"
              value={formData.areasForImprovement || ''}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
              placeholder="Describe areas where the employee can improve..."
            />
          </div>
        </div>

        {/* Goals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-800">Performance Goals</h3>
            <button
              type="button"
              onClick={handleAddGoal}
              className="text-primary-600 hover:text-primary-900 flex items-center text-sm"
            >
              <FiPlusCircle className="mr-1" /> Add Goal
            </button>
          </div>

          {formData.goals?.map((goal, index) => (
            <div key={index} className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={goal}
                onChange={(e) => handleGoalChange(index, e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={`Goal ${index + 1}`}
                required
              />
              {formData.goals!.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveGoal(index)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FiMinusCircle className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
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
          {isSubmitting ? 'Saving...' : initialData ? 'Update Review' : 'Save Review'}
        </button>
      </div>
    </form>
  );
};

export default PerformanceReviewForm;