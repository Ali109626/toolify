import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ToastProvider } from './components/ui/Toast'
import { ThemeProvider } from './context/ThemeContext'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { AllTools } from './pages/AllTools'
import { CategoryPage } from './pages/CategoryPage'
import { ToolPage } from './pages/ToolPage'
import { About } from './pages/About'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { Contact } from './pages/Contact'
import { FaqPage } from './pages/FaqPage'
import { NotFound } from './pages/NotFound'
import { BlogList } from './pages/BlogList'
import { BlogPostPage } from './pages/BlogPostPage'

// Automatically scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#FBFBF9] dark:bg-[#0B0F19] text-[#111827] dark:text-[#F9FAFB] transition-colors duration-150">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tools" element={<AllTools />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/tools/:toolId" element={<ToolPage />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/category/:category" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ToastProvider>
  </ThemeProvider>
  )
}

export default App
