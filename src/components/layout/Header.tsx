import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Sun, Moon, Menu, X, ChevronDown, ShieldCheck } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { CATEGORIES } from '../../config/site'
import { CommandPalette } from './CommandPalette'
import { DynamicIcon } from '../ui/DynamicIcon'

export const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })
  const location = useLocation()

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsCategoryMenuOpen(false)
  }, [location.pathname])

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleTheme = () => {
    const willBeDark = !isDark
    setIsDark(willBeDark)
    if (willBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E5E5DF] dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand Logo & Category Navigation */}
          <div className="flex items-center gap-4 lg:gap-8">
            <Logo size="md" />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </button>

                {/* Categories Dropdown */}
                {isCategoryMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCategoryMenuOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl border border-[#E5E5DF] dark:border-slate-800 shadow-xl p-2 z-20 animate-in fade-in zoom-in-95 duration-150">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                        Tool Categories
                      </div>
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/category/${cat.id}`}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1D4ED8] dark:text-blue-400 flex items-center justify-center shrink-0">
                            <DynamicIcon name={cat.icon} size={16} />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-semibold">{cat.name}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {cat.description}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <Link
                to="/tools"
                className="px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold"
              >
                All Tools
              </Link>
              <Link
                to="/blog"
                className="px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold"
              >
                Blog
              </Link>
              <Link
                to="/category/image"
                className="px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold"
              >
                Image
              </Link>
              <Link
                to="/category/pdf"
                className="px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold"
              >
                PDF
              </Link>
              <Link
                to="/category/text"
                className="px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold"
              >
                Text
              </Link>
              <Link
                to="/category/developer"
                className="px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold"
              >
                Dev
              </Link>
              <Link
                to="/category/calculators"
                className="px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold"
              >
                Calculators
              </Link>
            </nav>
          </div>

          {/* Right: Search Bar Trigger, Local Badge, Theme & Mobile Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick search button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search tools"
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs cursor-pointer min-h-[36px]"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Search tools...</span>
              <kbd className="hidden sm:inline font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Privacy verification indicator */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full select-none">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side</span>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5E5DF] dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-150 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Browse Categories
              </span>
              <Link
                to="/tools"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All Tools →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-[#E5E5DF] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 min-h-[44px]"
                >
                  <DynamicIcon name={cat.icon} size={15} className="text-blue-600 shrink-0" />
                  <span className="truncate">{cat.name}</span>
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1 text-xs">
              <Link to="/blog" className="p-2.5 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 min-h-[40px] flex items-center">
                Blog &amp; Practical Guides
              </Link>
              <Link to="/about" className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 min-h-[40px] flex items-center">
                About &amp; Architecture
              </Link>
              <Link to="/privacy" className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 min-h-[40px] flex items-center">
                Client-Side Privacy Policy
              </Link>
              <Link to="/terms" className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 min-h-[40px] flex items-center">
                Terms of Service
              </Link>
              <Link to="/contact" className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 min-h-[40px] flex items-center">
                Contact &amp; Feedback
              </Link>
              <Link to="/faq" className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 min-h-[40px] flex items-center">
                Frequently Asked Questions
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
