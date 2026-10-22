import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Heart, ArrowUpRight } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { siteConfig, CATEGORIES } from '../../config/site'

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[#E5E5DF] dark:border-slate-800 bg-[#F4F4F0] dark:bg-slate-950/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 flex flex-col gap-4 text-left">
            <Logo size="md" />
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Zero server uploads. 100% Client-Side.</span>
            </div>
          </div>

          {/* Categories Links */}
          <div className="flex flex-col gap-3 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Categories
            </span>
            <ul className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.id}`}
                    className="hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Trust */}
          <div className="flex flex-col gap-3 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Company
            </span>
            <ul className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/blog" className="hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors">
                  Guides &amp; Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors">
                  Help &amp; FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors">
                  Contact &amp; Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Legal &amp; Privacy
            </span>
            <ul className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/privacy" className="hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors"
                >
                  <span>Open Source</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#E5E5DF] dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Handcrafted for speed, utility, and absolute privacy.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for users worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
