import React from 'react'
import { ShieldCheck, Zap, Lock, Code2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../config/site'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'
import { usePageMeta } from '../hooks/usePageMeta'

export const About: React.FC = () => {
  usePageMeta('About Us & Architecture', 'Learn about the Toolify engineering principles and client-side architecture.')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10 text-left">
      <Breadcrumbs items={[{ label: 'About' }]} />

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          About {siteConfig.name}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {siteConfig.name} was created to challenge the status quo of online utilities. In modern web software, far too many tool websites secretly upload private PDF files, financial records, and personal photographs to remote cloud servers just to perform basic tasks like cropping or word counting.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D4ED8] dark:text-blue-300">
          <ShieldCheck className="w-4 h-4" />
          <span>Our Core Promise</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Your files never leave your device. Period.
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          By taking full advantage of modern web capabilities—such as the HTML5 Canvas API, Web Workers, Typed Arrays, and client-side PDF rendering—we process all data directly inside your local browser memory sandbox.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 mb-2">
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Instant Execution</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Eliminates conversion queues, upload wait times, and server latency. Instant response for your workflow.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 mb-2">
            <Lock className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Zero Telemetry</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No behavioral trackers, no user profiles, and no session recordings. What you process stays private.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 mb-2">
            <Code2 className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Human-Crafted Code</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Built with strict TypeScript, clean modular design, and robust client-side algorithms.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-[#E5E5DF] dark:border-slate-800">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>Explore all tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
