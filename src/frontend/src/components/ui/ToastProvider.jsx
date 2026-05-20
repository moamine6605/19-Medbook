import { useCallback, useMemo, useState } from 'react';
import { ToastContext } from './toastContext.js';

let nextId = 1;

function normalize(message) {
  if (message === null || message === undefined) return '';
  return typeof message === 'string' ? message : String(message);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = nextId++;
    const item = {
      id,
      type: toast.type || 'info',
      title: toast.title ? normalize(toast.title) : '',
      message: normalize(toast.message),
      timeoutMs: typeof toast.timeoutMs === 'number' ? toast.timeoutMs : 3500,
      actions: Array.isArray(toast.actions) ? toast.actions : null,
    };
    setToasts((prev) => [...prev, item]);
    if (item.timeoutMs > 0) {
      window.setTimeout(() => remove(id), item.timeoutMs);
    }
    return id;
  }, [remove]);

  const api = useMemo(() => ({
    push,
    success: (message, opts = {}) => push({ type: 'success', message, ...opts }),
    error: (message, opts = {}) => push({ type: 'error', message, ...opts }),
    info: (message, opts = {}) => push({ type: 'info', message, ...opts }),
    warning: (message, opts = {}) => push({ type: 'warning', message, ...opts }),
    confirm: (message, opts = {}) => {
      let toastId = null;
      return new Promise((resolve) => {
        const {
          title = 'Confirmation',
          confirmLabel = 'Confirmer',
          cancelLabel = 'Annuler',
          confirmVariant = 'danger', // primary|danger|outline|ghost|success|secondary
          cancelVariant = 'outline',
        } = opts || {};

        const onCancel = () => {
          if (toastId !== null) remove(toastId);
          resolve(false);
        };
        const onConfirm = () => {
          if (toastId !== null) remove(toastId);
          resolve(true);
        };

        toastId = push({
          type: 'warning',
          title,
          message,
          timeoutMs: 0,
          actions: [
            { label: cancelLabel, variant: cancelVariant, onClick: onCancel },
            { label: confirmLabel, variant: confirmVariant, onClick: onConfirm },
          ],
        });
      });
    },
    remove,
  }), [push, remove]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-relevant="additions removals">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <div className="toast-body">
              {t.title ? <div className="toast-title">{t.title}</div> : null}
              <div className="toast-message">{t.message}</div>
              {t.actions ? (
                <div className="toast-actions">
                  {t.actions.map((a, idx) => (
                    <button
                      key={`${a.label}-${idx}`}
                      type="button"
                      className={["btn", a.variant ? `btn-${a.variant}` : "btn-outline", "toast-action-btn"].filter(Boolean).join(" ")}
                      onClick={a.onClick}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <button type="button" className="toast-close" onClick={() => remove(t.id)} aria-label="Fermer">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
