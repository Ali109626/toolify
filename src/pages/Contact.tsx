import React, { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { siteConfig, TOOLS } from '../config/site'
import { Breadcrumbs } from '../components/layout/Breadcrumbs'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { usePageMeta } from '../hooks/usePageMeta'
import { useToast } from '../components/ui/Toast'

export const Contact: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [toolRelated, setToolRelated] = useState('general')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { showToast } = useToast()

  usePageMeta('Contact & Feedback', 'Send suggestions, report an issue, or suggest a new tool for Toolify.')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      showToast('Validation Error', 'Please complete all required fields.', 'error')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      showToast('Feedback Received', 'Thank you for reaching out!')
    }, 600)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10 text-left">
      <Breadcrumbs items={[{ label: 'Contact & Feedback' }]} />

      <div className="flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Contact &amp; Feedback
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Have an idea for a new tool? Found a bug? We read every submission from our community.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center flex flex-col items-center gap-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
            Message Received!
          </h2>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-sm">
            Thank you for helping us improve {siteConfig.name}. Our product team reviews all user inquiries.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSubmitted(false)
              setMessage('')
            }}
            className="mt-2"
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-800 flex flex-col gap-5 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Name *"
              placeholder="e.g. Alex Chen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address *"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Select
            label="Inquiry / Related Tool"
            value={toolRelated}
            onChange={(e) => setToolRelated(e.target.value)}
            options={[
              { label: 'General Feedback or Suggestion', value: 'general' },
              { label: 'Feature Request / New Tool Idea', value: 'feature' },
              { label: 'Bug Report', value: 'bug' },
              ...TOOLS.map((t) => ({ label: `Tool: ${t.name}`, value: t.id })),
            ]}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-message" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Message or Details *
            </label>
            <textarea
              id="contact-message"
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you like, what needs improvement, or what new tool you need..."
              className="w-full p-3.5 rounded-lg border border-[#E5E5DF] dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            leftIcon={<Send className="w-4 h-4" />}
            className="self-start mt-2"
          >
            Send Message
          </Button>
        </form>
      )}
    </div>
  )
}
