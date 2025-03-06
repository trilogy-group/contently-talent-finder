import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          headerBg: 'bg-red-50'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
          confirmButton: 'bg-amber-600 hover:bg-amber-700 text-white',
          headerBg: 'bg-amber-50'
        };
      case 'info':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-blue-500" />,
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          headerBg: 'bg-blue-50'
        };
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          headerBg: 'bg-red-50'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden animate-scaleIn">
        <div className={cn("px-6 py-4 flex items-center gap-3", styles.headerBg)}>
          {styles.icon}
          <h3 className="text-lg font-semibold flex-1">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-700">{message}</p>
        </div>
        
        <div className="px-6 py-3 bg-gray-50 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            className={styles.confirmButton}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper function to show a confirmation dialog
interface ShowConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    type: 'danger' | 'warning' | 'info';
  }>({
    onConfirm: () => {},
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'danger'
  });

  const showConfirm = (
    onConfirm: () => void,
    options: ShowConfirmOptions = {}
  ) => {
    setConfig({
      onConfirm,
      title: options.title || 'Confirm Action',
      message: options.message || 'Are you sure you want to proceed?',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      type: options.type || 'danger'
    });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const confirmDialog = (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={config.onConfirm}
      title={config.title}
      message={config.message}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
      type={config.type}
    />
  );

  return { showConfirm, confirmDialog };
};
