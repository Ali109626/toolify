import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface ToastOptions {
  id?: string
  duration?: number
}

export interface ToastMessage {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextValue {
  showToast: (
    title: string,
    message?: string,
    type?: 'success' | 'error' | 'info',
    options?: ToastOptions
  ) => string
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const SUCCESS_DURATION = 2800 // 2.8s (approx. 2.5–3 seconds per requirement)
const ERROR_DURATION = 6000 // Error notifications stay visible longer to read
const INFO_DURATION = 3500

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const toastsRef = useRef<ToastMessage[]>([])

  useEffect(() => {
    toastsRef.current = toasts
  }, [toasts])

  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const clearTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  // Clear all timers on unmount
  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const removeToast = useCallback(
    (id: string) => {
      clearTimer(id)
      setToasts((prev) => prev.filter((t) => t.id !== id))
    },
    [clearTimer]
  )

  const clearToasts = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer))
    timersRef.current.clear()
    setToasts([])
  }, [])

  const showToast = useCallback(
    (
      title: string,
      message?: string,
      type: 'success' | 'error' | 'info' = 'success',
      options?: ToastOptions
    ): string => {
      const explicitId = options?.id
      const duration =
        options?.duration ??
        (type === 'success'
          ? SUCCESS_DURATION
          : type === 'error'
          ? ERROR_DURATION
          : INFO_DURATION)

      const currentToasts = toastsRef.current
      let targetId = explicitId || ''
      let isReplacing = false

      // 1. If explicit ID provided, check if it already exists
      if (explicitId) {
        const found = currentToasts.find((t) => t.id === explicitId)
        if (found) {
          targetId = explicitId
          isReplacing = true
        }
      }

      // 2. Allow a maximum of ONE visible success toast at a time for repeated operations.
      // When another compression succeeds, update the existing toast or replace it instead of adding another.
      if (!isReplacing && type === 'success') {
        const existingSuccess = currentToasts.find((t) => t.type === 'success')
        if (existingSuccess) {
          targetId = explicitId || existingSuccess.id
          isReplacing = true
          if (existingSuccess.id !== targetId) {
            clearTimer(existingSuccess.id)
          }
        }
      }

      // 3. For duplicate error/info notifications without explicit ID, refresh timer instead of duplicating
      if (!isReplacing && !explicitId) {
        const existingSame = currentToasts.find(
          (t) => t.type === type && t.title === title && t.message === message
        )
        if (existingSame) {
          targetId = existingSame.id
          isReplacing = true
        }
      }

      // 4. Generate fresh ID if none assigned
      if (!targetId) {
        targetId = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      }

      // Clear any prior timer for this toast target
      clearTimer(targetId)

      // Schedule auto-dismiss
      const timer = setTimeout(() => {
        removeToast(targetId)
      }, duration)
      timersRef.current.set(targetId, timer)

      // Update state
      setToasts((prev) => {
        const targetIndex = prev.findIndex((t) => t.id === targetId)
        if (targetIndex !== -1) {
          const updated = [...prev]
          updated[targetIndex] = { id: targetId, title, message, type }
          return updated
        }

        if (type === 'success') {
          const successIndex = prev.findIndex((t) => t.type === 'success')
          if (successIndex !== -1) {
            const updated = [...prev]
            updated[successIndex] = { id: targetId, title, message, type }
            return updated
          }
        }

        const capped = prev.length >= 3 ? prev.slice(-2) : prev
        return [...capped, { id: targetId, title, message, type }]
      })

      return targetId
    },
    [clearTimer, removeToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, removeToast, clearToasts }}>
      {children}
      {/* Fixed notification area: near top of viewport below header and safe-area on mobile, bottom-right on desktop */}
      <div
        className="fixed top-[calc(4rem+env(safe-area-inset-top,0px)+0.5rem)] sm:top-auto sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-auto sm:w-full mx-auto sm:mx-0 pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
            aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
            className={`pointer-events-auto p-2.5 sm:p-3 rounded-xl border shadow-lg flex items-center sm:items-start gap-2.5 sm:gap-3 transition-all duration-200 animate-in fade-in slide-in-from-top-2 sm:slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-emerald-200 dark:border-emerald-800/80 text-slate-800 dark:text-slate-100 shadow-emerald-900/5'
                : toast.type === 'error'
                ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-rose-200 dark:border-rose-800/80 text-slate-800 dark:text-slate-100 shadow-rose-900/5'
                : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-blue-200 dark:border-blue-800/80 text-slate-800 dark:text-slate-100 shadow-blue-900/5'
            }`}
          >
            {toast.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0 sm:mt-0.5" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 dark:text-rose-400 shrink-0 sm:mt-0.5" />
            )}
            {toast.type === 'info' && (
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 shrink-0 sm:mt-0.5" />
            )}
            <div className="flex-1 min-w-0 flex flex-col text-left">
              <span className="text-xs font-semibold truncate leading-tight">{toast.title}</span>
              {toast.message && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate leading-tight">
                  {toast.message}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
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
