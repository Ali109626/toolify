import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShieldCheck, ArrowRight } from 'lucide-react'
import { CATEGORIES, TOOLS } from '../config/site'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'
import { DynamicIcon } from '../components/ui/DynamicIcon'
import { Badge } from '../components/ui/Badge'
import { usePageMeta } from '../hooks/usePageMeta'
import type { CategoryType } from '../types'

export const AllTools: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all')

  usePageMeta('All Free Online Tools Directory', 'Browse all 18 client-side tools for images, PDFs, text, developer utilities, and calculations.')

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      tool.name.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.shortDescription.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q))
    return matchesCategory && matchesQuery
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 text-left">
      <Breadcrumbs items={[{ label: 'All Tools' }]} />

      {/* Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex flex-col gap-2 max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            All Online Utilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Browse our complete collection of 18 client-side utilities. Fast, privacy-first, and 100% free with no server uploads.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3.5 py-1.5 rounded-full shrink-0">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>100% Client-Side</span>
        </div>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools by name, task, or keyword (e.g. compress, merge, json, counter)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5DF] dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors border ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
            }`}
          >
            All Tools ({TOOLS.length})
          </button>
          {CATEGORIES.map((cat) => {
            const catCount = TOOLS.filter((t) => t.category === cat.id).length
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors border flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <DynamicIcon name={cat.icon} size={14} />
                <span>{cat.name} ({catCount})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center gap-3 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
          <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No tools found matching &ldquo;{searchQuery}&rdquo;
          </h2>
          <p className="text-xs text-slate-500 max-w-sm">
            Try adjusting your search query or reset your filters to see all available tools.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="group relative p-5 sm:p-6 rounded-2xl border border-[#E5E5DF] dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-[#1D4ED8] dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900 group-hover:scale-105 transition-transform">
                    <DynamicIcon name={tool.icon} size={20} />
                  </div>
                  {tool.badge && <Badge variant="cobalt">{tool.badge}</Badge>}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2 line-clamp-2">
                  {tool.shortDescription}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                <span className="uppercase tracking-wider text-[10px] text-slate-400 font-bold">
                  {tool.category}
                </span>
                <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllTools
