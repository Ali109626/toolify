import React from 'react'
import * as LucideIcons from 'lucide-react'

interface DynamicIconProps extends React.SVGProps<SVGSVGElement> {
  name: string
  className?: string
  size?: number
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size = 20, ...props }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as any
  const IconComponent = icons[name] || icons.Wrench || LucideIcons.Sparkles

  return <IconComponent className={className} size={size} {...props} />
}
