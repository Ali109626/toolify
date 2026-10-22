import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react'
import { TOOLS } from '../../config/site'
import { DynamicIcon } from '../ui/DynamicIcon'
import { Badge } from '../ui/Badge'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Reset query and focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Prevent background scrolling while modal is open and restore when closed
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  // Global Escape key listener
  useEffect(() => {
    if (!isOpen) return

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isOpen, onClose])

  // Filter tools
  const filteredTools = TOOLS.filter((tool) => {
    const q = query.toLowerCase().trim()
    if (!q) return true
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.shortDescription.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q))
    )
  }).slice(0, 8)

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleSelect = (path: string) => {
    onClose()
    navigate(path)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredTools.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredTools[selectedIndex]) {
        handleSelect(filteredTools[selectedIndex].path)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 pb-4 px-3 sm:px-4 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
    >
      <div
        className="w-full max-w-xl max-h-[calc(100vh-4rem)] sm:max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#E5E5DF] dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E5E5DF] dark:border-slate-800 shrink-0">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search tools by name, category, or task..."
            className="w-full bg-transparent px-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setQuery('')
                inputRef.current?.focus()
              }}
              aria-label="Clear query"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Desktop ESC shortcut indicator */}
          <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 ml-2 select-none shrink-0">
            ESC
          </span>

          {/* Mobile Close Button (at least 44x44px touch target) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Close search"
            className="sm:hidden min-w-[44px] min-h-[44px] -mr-1.5 ml-1 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[50vh] sm:max-h-96 overflow-y-auto p-2 flex flex-col gap-1">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No tools matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelect(tool.path)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/50 text-[#1D4ED8] dark:text-blue-300'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <DynamicIcon name={tool.icon} size={18} />
                    </div>
                    <div className="flex flex-col overflow-hidden text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate">{tool.name}</span>
                        {tool.badge && (
                          <Badge variant="cobalt" size="sm">
                            {tool.badge}
                          </Badge>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {tool.shortDescription}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 hidden xs:inline sm:inline">
                      {tool.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50/70 dark:bg-slate-900/70 border-t border-[#E5E5DF] dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px]">
                ↓
              </kbd>{' '}
              navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> select
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px]">100% Client-Side Search</span>
        </div>
      </div>
    </div>
  )
}
