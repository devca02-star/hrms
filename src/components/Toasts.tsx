import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const Toasts: React.FC = () => {
  const { toasts, removeToast, dismissToast } = useApp();

  const handleDismiss = (id: string) => {
    if (typeof removeToast === 'function') {
      removeToast(id);
    } else if (typeof dismissToast === 'function') {
      dismissToast(id);
    }
  };

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />
        };

        const borderStyles = {
          success: 'border-emerald-200 bg-white',
          error: 'border-rose-200 bg-white',
          warning: 'border-amber-200 bg-white',
          info: 'border-indigo-200 bg-white'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border ${borderStyles[toast.type]} flex items-start space-x-3 transition-all animate-in slide-in-from-right duration-200`}
          >
            {icons[toast.type]}
            <div className="flex-1 truncate">
              <h4 className="text-xs font-bold text-slate-900">{toast.title}</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => handleDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
