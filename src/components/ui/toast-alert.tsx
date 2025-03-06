import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastAlertProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
  className?: string;
  duration?: number;
}

export const showToastAlert = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info',
  duration: number = 3000
) => {
  // Create a container for the toast if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(toastContainer);
  }

  // Create a new toast element
  const toastId = `toast-${Date.now()}`;
  const toastElement = document.createElement('div');
  toastElement.id = toastId;
  toastContainer.appendChild(toastElement);

  // Render the toast
  const root = document.createElement('div');
  toastElement.appendChild(root);

  // Create the toast content
  const toastContent = document.createElement('div');
  
  // Set appropriate classes based on type
  let bgColor = 'bg-blue-50 border-blue-200';
  let textColor = 'text-blue-800';
  let icon = '🔵';
  
  switch (type) {
    case 'success':
      bgColor = 'bg-green-50 border-green-200';
      textColor = 'text-green-800';
      icon = '✅';
      break;
    case 'error':
      bgColor = 'bg-red-50 border-red-200';
      textColor = 'text-red-800';
      icon = '❌';
      break;
    case 'warning':
      bgColor = 'bg-amber-50 border-amber-200';
      textColor = 'text-amber-800';
      icon = '⚠️';
      break;
  }
  
  toastContent.className = `${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-md border flex items-center gap-3 min-w-[300px] max-w-md animate-slideIn`;
  toastContent.innerHTML = `
    <span>${icon}</span>
    <span class="flex-1">${message}</span>
    <button class="text-gray-500 hover:text-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;
  
  root.appendChild(toastContent);
  
  // Add click handler to close button
  const closeButton = toastContent.querySelector('button');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      removeToast();
    });
  }
  
  // Auto-remove after duration
  const timeoutId = setTimeout(() => {
    removeToast();
  }, duration);
  
  // Function to remove the toast
  function removeToast() {
    toastContent.classList.add('animate-fadeOut');
    setTimeout(() => {
      if (toastElement.parentNode) {
        toastElement.parentNode.removeChild(toastElement);
      }
      
      // Remove container if empty
      if (toastContainer && toastContainer.childNodes.length === 0) {
        document.body.removeChild(toastContainer);
      }
    }, 300);
    
    clearTimeout(timeoutId);
  }
};

// Add styles to document
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  .animate-slideIn {
    animation: slideIn 0.3s ease-out forwards;
  }
  
  .animate-fadeOut {
    animation: fadeOut 0.3s ease-in forwards;
  }
`;
document.head.appendChild(style);

export const ToastAlert: React.FC<ToastAlertProps> = ({ 
  message, 
  type = 'info', 
  onClose,
  className,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-amber-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div 
      className={cn(
        getBgColor(),
        getTextColor(),
        'px-4 py-3 rounded-lg shadow-md border flex items-center gap-3',
        className
      )}
    >
      {getIcon()}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
