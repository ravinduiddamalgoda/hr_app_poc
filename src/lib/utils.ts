/**
 * Format date string to locale date string
 * @param {string} dateString - The date string to format
 * @returns {string} - The formatted date string
 */
export const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };
  
  /**
   * Format date range string to locale date range string
   * @param {string} startDate - The start date string
   * @param {string} endDate - The end date string
   * @returns {string} - The formatted date range string
   */
  export const formatDateRange = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.getTime() === end.getTime()) {
      return start.toLocaleDateString();
    }
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };
  
  /**
   * Calculate the number of days between two dates
   * @param {string} startDate - The start date string
   * @param {string} endDate - The end date string
   * @returns {number} - The number of days between the two dates
   */
  export const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Add 1 to include both start and end dates
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };
  
  /**
   * Format currency value
   * @param {number} amount - The amount to format
   * @param {string} currency - The currency code
   * @returns {string} - The formatted currency string
   */
  export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };
  
  /**
   * Calculate the average of an array of numbers
   * @param {number[]} numbers - The array of numbers
   * @returns {number} - The average value
   */
  export const calculateAverage = (numbers: number[]): number => {
    if (!numbers.length) return 0;
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  };
  
  /**
   * Capitalize the first letter of a string
   * @param {string} str - The string to capitalize
   * @returns {string} - The capitalized string
   */
  export const capitalize = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  /**
   * Convert string to title case
   * @param {string} str - The string to convert
   * @returns {string} - The title case string
   */
  export const toTitleCase = (str: string): string => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Get initials from a name
   * @param {string} name - The name to get initials from
   * @returns {string} - The initials
   */
  export const getInitials = (name: string): string => {
    if (!name) return '';
    
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  /**
   * Generate a random ID
   * @param {number} length - The length of the ID
   * @returns {string} - The random ID
   */
  export const generateId = (length: number = 8): string => {
    return Math.random().toString(36).substring(2, length + 2);
  };
  
  /**
   * Truncate a string to a specified length
   * @param {string} str - The string to truncate
   * @param {number} maxLength - The maximum length
   * @param {string} suffix - The suffix to add
   * @returns {string} - The truncated string
   */
  export const truncateString = (str: string, maxLength: number = 50, suffix: string = '...'): string => {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + suffix;
  };
  
  /**
   * Get a badge color based on status
   * @param {string} status - The status to get color for
   * @returns {string} - The badge color class for Tailwind CSS
   */
  export const getBadgeColorByStatus = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'completed':
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'pending_employee':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  /**
   * Get severity level color
   * @param {string} severity - The severity level
   * @returns {string} - The color class for Tailwind CSS
   */
  export const getSeverityColor = (severity: string): string => {
    switch (severity.toLowerCase()) {
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
  
  /**
   * Format a phone number
   * @param {string} phone - The phone number to format
   * @returns {string} - The formatted phone number
   */
  export const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
    
    return phone;
  };
  
  /**
   * Convert a date object to ISO date string (YYYY-MM-DD)
   * @param {Date} date - The date object
   * @returns {string} - The ISO date string
   */
  export const toISODateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  /**
   * Get today's date as ISO date string
   * @returns {string} - Today's date as ISO date string
   */
  export const getTodayISO = (): string => {
    return toISODateString(new Date());
  };
  
  /**
   * Check if a date is in the past
   * @param {string} dateString - The date string to check
   * @returns {boolean} - True if the date is in the past
   */
  export const isDateInPast = (dateString: string): boolean => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const today = new Date();
    
    // Reset time part to compare dates only
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    return date < today;
  };
  
  /**
   * Check if a date is in the future
   * @param {string} dateString - The date string to check
   * @returns {boolean} - True if the date is in the future
   */
  export const isDateInFuture = (dateString: string): boolean => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const today = new Date();
    
    // Reset time part to compare dates only
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    return date > today;
  };
  
  /**
   * Sort an array of objects by a specific property
   * @param {Array<any>} array - The array to sort
   * @param {string} key - The property to sort by
   * @param {boolean} ascending - Whether to sort in ascending order
   * @returns {Array<any>} - The sorted array
   */
  export const sortArrayByProperty = (array: Array<any>, key: string, ascending: boolean = true): Array<any> => {
    if (!array || !array.length) return [];
    
    return [...array].sort((a, b) => {
      if (a[key] < b[key]) return ascending ? -1 : 1;
      if (a[key] > b[key]) return ascending ? 1 : -1;
      return 0;
    });
  };
  
  /**
   * Filter array of objects by text search
   * @param {Array<any>} array - The array to filter
   * @param {string} searchText - The search text
   * @param {string[]} fields - The fields to search in
   * @returns {Array<any>} - The filtered array
   */
  export const filterArrayBySearch = (array: Array<any>, searchText: string, fields: string[]): Array<any> => {
    if (!array || !array.length || !searchText) return array;
    
    const lowerSearchText = searchText.toLowerCase();
    
    return array.filter(item => {
      return fields.some(field => {
        const value = item[field];
        if (!value) return false;
        return value.toString().toLowerCase().includes(lowerSearchText);
      });
    });
  };