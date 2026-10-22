import React, { useState, useMemo } from 'react'
import { Copy, Download, Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Toggle } from '../../components/ui/Toggle'
import { Select } from '../../components/ui/Select'
import { cleanLines, type CleanLinesOptions } from '../../lib/text'
import { useToast } from '../../components/ui/Toast'

export const LineCleaner: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    `apple\n  banana  \napple\n\ncherry\nbanana\n  date  \n`
  )

  const [options, setOptions] = useState<CleanLinesOptions>({
    removeDuplicates: true,
    trimLines: true,
    collapseSpaces: true,
    removeEmptyLines: true,
    caseSensitive: false,
    sortMode: 'asc',
  })

  const { showToast } = useToast()

  const result = useMemo(() => {
    return cleanLines(inputText, options)
  }, [inputText, options])

  const handleCopy = () => {
    navigator.clipboard.writeText(result.text)
    showToast('Copied to clipboard', 'Cleaned text copied')
  }

  const handleDownload = () => {
    const blob = new Blob([result.text], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `cleaned_text_${Date.now()}.txt`
    link.click()
    showToast('Download started', link.download)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Configuration Options */}
      <div className="p-4 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        <Toggle
          label="Remove Duplicate Lines"
          description="Keep only the first occurrence of identical lines"
          checked={options.removeDuplicates}
          onChange={(checked) => setOptions((prev) => ({ ...prev, removeDuplicates: checked }))}
        />

        <Toggle
          label="Trim Line Whitespace"
          description="Remove leading and trailing spaces per line"
          checked={options.trimLines}
          onChange={(checked) => setOptions((prev) => ({ ...prev, trimLines: checked }))}
        />

        <Toggle
          label="Remove Empty Lines"
          description="Strip out all blank or whitespace-only lines"
          checked={options.removeEmptyLines}
          onChange={(checked) => setOptions((prev) => ({ ...prev, removeEmptyLines: checked }))}
        />

        <Toggle
          label="Collapse Spaces"
          description="Replace consecutive spaces with a single space"
          checked={options.collapseSpaces}
          onChange={(checked) => setOptions((prev) => ({ ...prev, collapseSpaces: checked }))}
        />

        <Toggle
          label="Case Sensitive Matching"
          description="Treat 'Apple' and 'apple' as different lines"
          checked={options.caseSensitive}
          onChange={(checked) => setOptions((prev) => ({ ...prev, caseSensitive: checked }))}
        />

        <Select
          label="Sort Lines"
          value={options.sortMode}
          onChange={(e) =>
            setOptions((prev) => ({
              ...prev,
              sortMode: e.target.value as 'none' | 'asc' | 'desc' | 'length',
            }))
          }
          options={[
            { label: 'Do not sort (Preserve order)', value: 'none' },
            { label: 'Alphabetical (A to Z)', value: 'asc' },
            { label: 'Reverse Alphabetical (Z to A)', value: 'desc' },
            { label: 'By Line Length (Short to Long)', value: 'length' },
          ]}
        />
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-1 text-left">
          <span className="text-[11px] font-bold uppercase text-slate-400">Original Lines</span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
            {result.originalLines}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-1 text-left">
          <span className="text-[11px] font-bold uppercase text-slate-400">Cleaned Lines</span>
          <span className="text-xl font-bold font-mono text-[#1D4ED8] dark:text-blue-400">
            {result.cleanedLines}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-1 text-left">
          <span className="text-[11px] font-bold uppercase text-slate-400">Duplicates Removed</span>
          <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {result.duplicatesRemoved}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-1 text-left">
          <span className="text-[11px] font-bold uppercase text-slate-400">Empty Lines Removed</span>
          <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {result.emptyLinesRemoved}
          </span>
        </div>
      </div>

      {/* Side-by-Side Text Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="line-cleaner-input" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Input Text:
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInputText('')}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Clear
            </Button>
          </div>
          <textarea
            id="line-cleaner-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text with duplicates or trailing spaces..."
            rows={10}
            className="w-full p-4 rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors resize-y leading-relaxed"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="line-cleaner-output" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Sanitized Output:
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                disabled={!result.text}
                leftIcon={<Copy className="w-3.5 h-3.5" />}
              >
                Copy
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownload}
                disabled={!result.text}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download
              </Button>
            </div>
          </div>
          <textarea
            id="line-cleaner-output"
            readOnly
            value={result.text}
            placeholder="Sanitized lines will appear here in real time..."
            rows={10}
            className="w-full p-4 rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none transition-colors resize-y leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}
