import React, { useState, useMemo } from 'react'
import { ArrowLeftRight, Plus, Minus, Equal } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { computeDiff, type DiffResult } from '../../lib/text'
import { useToast } from '../../components/ui/Toast'

export const TextDiff: React.FC = () => {
  const [oldText, setOldText] = useState<string>(
    `function calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}`
  )
  const [newText, setNewText] = useState<string>(
    `function calculateTotal(items, discountRate = 0) {\n  let total = items.reduce((sum, item) => sum + item.price, 0);\n  if (discountRate > 0) {\n    total -= total * discountRate;\n  }\n  return total;\n}`
  )

  const [mode, setMode] = useState<'words' | 'chars' | 'lines'>('lines')
  const [view, setView] = useState<'split' | 'unified'>('split')
  const { showToast } = useToast()

  const diff: DiffResult = useMemo(() => {
    return computeDiff(oldText, newText, mode)
  }, [oldText, newText, mode])

  const handleSwap = () => {
    const temp = oldText
    setOldText(newText)
    setNewText(temp)
    showToast('Texts swapped', 'Original and Modified inverted')
  }

  const loadSample = () => {
    setOldText(
      'The client-side platform guarantees privacy.\nAll computations execute locally.\nNo server logs.'
    )
    setNewText(
      'The client-side platform guarantees 100% privacy.\nAll computations execute locally in your web browser.\nZero server logs and zero telemetry.'
    )
    showToast('Sample loaded', 'Comparative sample active')
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Top Toolbar */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        {/* Granularity & View Mode */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mr-1">
            Compare By:
          </span>
          {(['lines', 'words', 'chars'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                mode === m
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}

          <span className="text-slate-300 dark:text-slate-600 mx-1">|</span>

          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mr-1">
            Layout:
          </span>
          {(['split', 'unified'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                view === v
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              {v === 'split' ? 'Side-by-Side' : 'Unified'}
            </button>
          ))}
        </div>

        {/* Quick Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSwap}
            leftIcon={<ArrowLeftRight className="w-3.5 h-3.5" />}
          >
            Swap Texts
          </Button>
          <Button variant="ghost" size="sm" onClick={loadSample}>
            Load Sample
          </Button>
        </div>
      </div>

      {/* Diff Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Additions</span>
          </div>
          <span className="text-base font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
            +{diff.additions}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300">
            <Minus className="w-4 h-4 text-rose-600" />
            <span>Deletions</span>
          </div>
          <span className="text-base font-extrabold font-mono text-rose-700 dark:text-rose-300">
            -{diff.deletions}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Equal className="w-4 h-4 text-slate-500" />
            <span>Unchanged</span>
          </div>
          <span className="text-base font-extrabold font-mono text-slate-700 dark:text-slate-300">
            {diff.unchanged}
          </span>
        </div>
      </div>

      {/* Inputs (Side-by-Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="diff-original-textarea" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Original Text:
          </label>
          <textarea
            id="diff-original-textarea"
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            rows={7}
            className="w-full p-3.5 rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-y"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="diff-modified-textarea" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Modified Text:
          </label>
          <textarea
            id="diff-modified-textarea"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={7}
            className="w-full p-3.5 rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-y"
          />
        </div>
      </div>

      {/* Difference Visualizer */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Visual Difference View:
        </span>
        <div className="p-4 rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs leading-relaxed overflow-x-auto min-h-[140px] whitespace-pre-wrap">
          {diff.changes.map((part, index) => {
            if (part.added) {
              return (
                <span
                  key={index}
                  className="bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 px-0.5 rounded font-semibold border-b-2 border-emerald-500"
                >
                  {part.value}
                </span>
              )
            }
            if (part.removed) {
              return (
                <span
                  key={index}
                  className="bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 px-0.5 rounded line-through opacity-80 border-b-2 border-rose-500"
                >
                  {part.value}
                </span>
              )
            }
            return (
              <span key={index} className="text-slate-700 dark:text-slate-300">
                {part.value}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
