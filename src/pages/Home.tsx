import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShieldCheck, Zap, ArrowRight, Clock, CheckCircle2, Lock } from 'lucide-react'
import { siteConfig, CATEGORIES, TOOLS } from '../config/site'
import { DynamicIcon } from '../components/ui/DynamicIcon'
import { Badge } from '../components/ui/Badge'
import { useRecentTools } from '../hooks/useRecentTools'
import { usePageMeta } from '../hooks/usePageMeta'
import type { CategoryType } from '../types'

export const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'all'>('all')
  const { recents, clearRecents } = useRecentTools()
  usePageMeta('Free, Fast & Private Online Tools', siteConfig.description)

  // Filter tools based on search and selected category
  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      tool.name.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.shortDescription.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q))
    return matchesCategory && matchesQuery
  })

  const featuredTools = TOOLS.filter((t) => t.badge === 'Popular' || t.badge === 'Essential')

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-12 md:pt-20 px-3.5 sm:px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Trust pill */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-[#1D4ED8] dark:text-blue-300 text-[11px] sm:text-xs font-semibold mb-6 shadow-2xs max-w-full text-center flex-wrap justify-center">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>100% Client-Side • Files stay securely on your device</span>
        </div>

        {/* Editorial headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 max-w-4xl leading-[1.14]">
          Everyday digital problem-solving, <br className="hidden sm:inline" />
          <span className="text-[#1D4ED8] dark:text-blue-400">right in your browser.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          High-performance tools for manipulating images, merging PDFs, transforming text, and developer utilities. Instant processing, zero servers, zero file uploads.
        </p>

        {/* Working Tool Search Field */}
        <div className="w-full max-w-2xl mt-8 relative">
          <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border border-[#E5E5DF] dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by name, task, or keyword (e.g., compress, merge, json, counter)..."
              className="w-full py-4 pl-3.5 pr-12 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center justify-center gap-2 flex-wrap mt-8">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
            }`}
          >
            All Tools ({TOOLS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              <DynamicIcon name={cat.icon} size={14} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recently Used Section (Only shown if user has used tools) */}
      {recents.length > 0 && searchQuery === '' && activeCategory === 'all' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E5DF] dark:border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Recently Used Tools
              </h2>
            </div>
            <button
              type="button"
              onClick={clearRecents}
              className="text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              Clear History
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {recents.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="p-3.5 rounded-xl border border-[#E5E5DF] dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xs transition-all flex flex-col gap-1 text-left group"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors truncate">
                  {item.name}
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  {item.category}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tools Directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5DF] dark:border-slate-800 mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {activeCategory === 'all'
                ? searchQuery
                  ? `Search Results (${filteredTools.length})`
                  : 'All Tools Directory'
                : `${CATEGORIES.find((c) => c.id === activeCategory)?.name} (${filteredTools.length})`}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select any tool to begin processing directly in your browser.
            </p>
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center gap-3 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
            <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No tools found matching &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Try a different keyword or reset your filters to see all available tools.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('all')
              }}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                className="group relative p-6 rounded-2xl border border-[#E5E5DF] dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all flex flex-col justify-between text-left"
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

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
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
      </section>

      {/* Featured Tools Spotlight */}
      {searchQuery === '' && activeCategory === 'all' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="p-5 sm:p-8 md:p-12 rounded-3xl bg-slate-900 text-white relative overflow-hidden flex flex-col gap-6 sm:gap-8 shadow-xl">
            <div className="flex flex-col gap-2 max-w-xl text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Core Highlights
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Privacy-first tools engineered for speed.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                No subscription plans, no sign-up gates, and no server uploads. Your data stays securely on your machine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {featuredTools.slice(0, 4).map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/80 transition-all flex flex-col gap-2 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <DynamicIcon name={tool.icon} size={18} className="text-blue-400" />
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <span className="text-xs font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                    {tool.name}
                  </span>
                  <span className="text-[11px] text-slate-400 line-clamp-2">
                    {tool.shortDescription}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Privacy Pledge Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Client-Side Privacy Guarantee
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Unlike traditional web services that silently upload your photos, financial documents, and sensitive PDFs to third-party cloud servers, {siteConfig.name} executes all computation right inside your browser session.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full text-left mt-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero Server Uploads</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your files never leave your computer. Web APIs (Canvas, Web Workers, WebAssembly) process everything in local memory.
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
              <Zap className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Instant Local Speed</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              No waiting in remote conversion queues or enduring slow network uploads and downloads. Everything finishes in milliseconds.
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
              <Lock className="w-4 h-4 text-purple-600 shrink-0" />
              <span>No Accounts Required</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              No email forms, no newsletters, and no passwords. Just open the tool and accomplish your task immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Helpful FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full text-left">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Common questions regarding privacy, compatibility, and file safety.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 rounded-2xl p-4 sm:p-8 divide-y divide-slate-100 dark:divide-slate-800">
          <div className="py-4 first:pt-0 flex flex-col gap-1.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Are my files safe?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes, absolutely. All file processing (including PDF merging, image compression, and text manipulation) runs strictly on your machine using standard browser APIs. No file ever travels across the internet or touches our servers.
            </p>
          </div>

          <div className="py-4 flex flex-col gap-1.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Is {siteConfig.name} free to use?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes. All tools are 100% free with no hidden fees, subscriptions, or file quantity restrictions.
            </p>
          </div>

          <div className="py-4 flex flex-col gap-1.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Can I use these tools offline?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Once the web page is loaded into your browser cache, the tool scripts execute completely offline without requiring an active internet connection.
            </p>
          </div>

          <div className="py-4 last:pb-0 flex flex-col gap-1.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Are there limits on file sizes?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Limits are determined solely by your device&apos;s available memory (RAM). Most modern laptops and phones comfortably handle PDFs and photos up to 50MB-100MB directly in the browser.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
