import React from 'react'
import { siteConfig } from '../config/site'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'
import { usePageMeta } from '../hooks/usePageMeta'

export const Terms: React.FC = () => {
  usePageMeta('Terms of Service', 'Terms of service governing use of Toolify online utilities.')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10 text-left">
      <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Please review the simple terms governing your use of the {siteConfig.name} platform.
        </p>
      </div>

      <div className="flex flex-col gap-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using {siteConfig.name}, you agree to use the utilities lawfully and in compliance with all relevant local and international regulations.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            2. License &amp; Fair Use
          </h2>
          <p>
            You are granted a free, non-exclusive license to use these browser tools for personal, educational, and commercial purposes without royalties or fees.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            3. Disclaimer of Warranties
          </h2>
          <p>
            The software utilities are provided &ldquo;as is&rdquo;, without warranty of any kind, express or implied. While we strive for rigorous precision in all mathematical and format conversions, we recommend validating mission-critical outputs before final deployment.
          </p>
        </section>
      </div>
    </div>
  )
}
