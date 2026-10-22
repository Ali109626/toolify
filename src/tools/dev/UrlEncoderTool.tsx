import React, { useState, useMemo } from 'react'
import { Copy, Trash2, AlertCircle, Table } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Toggle } from '../../components/ui/Toggle'
import { encodeUrl, decodeUrl, parseQueryParams, type QueryParam } from '../../lib/dev'
import { useToast } from '../../components/ui/Toast'

export const UrlEncoderTool: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [inputText, setInputText] = useState<string>(
    'https://toolify.local/search?q=pdf merger & compression&source=browser#results'
  )
  const [componentMode, setComponentMode] = useState<boolean>(true)
  const { showToast } = useToast()

  let outputText = ''
  let errorMessage = ''

  if (mode === 'encode') {
    outputText = encodeUrl(inputText, componentMode)
  } else {
    const res = decodeUrl(inputText, componentMode)
    if (res.success && res.decoded !== undefined) {
      outputText = res.decoded
    } else {
      errorMessage = res.error || 'Failed to decode URI'
    }
  }

  const queryParams: QueryParam[] = useMemo(() => {
    return parseQueryParams(mode === 'encode' ? inputText : outputText)
  }, [inputText, outputText, mode])

  const handleCopy = (content: string, label: string) => {
    navigator.clipboard.writeText(content)
    showToast('Copied', `${label} copied to clipboard`)
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Configuration bar */}
      <div className="p-4 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setMode('encode')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                mode === 'encode'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Encode URL
            </button>
            <button
              type="button"
              onClick={() => setMode('decode')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                mode === 'decode'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Decode URL
            </button>
          </div>

          <Toggle
            label="Component Mode (encodeURIComponent)"
            description="Escapes all delimiters (&, =, ?, /) for query parameters"
            checked={componentMode}
            onChange={(checked) => setComponentMode(checked)}
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setInputText('')}
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
        >
          Clear
        </Button>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center gap-2.5 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Editor Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="url-input" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {mode === 'encode' ? 'Raw URL or Query String:' : 'Encoded URL:'}
          </label>
          <textarea
            id="url-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter URL to process..."
            rows={6}
            className="w-full p-4 rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors resize-y leading-relaxed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="url-output" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {mode === 'encode' ? 'Encoded Result:' : 'Decoded URL:'}
            </label>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCopy(outputText, 'URL')}
              disabled={!outputText}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              Copy
            </Button>
          </div>
          <textarea
            id="url-output"
            readOnly
            value={outputText}
            placeholder="Result will appear here..."
            rows={6}
            className="w-full p-4 rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none transition-colors resize-y leading-relaxed"
          />
        </div>
      </div>

      {/* Query Parameters Decomposition Table */}
      {queryParams.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Table className="w-4 h-4 text-blue-600" />
            <span>Extracted Query Parameters ({queryParams.length}):</span>
          </div>

          <div className="rounded-xl border border-[#E5E5DF] dark:border-slate-700 overflow-x-auto shadow-2xs">
            <table className="w-full text-xs text-left min-w-[380px]">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-[#E5E5DF] dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-4 w-1/3">Key</th>
                  <th className="py-2.5 px-4">Value</th>
                  <th className="py-2.5 px-4 w-16 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {queryParams.map((param, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {param.key}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-800 dark:text-slate-200 break-all">
                      {param.value}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleCopy(`${param.key}=${param.value}`, `${param.key}`)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Copy key-value"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
