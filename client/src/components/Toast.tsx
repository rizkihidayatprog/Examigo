import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'loading';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (type !== 'loading') {
      setTimeout(() => {
        dismissToast(id);
      }, 4000);
    }
    return id;
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {/* Toast Portal/Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let borderColor = 'border-slate-200';
          let iconBg = 'bg-blue-50 text-blue-600';
          let Icon = Info;

          if (toast.type === 'success') {
            borderColor = 'border-emerald-200';
            iconBg = 'bg-emerald-50 text-emerald-600';
            Icon = CheckCircle;
          } else if (toast.type === 'error') {
            borderColor = 'border-red-200';
            iconBg = 'bg-red-50 text-red-600';
            Icon = AlertCircle;
          } else if (toast.type === 'loading') {
            borderColor = 'border-slate-200';
            iconBg = 'bg-slate-100 text-slate-600 animate-spin';
            Icon = Loader2;
          }

          return (
            <div
              key={toast.id}
              className={`p-3.5 rounded-xl border bg-white shadow-lg flex items-start gap-3 pointer-events-auto transition-all duration-200 ${borderColor}`}
            >
              <div className={`p-1 rounded-lg shrink-0 ${iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs font-semibold text-slate-800 leading-relaxed pt-0.5">
                {toast.message}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
