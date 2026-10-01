import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { usePrototype } from '../../state';
import './Toast.css';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePrototype();

  return (
    <div className="sw-toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: {
    id: string;
    message: string;
    type?: 'info' | 'success' | 'warning';
  };
  onDismiss: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={16} className="sw-toast-icon sw-toast-icon--success" aria-hidden="true" />;
      case 'warning':
        return <AlertCircle size={16} className="sw-toast-icon sw-toast-icon--warning" aria-hidden="true" />;
      case 'info':
      default:
        return <Info size={16} className="sw-toast-icon sw-toast-icon--info" aria-hidden="true" />;
    }
  };

  return (
    <div className={`sw-toast sw-toast--${toast.type || 'info'}`} role="status">
      <div className="sw-toast-content">
        {getIcon()}
        <span className="sw-toast-message">{toast.message}</span>
      </div>
      <button
        type="button"
        className="sw-toast-close"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
};
