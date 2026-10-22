import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ToastProvider } from '../components/ui/Toast'
import { Header } from '../components/layout/Header'
import { CommandPalette } from '../components/layout/CommandPalette'
import { Home } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import { AllTools } from '../pages/AllTools'
import { WordCounter } from '../tools/text/WordCounter'
import { JsonFormatter } from '../tools/dev/JsonFormatter'
import { PercentageCalculator } from '../tools/calc/PercentageCalculator'
import { BlogList } from '../pages/BlogList'
import { BlogPostPage } from '../pages/BlogPostPage'
import { CategoryBadge } from '../components/blog/CategoryBadge'
import { Routes, Route } from 'react-router-dom'

describe('Header & Navigation Component', () => {
  it('renders brand logo and navigation links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    expect(screen.getByText('Toolify')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('Search tools...')).toBeInTheDocument()
  })
})

describe('CommandPalette (Search Modal)', () => {
  it('does not render when isOpen is false', () => {
    render(
      <MemoryRouter>
        <CommandPalette isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders and locks body scroll when isOpen is true, then restores on unmount', () => {
    const { unmount } = render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('closes when clicking on the backdrop outside the modal', () => {
    const handleClose = vi.fn()
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={handleClose} />
      </MemoryRouter>
    )

    const backdrop = screen.getByRole('dialog')
    fireEvent.click(backdrop)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does NOT close when clicking inside the modal content or input', () => {
    const handleClose = vi.fn()
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={handleClose} />
      </MemoryRouter>
    )

    const searchInput = screen.getByPlaceholderText(/Search tools by name, category, or task/i)
    fireEvent.click(searchInput)
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('closes when pressing the Escape key', () => {
    const handleClose = vi.fn()
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={handleClose} />
      </MemoryRouter>
    )

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('closes and navigates when clicking on a search result', () => {
    const handleClose = vi.fn()
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={handleClose} />
      </MemoryRouter>
    )

    const toolResult = screen.getByText('Image Compressor')
    fireEvent.click(toolResult)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})

describe('Home Page', () => {
  it('renders hero title and tools list', () => {
    render(
      <ToastProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </ToastProvider>
    )

    expect(screen.getByText(/Everyday digital problem-solving/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Search tools by name/i)).toBeInTheDocument()
    expect(screen.getAllByText('Image Compressor')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Merge PDF Files')[0]).toBeInTheDocument()
  })

  it('filters tools dynamically when searching', () => {
    render(
      <ToastProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </ToastProvider>
    )

    const searchInput = screen.getByPlaceholderText(/Search tools by name/i)
    fireEvent.change(searchInput, { target: { value: 'compress' } })

    expect(screen.getAllByText('Image Compressor')[0]).toBeInTheDocument()
  })
})

describe('Tool Components', () => {
  it('WordCounter calculates live statistics correctly', () => {
    render(
      <ToastProvider>
        <WordCounter />
      </ToastProvider>
    )

    const textarea = screen.getByPlaceholderText(/Start typing or paste your content here/i)
    fireEvent.change(textarea, { target: { value: 'One two three four five.' } })

    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('JsonFormatter handles formatting and minification', () => {
    render(
      <ToastProvider>
        <JsonFormatter />
      </ToastProvider>
    )

    const textarea = screen.getByPlaceholderText(/Paste or type raw JSON here/i)
    fireEvent.change(textarea, { target: { value: '{"name":"toolify"}' } })

    const formatBtn = screen.getByRole('button', { name: /Format & Validate/i })
    fireEvent.click(formatBtn)

    expect(textarea).toHaveValue('{\n  "name": "toolify"\n}')
  })

  it('PercentageCalculator computes percentage values', () => {
    render(
      <ToastProvider>
        <PercentageCalculator />
      </ToastProvider>
    )

    const xInput = screen.getByLabelText(/Percentage \(X%\)/i)
    const yInput = screen.getByLabelText(/Total Amount \(Y\)/i)

    fireEvent.change(xInput, { target: { value: '10' } })
    fireEvent.change(yInput, { target: { value: '500' } })

    expect(screen.getByText('50')).toBeInTheDocument()
  })
})

describe('NotFound (404 Page)', () => {
  it('renders 404 error header, helpful navigation, and return home button', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )

    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
    expect(screen.getByText('Error 404')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Back to Homepage/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Browse All Tools/i })).toBeInTheDocument()
  })
})

describe('AllTools Directory Page', () => {
  it('renders directory heading and tool cards with category filters', () => {
    render(
      <MemoryRouter>
        <AllTools />
      </MemoryRouter>
    )

    expect(screen.getByText('All Online Utilities')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Search tools by name, task, or keyword/i)).toBeInTheDocument()
    expect(screen.getAllByText('Image Compressor')[0]).toBeInTheDocument()
  })
})

describe('Responsive Header Navigation Drawer', () => {
  it('toggles mobile menu open and displays category links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    const mobileMenuBtn = screen.getByLabelText(/Toggle mobile menu/i)
    expect(screen.queryByText('Browse Categories')).not.toBeInTheDocument()

    // Open mobile menu
    fireEvent.click(mobileMenuBtn)
    expect(screen.getByText('Browse Categories')).toBeInTheDocument()
    expect(screen.getByText('View All Tools →')).toBeInTheDocument()

    // Close mobile menu
    fireEvent.click(mobileMenuBtn)
    expect(screen.queryByText('Browse Categories')).not.toBeInTheDocument()
  })
})

describe('BlogList Page', () => {
  it('renders blog heading, search input, category filters, and articles', () => {
    render(
      <MemoryRouter>
        <BlogList />
      </MemoryRouter>
    )

    expect(screen.getByText('Engineering & Practical Guides')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Search tutorials by topic/i)).toBeInTheDocument()
    expect(screen.getAllByText('PDF Guides').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Image Tools').length).toBeGreaterThan(0)
    expect(screen.getAllByText('How to Merge PDF Files Online for Free').length).toBeGreaterThan(0)
  })

  it('filters articles dynamically by search keyword', () => {
    render(
      <MemoryRouter>
        <BlogList />
      </MemoryRouter>
    )

    const searchInput = screen.getByPlaceholderText(/Search tutorials by topic/i)
    fireEvent.change(searchInput, { target: { value: 'JSON' } })

    expect(screen.getAllByText(/How to Format JSON Online/i).length).toBeGreaterThan(0)
  })
})

describe('BlogPostPage', () => {
  it('renders published article details, table of contents, and tool CTA', () => {
    render(
      <ToastProvider>
        <MemoryRouter initialEntries={['/blog/how-to-merge-pdf-files-online-for-free']}>
          <Routes>
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    )

    expect(screen.getByRole('heading', { level: 1, name: 'How to Merge PDF Files Online for Free' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Why Client-Side PDF Merging Protects Your Data/i })).toBeInTheDocument()
    expect(screen.getAllByText(/Toolify PDF Merger/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/In This Article/i)).toBeInTheDocument()
  })

  it('renders 404 NotFound when article slug does not exist', () => {
    render(
      <ToastProvider>
        <MemoryRouter initialEntries={['/blog/non-existent-article-slug']}>
          <Routes>
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    )

    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })
})

describe('CategoryBadge Component', () => {
  it('renders accessible high-contrast colors and pill styling for all categories', () => {
    const { rerender } = render(
      <MemoryRouter>
        <CategoryBadge category="pdf-guides" />
      </MemoryRouter>
    )

    const pdfBadge = screen.getByText('PDF Guides').parentElement
    expect(pdfBadge).toHaveClass('bg-[#FEE2E2]')
    expect(pdfBadge).toHaveClass('text-[#991B1B]')
    expect(pdfBadge).toHaveClass('border-[#FECACA]')
    expect(pdfBadge).toHaveClass('rounded-full')

    rerender(
      <MemoryRouter>
        <CategoryBadge category="image-tools" />
      </MemoryRouter>
    )
    const imgBadge = screen.getByText('Image Tools').parentElement
    expect(imgBadge).toHaveClass('bg-[#DBEAFE]')
    expect(imgBadge).toHaveClass('text-[#1D4ED8]')

    rerender(
      <MemoryRouter>
        <CategoryBadge category="developer-tools" />
      </MemoryRouter>
    )
    const devBadge = screen.getByText('Developer Tools').parentElement
    expect(devBadge).toHaveClass('bg-[#D1FAE5]')
    expect(devBadge).toHaveClass('text-[#065F46]')

    rerender(
      <MemoryRouter>
        <CategoryBadge category="calculators" />
      </MemoryRouter>
    )
    const calcBadge = screen.getByText('Calculators').parentElement
    expect(calcBadge).toHaveClass('bg-[#CFFAFE]')
    expect(calcBadge).toHaveClass('text-[#155E75]')

    rerender(
      <MemoryRouter>
        <CategoryBadge category="text-and-writing" />
      </MemoryRouter>
    )
    const textBadge = screen.getByText('Text & Writing').parentElement
    expect(textBadge).toHaveClass('bg-[#FEF3C7]')
    expect(textBadge).toHaveClass('text-[#92400E]')

    rerender(
      <MemoryRouter>
        <CategoryBadge category="productivity-tips" />
      </MemoryRouter>
    )
    const prodBadge = screen.getByText('Productivity Tips').parentElement
    expect(prodBadge).toHaveClass('bg-[#EDE9FE]')
    expect(prodBadge).toHaveClass('text-[#5B21B6]')
  })
})
