import React, { Fragment, ReactNode, useRef, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
  contentClassName = ''
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Size classes for the modal dialog
  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: 'sm:max-w-4xl'
  };

  // Handle click outside to close modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap inside modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby={title ? 'modal-title' : undefined}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      {/* Modal Container */}
      <div 
        className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0"
        onClick={handleOverlayClick}
      >
        {/* Modal Content */}
        <div 
          ref={modalRef}
          className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full ${sizeClasses[size]} ${className}`}
          tabIndex={-1}
        >
          {/* Close Button */}
          {showCloseButton && (
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
              aria-label="Close"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}

          {/* Modal Header */}
          {title && (
            <div className="bg-gray-50 px-4 py-4 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                {title}
              </h3>
            </div>
          )}

          {/* Modal Body */}
          <div className={`px-4 py-4 sm:p-6 ${contentClassName}`}>
            {children}
          </div>

          {/* Modal Footer */}
          {footer && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-200 flex flex-wrap justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;