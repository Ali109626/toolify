import React, { useState } from 'react'
import { Copy, Trash2, ArrowDownUp } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { convertCase, type CaseFormat } from '../../lib/text'
import { useToast } from '../../components/ui/Toast'

interface CaseOption {
  format: CaseFormat
  label: string
  example: string
}

const CASE_OPTIONS: CaseOption[] = [
  { format: 'sentence', label: 'Sentence case', example: 'The quick brown fox.' },
  { format: 'title', label: 'Title Case', example: 'The Quick Brown Fox' },
  { format: 'upper', label: 'UPPERCASE', example: 'THE QUICK BROWN FOX' },
  { format: 'lower', label: 'lowercase', example: 'the quick brown fox' },
  { format: 'camel', label: 'camelCase', example: 'theQuickBrownFox' },
  { format: 'pascal', label: 'PascalCase', example: 'TheQuickBrownFox' },
  { format: 'snake', label: 'snake_case', example: 'the_quick_brown_fox' },
  { format: 'kebab', label: 'kebab-case', example: 'the-quick-brown-fox' },
  { format: 'constant', label: 'CONSTANT_CASE', example: 'THE_QUICK_BROWN_FOX' },
  { format: 'dot', label: 'dot.case', example: 'the.quick.brown.fox' },
]

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState<string>('Transform this text into any standard programming or editorial casing format.')
  const { showToast } = useToast()

  const copyToClipboard = (content: string, label: string) => {
    navigator.clipboard.writeText(content)
    showToast('Copied to clipboard', `Copied as ${label}`)
  }

  const applyInPlace = (format: CaseFormat) => {
    const transformed = convertCase(text, format)
    setText(transformed)
    showToast('Case transformed', format)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Editor Area */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="case-converter-textarea" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Source Text:
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyToClipboard(text, 'source text')}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setText('')}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Clear
            </Button>
          </div>
        </div>

        <textarea
          id="case-converter-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text to convert casing..."
          rows={5}
          className="w-full p-4 rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-sans text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors resize-y leading-relaxed"
        />
      </div>

      {/* Instant Action Toolbar */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
          <ArrowDownUp className="w-3.5 h-3.5" /> Transform:
        </span>
        {CASE_OPTIONS.map((opt) => (
          <button
            key={opt.format}
            type="button"
            onClick={() => applyInPlace(opt.format)}
            className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 font-medium transition-colors cursor-pointer"
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Converted formats cards grid with 1-click copy */}
      <div className="flex flex-col gap-3 text-left">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Live Formatted Outputs:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CASE_OPTIONS.map((opt) => {
            const formattedResult = convertCase(text, opt.format)
            return (
              <div
                key={opt.format}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex items-center justify-between gap-3 group"
              >
                <div className="flex flex-col overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">({opt.example})</span>
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-900 dark:text-slate-100 truncate mt-1">
                    {formattedResult || <span className="italic text-slate-400">Empty</span>}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copyToClipboard(formattedResult, opt.label)}
                  disabled={!formattedResult}
                  leftIcon={<Copy className="w-3 h-3" />}
                  className="shrink-0"
                >
                  Copy
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
