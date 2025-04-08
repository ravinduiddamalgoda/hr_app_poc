import React, { useEffect, useState } from 'react';
import { 
  FiX, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiInfo, 
  FiAlertTriangle 
} from 'react-icons/fi';
import { NotificationProps } from '../../types';

const Notification: React.FC<NotificationProps> = ({
  id,
  type = 'info',
  message,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(100);
  
  // Auto-close notification after 5 seconds
  useEffect(() => {
    if (!isPaused && isVisible && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 50); // Update every 50ms for smooth progress
      
      return () => clearTimeout(timer);
    } else if (isVisible && timeLeft <= 0) {
      handleClose();
    }
  }, [isPaused, isVisible, timeLeft]);
  
  // Handle notification close with animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose(id);
    }, 300); // Wait for fade out animation
  };
  
  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="h-5 w-5" />;
      case 'error':
        return <FiAlertCircle className="h-5 w-5" />;
      case 'warning':
        return <FiAlertTriangle className="h-5 w-5" />;
      case 'info':
      default:
        return <FiInfo className="h-5 w-5" />;
    }
  };
  
  // Color classes based on notification type
  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-400 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-400 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-400 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-400 text-blue-800';
    }
  };
  
  // Icon color classes based on notification type
  const getIconClasses = () => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
      default:
        return 'text-blue-500';
    }
  };
  
  // Progress bar color based on notification type
  const getProgressBarClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };
  
  return (
    <div 
      className={`max-w-sm w-full border-l-4 rounded-md shadow-lg pointer-events-auto transition-opacity duration-300 ${getTypeClasses()} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      role="alert"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${getIconClasses()}`}>
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium">
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 ${type === 'info' ? 'focus:ring-blue-500' : type === 'success' ? 'focus:ring-green-500' : type === 'warning' ? 'focus:ring-yellow-500' : 'focus:ring-red-500'}`}
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-1 relative overflow-hidden rounded-b-md">
        <div 
          className={`h-full ${getProgressBarClasses()}`}
          style={{ width: `${timeLeft}%` }}
        />
      </div>
    </div>
  );
};

export default Notification;