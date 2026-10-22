import React from 'react'

export interface SliderProps {
  label?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  className?: string
  id?: string
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  className = '',
  id,
}) => {
  const sliderId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={sliderId} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
          {value}
          {unit}
        </span>
      </div>
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-blue-600/40"
      />
      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  )
}
