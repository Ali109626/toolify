import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { siteConfig } from '../config/site'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'
import { usePageMeta } from '../hooks/usePageMeta'

interface FaqItem {
  q: string
  a: string
  category: string
}

const FAQ_LIST: FaqItem[] = [
  {
    category: 'Privacy & Security',
    q: 'How does client-side processing ensure 100% privacy?',
    a: 'Traditional services upload your file to an Amazon AWS or Google Cloud server, process it remotely, and send back a download link. Toolify uses modern browser APIs (HTML5 Canvas, TypedArrays, pdf-lib) that execute locally on your processor. Your files never cross the network.',
  },
  {
    category: 'Privacy & Security',
    q: 'Do you keep logs of what I convert or calculate?',
    a: 'No. We do not maintain any database or server log of files or content processed through the tools.',
  },
  {
    category: 'Usage & Compatibility',
    q: 'Can I use Toolify on my phone or tablet?',
    a: 'Yes! Toolify is fully responsive and optimized for mobile devices, iPhones, iPads, and Android phones.',
  },
  {
    category: 'Usage & Compatibility',
    q: 'What is the maximum file size I can process?',
    a: 'Because processing occurs in your browser RAM, limits depend on your device memory. For desktop computers, files up to 100MB process seamlessly. For mobile devices, we recommend keeping individual files under 30MB.',
  },
  {
    category: 'PDF & Images',
    q: 'Will merging PDFs reduce text quality?',
    a: 'No. Toolify merges PDFs losslessly at the binary document object level without rasterizing or compressing vector text and embedded fonts.',
  },
  {
    category: 'PDF & Images',
    q: 'Can I convert transparent PNGs to JPEG without dark borders?',
    a: 'Yes. Our image converter automatically composites transparent pixels onto a pure white background to avoid dark artifacts.',
  },
  {
    category: 'Costs & Licenses',
    q: 'Are there any hidden fees or daily limits?',
    a: 'No. All tools are completely free for personal and commercial usage with zero quotas.',
  },
]

export const FaqPage: React.FC = () => {
  const [filter, setFilter] = useState('')
  usePageMeta('Help & FAQs', 'Frequently asked questions regarding file security, privacy, and browser tools.')

  const filteredFaqs = FAQ_LIST.filter(
    (item) =>
      item.q.toLowerCase().includes(filter.toLowerCase()) ||
      item.a.toLowerCase().includes(filter.toLowerCase()) ||
      item.category.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10 text-left">
      <Breadcrumbs items={[{ label: 'Help & FAQs' }]} />

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Help &amp; Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Everything you need to know about how {siteConfig.name} operates, safeguards your privacy, and runs locally.
        </p>

        {/* Search filter */}
        <div className="relative mt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search FAQs by topic or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filteredFaqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 flex flex-col gap-2 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {faq.category}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {faq.q}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
