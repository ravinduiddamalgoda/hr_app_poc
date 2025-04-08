import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { IconType } from 'react-icons';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconType;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  isLoading = false,
  loadingText,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  // Size classes
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white border-transparent focus:ring-primary-500',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white border-transparent focus:ring-secondary-500',
    success: 'bg-green-600 hover:bg-green-700 text-white border-transparent focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white border-transparent focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent focus:ring-blue-500',
    light: 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-transparent focus:ring-gray-500',
    dark: 'bg-gray-800 hover:bg-gray-900 text-white border-transparent focus:ring-gray-500',
    outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300 focus:ring-primary-500'
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled classes
  const disabledClasses = (disabled || isLoading) ? 'opacity-60 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${disabledClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText || children}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="mr-2 -ml-1 h-4 w-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="ml-2 -mr-1 h-4 w-4" />}
        </>
      )}
    </button>
  );
};

export default Button;