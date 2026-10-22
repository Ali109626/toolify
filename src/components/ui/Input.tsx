import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-white dark:bg-slate-900 border rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
              leftIcon ? 'pl-9' : 'pl-3.5'
            } ${rightElement ? 'pr-10' : 'pr-3.5'} py-2 ${
              error
                ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500'
                : 'border-[#E5E5DF] dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-slate-400 dark:text-slate-500">
              {rightElement}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-rose-600 dark:text-rose-400">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-slate-500 dark:text-slate-400">{helperText}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
