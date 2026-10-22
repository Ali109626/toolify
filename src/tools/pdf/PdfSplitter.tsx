import React, { useState } from 'react'
import { Scissors, Download, FileArchive, Check, FileText } from 'lucide-react'
import JSZip from 'jszip'
import { FileUploadZone } from '../../components/ui/FileUploadZone'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { getPdfPageCount, splitPdfByRanges, type SplitResult } from '../../lib/pdf'
import { formatBytes } from '../../lib/image'
import { useToast } from '../../components/ui/Toast'

export const PdfSplitter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [rangeInput, setRangeInput] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [splitResults, setSplitResults] = useState<SplitResult[]>([])
  const { showToast } = useToast()

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return
    const file = files[0]
    setSelectedFile(file)
    setSplitResults([])

    try {
      const count = await getPdfPageCount(file)
      setTotalPages(count)
      setRangeInput(count > 1 ? `1-${Math.ceil(count / 2)}, ${Math.ceil(count / 2) + 1}-${count}` : '1')
    } catch (err: unknown) {
      showToast('Error loading PDF', (err as Error).message, 'error')
    }
  }

  const handleSplit = async () => {
    if (!selectedFile || !rangeInput.trim()) return
    setIsProcessing(true)

    try {
      const results = await splitPdfByRanges(selectedFile, rangeInput)
      setSplitResults(results)
      showToast('PDF Split Successful', `Generated ${results.length} document(s)`)
    } catch (err: unknown) {
      showToast('Split failed', (err as Error).message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadSingle = (res: SplitResult) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blob = new Blob([res.bytes as any], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = res.name
    link.click()
    showToast('Download started', res.name)
  }

  const downloadAllAsZip = async () => {
    if (splitResults.length === 0) return
    setIsProcessing(true)

    try {
      const zip = new JSZip()
      splitResults.forEach((res) => {
        zip.file(res.name, res.bytes)
      })

      const content = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = `${selectedFile?.name.replace(/\.[^/.]+$/, '')}_split.zip`
      link.click()
      showToast('ZIP Download started', link.download)
    } catch (err: unknown) {
      showToast('Failed to create ZIP', (err as Error).message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {!selectedFile ? (
        <FileUploadZone
          accept="application/pdf"
          onFilesSelected={handleFilesSelected}
          label="Drop a PDF to split"
          description="Extract page ranges or separate document sections locally."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* File Information Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-rose-500 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 break-all">
                  {selectedFile.name}
                </span>
                <span className="text-[11px] text-slate-500">
                  {totalPages} total pages • {formatBytes(selectedFile.size)}
                </span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedFile(null)
                setSplitResults([])
              }}
              className="w-full sm:w-auto"
            >
              Change File
            </Button>
          </div>

          {/* Range Configuration */}
          <div className="p-4 sm:p-6 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="pdf-range-input" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Page Ranges to Extract:
              </label>
              <Input
                id="pdf-range-input"
                placeholder="e.g. 1-3, 5, 7-10"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                helperText={`Separate ranges by commas. Page numbers must be between 1 and ${totalPages}.`}
              />
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400">Presets:</span>
              <button
                type="button"
                onClick={() => {
                  const arr = []
                  for (let i = 1; i <= totalPages; i++) arr.push(i.toString())
                  setRangeInput(arr.join(', '))
                }}
                className="px-2.5 py-1 text-xs rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-blue-500"
              >
                Every page separately
              </button>
              {totalPages > 2 && (
                <button
                  type="button"
                  onClick={() => {
                    const mid = Math.ceil(totalPages / 2)
                    setRangeInput(`1-${mid}, ${mid + 1}-${totalPages}`)
                  }}
                  className="px-2.5 py-1 text-xs rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-blue-500"
                >
                  Split in Half
                </button>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleSplit}
              isLoading={isProcessing}
              leftIcon={<Scissors className="w-5 h-5" />}
              className="mt-2 w-full sm:w-auto"
            >
              Split PDF
            </Button>
          </div>

          {/* Results list */}
          {splitResults.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Generated {splitResults.length} split documents</span>
                </div>
                {splitResults.length > 1 && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={downloadAllAsZip}
                    isLoading={isProcessing}
                    leftIcon={<FileArchive className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    Download All as ZIP
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {splitResults.map((res, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E5DF] dark:border-slate-700 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 break-all max-w-md">
                          {res.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {res.pageCount} {res.pageCount === 1 ? 'page' : 'pages'} • {formatBytes(res.bytes.byteLength)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadSingle(res)}
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                      className="w-full sm:w-auto"
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
