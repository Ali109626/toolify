import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextValue {
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      setToasts((prev) => [...prev, { id, title, message, type }])
      setTimeout(() => {
        removeToast(id)
      }, 3500)
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-100'
                : toast.type === 'error'
                ? 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-800 text-slate-800 dark:text-slate-100'
                : 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800 text-slate-800 dark:text-slate-100'
            }`}
          >
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 flex flex-col text-left">
              <span className="text-xs font-semibold">{toast.title}</span>
              {toast.message && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {toast.message}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
