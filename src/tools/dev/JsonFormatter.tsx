import React, { useState } from 'react'
import { Copy, Download, Trash2, Check, AlertTriangle, Minimize2, Sparkles } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { Toggle } from '../../components/ui/Toggle'
import { formatJson, minifyJson, type JsonFormatResult } from '../../lib/dev'
import { useToast } from '../../components/ui/Toast'

export const JsonFormatter: React.FC = () => {
  const [inputJson, setInputJson] = useState<string>(
    `{\n  "tool": "Toolify",\n  "features": ["100% Client-Side", "Fast", "No Data Upload"],\n  "version": 1,\n  "settings": {\n    "theme": "auto",\n    "offlineReady": true\n  }\n}`
  )
  const [indent, setIndent] = useState<2 | 4 | 'tab'>(2)
  const [sortKeys, setSortKeys] = useState<boolean>(false)
  const [formatResult, setFormatResult] = useState<JsonFormatResult | null>(null)
  const { showToast } = useToast()

  const handleFormat = (jsonStr = inputJson, ind = indent, sort = sortKeys) => {
    const res = formatJson(jsonStr, ind, sort)
    setFormatResult(res)
    if (res.success && res.formatted) {
      setInputJson(res.formatted)
      showToast('JSON Formatted', `Beautified with ${ind} spaces`)
    } else if (!res.success && res.error) {
      showToast('Invalid JSON', res.error, 'error')
    }
  }

  const handleMinify = () => {
    const res = minifyJson(inputJson)
    if (res.success && res.minified) {
      setInputJson(res.minified)
      setFormatResult({ success: true, formatted: res.minified })
      showToast('JSON Minified', 'Removed all whitespace')
    } else if (res.error) {
      setFormatResult({ success: false, error: res.error })
      showToast('Minification failed', res.error, 'error')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inputJson)
    showToast('Copied to clipboard', 'JSON copied to clipboard')
  }

  const handleDownload = () => {
    const blob = new Blob([inputJson], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `data_${Date.now()}.json`
    link.click()
    showToast('Download started', link.download)
  }

  const loadSample = () => {
    const sample = JSON.stringify(
      {
        site: 'Toolify',
        status: 'production-ready',
        categories: ['image', 'pdf', 'text', 'dev', 'calc'],
        meta: {
          clientSide: true,
          secure: true,
          year: new Date().getFullYear(),
        },
      },
      null,
      indent === 'tab' ? '\t' : indent
    )
    setInputJson(sample)
    setFormatResult({ success: true, formatted: sample })
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Control bar */}
      <div className="p-4 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-40">
            <Select
              label="Indentation"
              value={indent}
              onChange={(e) => {
                const val = e.target.value === 'tab' ? 'tab' : (parseInt(e.target.value, 10) as 2 | 4)
                setIndent(val)
                handleFormat(inputJson, val, sortKeys)
              }}
              options={[
                { label: '2 Spaces', value: 2 },
                { label: '4 Spaces', value: 4 },
                { label: 'Tab indent', value: 'tab' },
              ]}
            />
          </div>

          <Toggle
            label="Sort Keys Alphabetically"
            checked={sortKeys}
            onChange={(checked) => {
              setSortKeys(checked)
              handleFormat(inputJson, indent, checked)
            }}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleFormat(inputJson, indent, sortKeys)}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Format &amp; Validate
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMinify}
            leftIcon={<Minimize2 className="w-3.5 h-3.5" />}
          >
            Minify
          </Button>
          <Button variant="ghost" size="sm" onClick={loadSample}>
            Sample
          </Button>
        </div>
      </div>

      {/* Syntax Error Diagnostic Alert */}
      {formatResult && !formatResult.success && formatResult.error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-bold">Syntax Error Detected:</span>
            <span>{formatResult.error}</span>
            {formatResult.line && (
              <span className="font-mono text-[11px] text-rose-600 dark:text-rose-400">
                Location: Line {formatResult.line}, Column {formatResult.column}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Success Diagnostic Pill */}
      {formatResult && formatResult.success && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Valid JSON structure. Ready for use.</span>
        </div>
      )}

      {/* Editor Area */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="json-editor-textarea" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            JSON Document:
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              Copy
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download .json
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setInputJson('')
                setFormatResult(null)
              }}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Clear
            </Button>
          </div>
        </div>

        <textarea
          id="json-editor-textarea"
          value={inputJson}
          onChange={(e) => {
            setInputJson(e.target.value)
            setFormatResult(null)
          }}
          placeholder="Paste or type raw JSON here..."
          rows={16}
          className="w-full p-4 rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors resize-y leading-relaxed"
        />
      </div>
    </div>
  )
}
