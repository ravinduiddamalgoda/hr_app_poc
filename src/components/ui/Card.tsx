import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  headerActions?: ReactNode;
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverEffect?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  footer,
  headerActions,
  bordered = true,
  shadow = 'md',
  rounded = 'lg',
  hoverEffect = false,
  clickable = false,
  onClick
}) => {
  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };
  
  // Rounded classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };
  
  // Border classes
  const borderClasses = bordered ? 'border border-gray-200' : '';
  
  // Hover effect
  const hoverClasses = hoverEffect ? 'transition-transform duration-200 transform hover:scale-[1.02] hover:shadow-lg' : '';
  
  // Clickable
  const clickableClasses = clickable ? 'cursor-pointer' : '';
  
  // Event handlers
  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };
  
  // Determine if we should render the header
  const hasHeader = title || subtitle || headerActions;

  return (
    <div 
      className={`bg-white ${shadowClasses[shadow]} ${roundedClasses[rounded]} ${borderClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={handleClick}
    >
      {/* Card Header */}
      {hasHeader && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              {title && <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>}
              {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
            </div>
            {headerActions && <div>{headerActions}</div>}
          </div>
        </div>
      )}
      
      {/* Card Body */}
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
      
      {/* Card Footer */}
      {footer && (
        <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;