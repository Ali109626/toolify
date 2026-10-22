import React, { useState } from 'react'
import { Copy, Trash2, FileUp, AlertCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Toggle } from '../../components/ui/Toggle'
import { encodeBase64, decodeBase64, fileToBase64 } from '../../lib/dev'
import { useToast } from '../../components/ui/Toast'

export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [inputText, setInputText] = useState<string>('Hello Toolify! 🚀 100% Client-Side Privacy.')
  const [urlSafe, setUrlSafe] = useState<boolean>(false)
  const { showToast } = useToast()

  // Compute output
  let outputText = ''
  let errorMessage = ''

  if (mode === 'encode') {
    outputText = encodeBase64(inputText, urlSafe)
  } else {
    const res = decodeBase64(inputText, urlSafe)
    if (res.success && res.decoded !== undefined) {
      outputText = res.decoded
    } else {
      errorMessage = res.error || 'Failed to decode invalid Base64 input'
    }
  }

  const handleCopy = () => {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
    showToast('Copied to clipboard', 'Base64 string copied')
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToBase64(file)
      setInputText(dataUrl)
      setMode('decode')
      showToast('File loaded', `Loaded ${file.name} as Base64 Data URL`)
    } catch {
      showToast('File read failed', 'Could not read file', 'error')
    }
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Top Options Bar */}
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
              Encode (Text → Base64)
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
              Decode (Base64 → Text)
            </button>
          </div>

          <Toggle
            label="URL-Safe Base64"
            description="Replace + with - and / with _"
            checked={urlSafe}
            onChange={(checked) => setUrlSafe(checked)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors">
            <FileUp className="w-3.5 h-3.5" />
            <span>File to Base64</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
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
      </div>

      {/* Error alert if decode fails */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center gap-2.5 text-xs text-rose-800 dark:text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Input / Output Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="base64-input" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {mode === 'encode' ? 'Plain Text / Unicode Input:' : 'Base64 Input String:'}
          </label>
          <textarea
            id="base64-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'encode' ? 'Type or paste text to encode...' : 'Paste Base64 string to decode...'}
            rows={10}
            className="w-full p-4 rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors resize-y leading-relaxed"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="base64-output" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {mode === 'encode' ? 'Base64 Output:' : 'Decoded Plain Text:'}
            </label>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              disabled={!outputText}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              Copy Result
            </Button>
          </div>
          <textarea
            id="base64-output"
            readOnly
            value={outputText}
            placeholder="Result will appear here..."
            rows={10}
            className="w-full p-4 rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none transition-colors resize-y leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}
