import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'cobalt' | 'success' | 'warning' | 'purple' | 'muted'
  size?: 'sm' | 'md'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 leading-none',
    md: 'text-xs px-2.5 py-1 leading-normal',
  }

  const variantStyles = {
    default:
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    cobalt:
      'bg-blue-50 dark:bg-blue-950/60 text-[#1D4ED8] dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-semibold',
    success:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60',
    warning:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60',
    purple:
      'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60',
    muted:
      'bg-transparent text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
