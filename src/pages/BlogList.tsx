import React, { useState, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Search, Calendar, Clock, ArrowRight, BookOpen, Sparkles, Filter, X } from 'lucide-react'
import { BLOG_CATEGORIES, BLOG_POSTS } from '../data/blogPosts'
import { DynamicIcon } from '../components/ui/DynamicIcon'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'
import { usePageMeta } from '../hooks/usePageMeta'
import { CategoryBadge } from '../components/blog/CategoryBadge'
import type { BlogCategoryId } from '../types/blog'

export const BlogList: React.FC = () => {
  const { category: routeCategory } = useParams<{ category?: string }>()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // Determine active category from route
  const activeCategory = routeCategory as BlogCategoryId | undefined
  const currentCategoryObj = BLOG_CATEGORIES.find((c) => c.id === activeCategory)

  // Filter only published articles
  const publishedPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => post.status === 'published')
  }, [])

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return publishedPosts.filter((post) => {
      const matchesCategory = !activeCategory || post.category === activeCategory
      const query = searchQuery.toLowerCase().trim()
      if (!query) return matchesCategory

      const matchesSearch =
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [publishedPosts, activeCategory, searchQuery])

  // Featured post (first featured published post, or first overall if category filtered)
  const featuredPost = useMemo(() => {
    if (activeCategory || searchQuery) return null
    return publishedPosts.find((p) => p.featured) || publishedPosts[0]
  }, [publishedPosts, activeCategory, searchQuery])

  // Regular posts grid (excluding featured if featured is displayed)
  const gridPosts = useMemo(() => {
    if (featuredPost) {
      return filteredPosts.filter((p) => p.slug !== featuredPost.slug)
    }
    return filteredPosts
  }, [filteredPosts, featuredPost])

  // Dynamic SEO meta
  const pageTitle = currentCategoryObj
    ? `${currentCategoryObj.name} Guides & Tutorials`
    : 'Guides, Tutorials & Technical Walkthroughs'
  const pageDesc = currentCategoryObj
    ? currentCategoryObj.description
    : 'In-depth, practical guides for document manipulation, image optimization, developer debugging, and productivity tools with 100% client-side privacy.'

  usePageMeta(pageTitle, pageDesc, {
    canonicalPath: activeCategory ? `/blog/category/${activeCategory}` : '/blog',
    ogType: 'website',
  })

  const handleCategoryClick = (catId: string | null) => {
    if (!catId) {
      navigate('/blog')
    } else {
      navigate(`/blog/category/${catId}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-10 text-left">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={
          currentCategoryObj
            ? [{ label: 'Blog', path: '/blog' }, { label: currentCategoryObj.name }]
            : [{ label: 'Blog' }]
        }
      />

      {/* Header & Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-semibold w-fit">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Toolify Knowledge Base</span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {currentCategoryObj ? currentCategoryObj.name : 'Engineering & Practical Guides'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {currentCategoryObj
                ? currentCategoryObj.description
                : 'Clear, step-by-step tutorials on document processing, image optimization, developer workflows, and practical math. Written by engineers, with zero server uploads.'}
            </p>
          </div>

          {/* Search bar inside hero */}
          <div className="relative max-w-xl w-full mt-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutorials by topic, keywords, or format..."
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by Category</span>
          </div>
          {activeCategory && (
            <button
              type="button"
              onClick={() => handleCategoryClick(null)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View all categories</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategoryClick(null)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              !activeCategory
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>All Guides</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                !activeCategory
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {publishedPosts.length}
            </span>
          </button>

          {BLOG_CATEGORIES.map((cat) => {
            const count = publishedPosts.filter((p) => p.category === cat.id).length
            const isSelected = activeCategory === cat.id

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(isSelected ? null : cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <DynamicIcon name={cat.icon} size={14} className={isSelected ? 'text-white' : 'text-blue-500'} />
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Featured Article Section (When no active filter/search) */}
      {featuredPost && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span>Featured Editorial</span>
          </div>

          <div className="group relative rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all p-6 sm:p-8 md:p-10 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex flex-col gap-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <CategoryBadge category={featuredPost.category} size="sm" asLink />
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{featuredPost.publishedAt}</span>
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{featuredPost.readingTimeMinutes} min read</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight group-hover:text-blue-400 transition-colors">
                <Link to={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30"
                >
                  <span>Read Complete Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {featuredPost.toolCta && (
                  <Link
                    to={featuredPost.toolCta.toolPath}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
                  >
                    <span>Try Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </Link>
                )}
              </div>
            </div>

            {/* Visual Illustrative Thumbnail */}
            <div className={`w-full lg:w-72 h-44 sm:h-52 rounded-2xl bg-gradient-to-br ${featuredPost.thumbnailGradient.from} ${featuredPost.thumbnailGradient.to} border border-slate-800 flex flex-col items-center justify-center gap-3 p-6 shrink-0`}>
              <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-red-400 shadow-lg">
                <DynamicIcon name={featuredPost.thumbnailGradient.icon} size={32} />
              </div>
              <span className="text-xs font-semibold text-slate-300">100% Client-Side Tutorial</span>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DF] dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {currentCategoryObj ? `${currentCategoryObj.name} Articles` : 'All Articles'} ({gridPosts.length})
          </span>
          {searchQuery && (
            <span className="text-xs text-slate-400">
              Filtering by &quot;{searchQuery}&quot;
            </span>
          )}
        </div>

        {gridPosts.length === 0 ? (
          <div className="py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No articles found</h3>
              <p className="text-xs text-slate-500">
                No published articles matched your search query. Try searching for different keywords or reset your filters.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                handleCategoryClick(null)
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post) => {
              return (
                <article
                  key={post.slug}
                  className="group flex flex-col rounded-2xl border border-[#E5E5DF] dark:border-slate-800/80 bg-white dark:bg-slate-900/90 hover:border-blue-500/40 hover:shadow-xl dark:hover:shadow-blue-950/20 transition-all overflow-hidden"
                >
                  {/* Article Card Thumbnail Banner */}
                  <div className={`h-36 w-full bg-gradient-to-br ${post.thumbnailGradient.from} ${post.thumbnailGradient.to} flex items-center justify-center border-b border-[#E5E5DF] dark:border-slate-800 relative`}>
                    <div className="w-12 h-12 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-blue-500 shadow-md group-hover:scale-105 transition-transform">
                      <DynamicIcon name={post.thumbnailGradient.icon} size={24} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-2.5">
                      {/* Meta badge row */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
                        <CategoryBadge category={post.category} size="sm" asLink />
                        <div className="flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>{post.readingTimeMinutes} min</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Footer link & date */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{post.publishedAt}</span>
                      </span>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Read guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
export default BlogList
