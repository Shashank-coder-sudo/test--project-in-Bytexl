import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toasts = [], onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const Icon = isSuccess ? CheckCircle2 : isError ? AlertCircle : Info;
        const iconColor = isSuccess ? '#10b981' : isError ? '#f43f5e' : '#6366f1';

        return (
          <div
            key={toast.id}
            className={`toast-item ${
              isSuccess ? 'toast-success' : isError ? 'toast-error' : 'toast-info'
            }`}
          >
            <Icon size={20} color={iconColor} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: '0.88rem' }}>{toast.message}</div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                color: 'var(--text-muted)',
                padding: '0.2rem',
                display: 'inline-flex',
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
