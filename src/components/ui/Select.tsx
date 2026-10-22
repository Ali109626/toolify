import React from 'react'

export interface SelectOption {
  label: string
  value: string | number
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full bg-white dark:bg-slate-900 border rounded-lg text-sm text-slate-900 dark:text-slate-100 px-3.5 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
            error
              ? 'border-rose-400 dark:border-rose-600'
              : 'border-[#E5E5DF] dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-rose-600 dark:text-rose-400">{error}</span>}
      </div>
    )
  }
)

Select.displayName = 'Select'
