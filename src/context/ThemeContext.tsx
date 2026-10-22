import React, { createContext, useContext, useState, useEffect } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const THEME_STORAGE_KEY = 'toolify_theme'

export const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark'
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') {
      return saved
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light'
    }
    // If html already has class dark
    if (document.documentElement.classList.contains('dark')) {
      return 'dark'
    }
  } catch {
    // LocalStorage quota or access error
  }
  return 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  // Synchronize document.documentElement and localStorage whenever theme changes
  useEffect(() => {
    const isDark = theme === 'dark'
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore storage errors
    }

    // Update theme-color meta tag for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#0B0F19' : '#1D4ED8')
    }
  }, [theme])

  // Listen for system color scheme changes if user hasn't explicitly chosen a theme
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY)
        if (!saved) {
          setThemeState(e.matches ? 'dark' : 'light')
        }
      } catch {}
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    // Fallback for tests or components rendered outside ThemeProvider
    const isDark =
      typeof document !== 'undefined'
        ? document.documentElement.classList.contains('dark')
        : true

    return {
      theme: isDark ? 'dark' : 'light',
      isDark,
      toggleTheme: () => {
        if (typeof document !== 'undefined') {
          if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark')
          } else {
            document.documentElement.classList.add('dark')
          }
        }
      },
      setTheme: () => {},
    }
  }
  return context
}
