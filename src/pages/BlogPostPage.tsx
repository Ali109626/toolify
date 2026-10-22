import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Info,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  Share2,
  Check,
  List
} from 'lucide-react'
import { BLOG_POSTS, BLOG_CATEGORIES } from '../data/blogPosts'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'
import { NotFound } from './NotFound'
import { usePageMeta } from '../hooks/usePageMeta'
import { useToast } from '../components/ui/Toast'
import { CategoryBadge } from '../components/blog/CategoryBadge'

import { siteConfig } from '../config/site'

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { showToast } = useToast()
  const [copiedLink, setCopiedLink] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const post = BLOG_POSTS.find((p) => p.slug === slug && p.status === 'published')

  // Dynamic SEO & Structured Data
  const structuredData = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.metaDescription,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: {
          '@type': 'Organization',
          name: post.author.name,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Toolify',
          url: siteConfig.url,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${siteConfig.url}/blog/${post.slug}`,
        },
      }
    : undefined

  usePageMeta(post?.seoTitle || post?.title, post?.metaDescription, {
    canonicalPath: post ? `/blog/${post.slug}` : undefined,
    ogType: 'article',
    structuredData,
  })

  if (!post) {
    return <NotFound />
  }

  const categoryObj = BLOG_CATEGORIES.find((c) => c.id === post.category)

  // Related posts
  const relatedPosts = BLOG_POSTS.filter((p) =>
    post.relatedSlugs.includes(p.slug) && p.status === 'published'
  )

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        setCopiedLink(true)
        showToast('Article URL copied to clipboard!', 'success')
        setTimeout(() => setCopiedLink(false), 2000)
      }
    } catch {
      showToast('Could not copy link', 'info')
    }
  }

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-10 text-left">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Blog', path: '/blog' },
          { label: categoryObj?.name || 'Category', path: `/blog/category/${post.category}` },
          { label: post.title },
        ]}
      />

      {/* Header / Hero */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CategoryBadge category={post.category} size="md" showIcon asLink />

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published {post.publishedAt}</span>
            </span>
            {post.updatedAt && (
              <span className="hidden sm:inline-block text-slate-400">
                • Updated {post.updatedAt}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readingTimeMinutes} min read</span>
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {post.excerpt}
        </p>

        {/* Author & Privacy Seal */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
              TF
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {post.author.name}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {post.author.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Verified Client-Side</span>
            </div>
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1 border border-slate-200 dark:border-slate-700"
              title="Share or copy article link"
              aria-label="Share article"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Table of Contents + Article Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Table of Contents Sidebar (sticky on desktop) */}
        <aside className="lg:col-span-4 order-2 lg:order-1">
          <div className="lg:sticky lg:top-24 rounded-2xl border border-[#E5E5DF] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              <List className="w-4 h-4 text-blue-500" />
              <span>In This Article</span>
            </div>
            <nav className="flex flex-col gap-1.5 text-xs">
              {post.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors leading-snug"
                >
                  {section.title}
                </a>
              ))}
              {post.limitations && (
                <a
                  href="#limitations"
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  Important Limitations
                </a>
              )}
              {post.faqs && post.faqs.length > 0 && (
                <a
                  href="#faqs"
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  Frequently Asked Questions
                </a>
              )}
            </nav>

            {/* Direct Tool CTA widget */}
            {post.toolCta && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Featured Free Utility
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {post.toolCta.tagline}
                </p>
                <Link
                  to={post.toolCta.toolPath}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold text-center transition-colors shadow-sm shadow-blue-500/20"
                >
                  {post.toolCta.buttonText}
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Article Body Content */}
        <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col gap-8 text-slate-800 dark:text-slate-200">
          {/* Introduction Paragraphs */}
          <div className="flex flex-col gap-4 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
            {post.introduction.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Section Items */}
          {post.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 flex flex-col gap-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800/80">
                {section.title}
              </h2>

              <div className="flex flex-col gap-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {section.content.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Callout Card */}
              {section.callout && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 my-2 text-xs sm:text-sm leading-relaxed ${
                    section.callout.type === 'tip'
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200'
                      : section.callout.type === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {section.callout.type === 'tip' && <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />}
                  {section.callout.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />}
                  {section.callout.type === 'info' && <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />}
                  <div>{section.callout.text}</div>
                </div>
              )}

              {/* Step by Step Breakdown */}
              {section.steps && section.steps.length > 0 && (
                <div className="flex flex-col gap-4 my-2">
                  {section.steps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 flex items-start gap-4 shadow-2xs"
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {sIdx + 1}
                      </div>
                      <div className="flex flex-col gap-1.5 text-left">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {step.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {step.description}
                        </p>
                        {step.tip && (
                          <div className="text-[11px] sm:text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                            💡 Tip: {step.tip}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Code Snippet */}
              {section.codeSnippet && (
                <div className="my-2 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 text-slate-200 text-xs font-mono">
                  <div className="px-4 py-2 border-b border-slate-800 bg-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="uppercase">{section.codeSnippet.language}</span>
                    <span>Example</span>
                  </div>
                  <pre className="p-4 overflow-x-auto leading-relaxed">
                    <code>{section.codeSnippet.code}</code>
                  </pre>
                  {section.codeSnippet.caption && (
                    <div className="px-4 py-2 text-[11px] text-slate-400 bg-slate-900/50 border-t border-slate-900">
                      {section.codeSnippet.caption}
                    </div>
                  )}
                </div>
              )}
            </section>
          ))}

          {/* Limitations Section */}
          {post.limitations && post.limitations.length > 0 && (
            <section id="limitations" className="scroll-mt-24 flex flex-col gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Important Limitations &amp; Best Practices</span>
              </h2>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc pl-5">
                {post.limitations.map((limit, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {limit}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQs Section */}
          {post.faqs && post.faqs.length > 0 && (
            <section id="faqs" className="scroll-mt-24 flex flex-col gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                <span>Frequently Asked Questions</span>
              </h2>

              <div className="flex flex-col gap-2.5">
                {post.faqs.map((faq, fIdx) => {
                  const isOpen = openFaqIndex === fIdx
                  return (
                    <div
                      key={fIdx}
                      className="rounded-xl border border-[#E5E5DF] dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Bottom Tool CTA Banner */}
          {post.toolCta && (
            <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/60 to-slate-900 border border-blue-800/80 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Ready to put this into practice?
                </span>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {post.toolCta.toolName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                  {post.toolCta.tagline}
                </p>
              </div>

              <Link
                to={post.toolCta.toolPath}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/30 whitespace-nowrap"
              >
                {post.toolCta.buttonText} →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Related Articles Row */}
      {relatedPosts.length > 0 && (
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Related Tutorials &amp; Guides
            </h3>
            <Link
              to="/blog"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Explore all articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((rel) => {
              return (
                <Link
                  key={rel.slug}
                  to={`/blog/${rel.slug}`}
                  className="group p-5 rounded-2xl border border-[#E5E5DF] dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/40 hover:shadow-lg transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-col gap-2">
                    <CategoryBadge category={rel.category} size="sm" />
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {rel.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>{rel.readingTimeMinutes} min read</span>
                    <span className="font-bold text-blue-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Back to Blog Button */}
      <div className="pt-4">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all guides</span>
        </Link>
      </div>
    </article>
  )
}
export default BlogPostPage
