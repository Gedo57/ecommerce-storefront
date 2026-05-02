import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

function generateToastId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto rounded-[1.4rem] border border-brand-900/10 bg-[rgba(255,253,250,0.96)] p-4 shadow-soft backdrop-blur">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${toast.variant === 'success' ? 'bg-emerald-500' : 'bg-brand-500'}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand-900">{toast.title}</p>
              {toast.description ? <p className="mt-1 text-sm leading-6 text-brand-900/70">{toast.description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-full p-1 text-brand-900/45 transition hover:bg-brand-50 hover:text-brand-900"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((toastId) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId));
  }, []);

  const showToast = useCallback(({ title, description = '', variant = 'default', duration = 2600 }) => {
    const id = generateToastId();
    setToasts((current) => [...current, { id, title, description, variant }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
