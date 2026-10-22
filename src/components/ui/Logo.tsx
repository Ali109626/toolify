import React from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/site'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  linkToHome?: boolean
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', linkToHome = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const content = (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Dynamic stylized T mark matching the brand board */}
      <div
        className={`${iconSizes[size]} relative rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 p-1.5 shadow-sm border border-slate-800 flex items-center justify-center overflow-hidden shrink-0`}
      >
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="toolify-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="toolify-bar" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          {/* Stylized T geometry */}
          <path
            d="M6 10 C6 7.8 7.8 6 10 6 L30 6 C32.2 6 34 7.8 34 10 L34 11 C34 13.2 32.2 15 30 15 L23 15 L23 32 C23 33.7 21.7 35 20 35 C18.3 35 17 33.7 17 32 L17 15 L10 15 C7.8 15 6 13.2 6 11 Z"
            fill="url(#toolify-grad)"
          />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className={`${textSizes[size]} text-slate-900 dark:text-white font-extrabold tracking-tight`}>
          {siteConfig.name}
        </span>
      </div>
    </div>
  )

  if (linkToHome) {
    return (
      <Link to="/" className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}
