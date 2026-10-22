import React from 'react'

export interface ToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
  id?: string
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className = '',
  id,
}) => {
  const toggleId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex items-start justify-between gap-4 cursor-pointer select-none ${className}`}>
      <label htmlFor={toggleId} className="flex flex-col cursor-pointer">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{label}</span>
        {description && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{description}</span>
        )}
      </label>
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? 'bg-[#1D4ED8]' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
