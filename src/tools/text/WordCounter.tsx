import React, { useState } from 'react'
import { Copy, Trash2, Clock, Mic } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { countText, type TextMetrics } from '../../lib/text'
import { useToast } from '../../components/ui/Toast'

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>(
    'The quick brown fox jumps over the lazy dog. Online tools that respect your privacy and execute purely on your device enable fast, secure workflows without third-party tracking.'
  )
  const { showToast } = useToast()

  const metrics: TextMetrics = countText(text)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    showToast('Copied to clipboard', 'Text content copied')
  }

  const handleClear = () => {
    setText('')
    showToast('Cleared', 'Editor emptied', 'info')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex flex-col gap-1 text-left">
          <span className="text-[11px] uppercase font-bold text-slate-400">Words</span>
          <span className="text-2xl font-extrabold text-[#1D4ED8] dark:text-blue-400 font-mono">
            {metrics.words.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex flex-col gap-1 text-left">
          <span className="text-[11px] uppercase font-bold text-slate-400">Characters</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
            {metrics.characters.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400">
            {metrics.charactersNoSpaces.toLocaleString()} without spaces
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex flex-col gap-1 text-left">
          <span className="text-[11px] uppercase font-bold text-slate-400">Sentences</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
            {metrics.sentences.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400">{metrics.paragraphs} paragraph(s)</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex flex-col gap-1 text-left">
          <span className="text-[11px] uppercase font-bold text-slate-400">Reading Time</span>
          <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xl font-extrabold font-mono">{metrics.readingTimeMinutes} min</span>
          </div>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Mic className="w-3 h-3 text-slate-400" /> Speaking: {metrics.speakingTimeMinutes} min
          </span>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="word-counter-textarea" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Type or Paste Text:
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              Copy Text
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Clear
            </Button>
          </div>
        </div>

        <textarea
          id="word-counter-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your content here..."
          rows={10}
          className="w-full p-4 rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-sans text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors resize-y leading-relaxed"
        />
      </div>

      {/* Top Keyword Frequency Breakdown */}
      {metrics.topWords.length > 0 && (
        <div className="p-4 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex flex-col gap-3 text-left">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Keyword Density &amp; Frequency:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {metrics.topWords.map((item) => (
              <div
                key={item.word}
                className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {item.word}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{item.count}×</span>
                </div>
                {/* Progress mini bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#1D4ED8] h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, item.percentage * 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
