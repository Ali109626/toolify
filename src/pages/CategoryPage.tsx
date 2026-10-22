import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { CATEGORIES, TOOLS } from '../config/site'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'
import { DynamicIcon } from '../components/ui/DynamicIcon'
import { Badge } from '../components/ui/Badge'
import { usePageMeta } from '../hooks/usePageMeta'
import { NotFound } from './NotFound'

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const category = CATEGORIES.find((c) => c.id === categoryId)

  usePageMeta(
    category ? `${category.name}` : 'Categories',
    category?.description || 'Browse online tools by category'
  )

  if (!category) {
    return <NotFound />
  }

  const categoryTools = TOOLS.filter((t) => t.category === category.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10 text-left">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-4">
        <Breadcrumbs items={[{ label: 'Categories' }, { label: category.name }]} />

        <div className="p-5 sm:p-8 md:p-10 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
              <DynamicIcon name={category.icon} size={28} />
            </div>
            <div className="flex flex-col gap-1.5">
              <h1 className="text-3xl font-extrabold tracking-tight">{category.name}</h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>100% Client-Side</span>
          </div>
        </div>
      </div>

      {/* Tools List */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DF] dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Available Tools ({categoryTools.length})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="group p-6 rounded-2xl border border-[#E5E5DF] dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all flex flex-col justify-between"
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

              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                <span>Launch tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
