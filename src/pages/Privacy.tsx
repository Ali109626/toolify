import React from 'react'
import { ShieldCheck } from 'lucide-react'
import { siteConfig } from '../config/site'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'
import { usePageMeta } from '../hooks/usePageMeta'

export const Privacy: React.FC = () => {
  usePageMeta('Privacy Policy — 100% Client-Side', 'How Toolify preserves complete user privacy and local processing.')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10 text-left">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Effective Date: October 2026</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {siteConfig.name} is built on a simple fundamental principle: **your personal data and documents belong to you, and we do not want them.**
        </p>
      </div>

      <div className="flex flex-col gap-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            1. Zero Server Uploads (Client-Side Architecture)
          </h2>
          <p>
            When you select or drop a file into any {siteConfig.name} tool (such as our PDF Merger, Image Compressor, or JSON Formatter), that file is loaded exclusively into your web browser&apos;s local process memory. At no point is the file transmitted over the network or stored on our servers.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            2. Local Storage Usage
          </h2>
          <p>
            {siteConfig.name} utilizes the standard HTML5 `localStorage` API strictly for non-sensitive usability enhancements, specifically:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
            <li>Remembering which tools you recently opened (storing only tool ID and name).</li>
            <li>Remembering your color theme preference (Light or Dark mode).</li>
          </ul>
          <p className="text-xs text-slate-500">
            No file contents, text snippets, or personal identification details are ever written to localStorage.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            3. Cookies &amp; Tracking
          </h2>
          <p>
            We do not use advertising tracking cookies, cross-site trackers, or third-party behavioral profiling scripts.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            4. Security of Processing
          </h2>
          <p>
            Because processing occurs inside your browser&apos;s sandboxed execution environment, you are protected by the same security protections enforced by your modern browser (Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge).
          </p>
        </section>
      </div>
    </div>
  )
}
