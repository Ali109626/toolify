import React from 'react'
import { Link } from 'react-router-dom'
import { Compass, ArrowRight, Home, Wrench } from 'lucide-react'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'
import { Button } from '../components/ui/Button'
import { CATEGORIES, TOOLS } from '../config/site'
import { DynamicIcon } from '../components/ui/DynamicIcon'
import { usePageMeta } from '../hooks/usePageMeta'

export const NotFound: React.FC = () => {
  usePageMeta('404 — Page Not Found', 'The requested page or tool could not be found.')

  const popularTools = TOOLS.filter((t) => t.badge === 'Popular' || t.badge === 'Essential').slice(0, 4)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 flex flex-col gap-10 text-left">
      <Breadcrumbs items={[{ label: '404 Not Found' }]} />

      {/* 404 Hero Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white flex flex-col items-start gap-5 shadow-xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
          <Compass className="w-4 h-4 text-blue-400" />
          <span>Error 404</span>
        </div>

        <div className="flex flex-col gap-2 max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The page, route, or tool you are trying to access does not exist or has moved. Explore our directory below to find what you need.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Back to Homepage
            </Button>
          </Link>
          <Link to="/tools">
            <Button variant="secondary" size="md" leftIcon={<Wrench className="w-4 h-4" />}>
              Browse All Tools
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Explore by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="p-3.5 rounded-xl border border-[#E5E5DF] dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-[#1D4ED8] dark:text-blue-400 flex items-center justify-center shrink-0">
                <DynamicIcon name={cat.icon} size={16} />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Tools */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Popular Online Utilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {popularTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="p-4 sm:p-5 rounded-2xl border border-[#E5E5DF] dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-[#1D4ED8] dark:text-blue-400 flex items-center justify-center shrink-0">
                  <DynamicIcon name={tool.icon} size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                    {tool.name}
                  </span>
                  <span className="text-[11px] text-slate-500 line-clamp-1">
                    {tool.shortDescription}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotFound
