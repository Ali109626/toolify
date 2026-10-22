import React from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer'

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
    }

    const variantStyles = {
      primary:
        'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white shadow-xs border border-transparent font-semibold',
      secondary:
        'bg-white dark:bg-slate-800 hover:bg-[#F4F4F0] dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-[#E5E5DF] dark:border-slate-700 shadow-xs',
      outline:
        'bg-transparent hover:bg-blue-50/60 dark:hover:bg-blue-950/40 text-[#1D4ED8] dark:text-blue-400 border border-blue-600/30 dark:border-blue-500/40',
      ghost:
        'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white shadow-xs border border-transparent font-medium',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
