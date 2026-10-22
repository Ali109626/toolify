import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowRight, HelpCircle, BookOpen } from 'lucide-react'
import type { ToolItem } from '../../types'
import { CATEGORIES, TOOLS } from '../../config/site'
import { Breadcrumbs } from '../layout/Breadcrumbs'
import { Badge } from '../ui/Badge'
import { DynamicIcon } from '../ui/DynamicIcon'
import { useRecentTools } from '../../hooks/useRecentTools'
import { usePageMeta } from '../../hooks/usePageMeta'

interface ToolLayoutProps {
  tool: ToolItem
  children: React.ReactNode
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, children }) => {
  const { addRecent } = useRecentTools()
  usePageMeta(tool.name, tool.description)

  useEffect(() => {
    addRecent(tool.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [tool.id])

  const category = CATEGORIES.find((c) => c.id === tool.category)

  // Find related tools (same category or popular)
  const relatedTools = TOOLS.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  ).slice(0, 3)

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 text-left">
      {/* Top Breadcrumb & Metadata */}
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          items={[
            { label: category?.name || tool.category, path: `/category/${tool.category}` },
            { label: tool.name },
          ]}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-b border-[#E5E5DF] dark:border-slate-800 pb-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-[#1D4ED8] dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900 shadow-2xs">
              <DynamicIcon name={tool.icon} size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                  {tool.name}
                </h1>
                {tool.badge && <Badge variant="cobalt">{tool.badge}</Badge>}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {tool.shortDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 px-3 py-1.5 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>100% Client-Side Privacy</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Tool Workspace */}
      <div className="bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
        {children}
      </div>

      {/* How It Works Section */}
      {tool.howTo && tool.howTo.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-base">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h2>How to Use the {tool.name}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tool.howTo.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">{step.title}</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ & Related Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQs */}
        {tool.faqs && tool.faqs.length > 0 && (
          <section className="lg:col-span-2 bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-base">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
              {tool.faqs.map((faq, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-1.5">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <section className="bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col gap-4 self-start w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Related Tools
            </span>
            <div className="flex flex-col gap-2.5">
              {relatedTools.map((rt) => (
                <Link
                  key={rt.id}
                  to={rt.path}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#E5E5DF] dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/30 transition-all group"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <DynamicIcon name={rt.icon} size={16} className="text-blue-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors truncate">
                      {rt.name}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
