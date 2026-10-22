import React from 'react'
import { Link } from 'react-router-dom'
import { BLOG_CATEGORIES } from '../../data/blogPosts'
import type { BlogCategoryId } from '../../types/blog'
import { DynamicIcon } from '../ui/DynamicIcon'

export interface CategoryBadgeProps {
  category: BlogCategoryId | string
  size?: 'sm' | 'md'
  showIcon?: boolean
  asLink?: boolean
  className?: string
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'sm',
  showIcon = false,
  asLink = false,
  className = '',
}) => {
  const catObj = BLOG_CATEGORIES.find((c) => c.id === category)
  const label = catObj?.name || category
  const badgeStyle = catObj?.badgeColor || 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]'

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-2.5 py-0.5 tracking-wide'
      : 'text-xs px-3 py-1 tracking-wider'

  const baseClasses = `inline-flex items-center gap-1.5 rounded-full font-semibold uppercase border transition-all max-w-full truncate shadow-2xs select-none ${badgeStyle} ${sizeClasses} ${className}`

  if (asLink) {
    return (
      <Link
        to={`/blog/category/${category}`}
        className={`${baseClasses} hover:opacity-90 cursor-pointer`}
      >
        {showIcon && catObj?.icon && (
          <DynamicIcon name={catObj.icon} size={size === 'sm' ? 12 : 14} className="shrink-0" />
        )}
        <span className="truncate">{label}</span>
      </Link>
    )
  }

  return (
    <span className={baseClasses}>
      {showIcon && catObj?.icon && (
        <DynamicIcon name={catObj.icon} size={size === 'sm' ? 12 : 14} className="shrink-0" />
      )}
      <span className="truncate">{label}</span>
    </span>
  )
}

export default CategoryBadge
