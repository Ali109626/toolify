import React, { useState } from 'react'
import { ArrowUp, ArrowDown, Trash2, FilePlus, Download, Check, FileText } from 'lucide-react'
import { FileUploadZone } from '../../components/ui/FileUploadZone'
import { Button } from '../../components/ui/Button'
import { mergePdfFiles, getPdfPageCount } from '../../lib/pdf'
import { formatBytes } from '../../lib/image'
import { useToast } from '../../components/ui/Toast'

interface PdfFileItem {
  file: File
  pageCount: number
}

export const PdfMerger: React.FC = () => {
  const [pdfItems, setPdfItems] = useState<PdfFileItem[]>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null)
  const [mergedSize, setMergedSize] = useState<number>(0)
  const { showToast } = useToast()

  const handleFilesSelected = async (newFiles: File[]) => {
    setIsProcessing(true)
    const newItems: PdfFileItem[] = []

    for (const f of newFiles) {
      try {
        const count = await getPdfPageCount(f)
        newItems.push({ file: f, pageCount: count })
      } catch {
        showToast('Error reading PDF', `Could not parse ${f.name}`, 'error')
      }
    }

    setPdfItems((prev) => [...prev, ...newItems])
    setIsProcessing(false)
    setMergedBlobUrl(null)
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= pdfItems.length) return

    setPdfItems((prev) => {
      const next = [...prev]
      const temp = next[index]
      next[index] = next[targetIndex]
      next[targetIndex] = temp
      return next
    })
    setMergedBlobUrl(null)
  }

  const removeItem = (index: number) => {
    setPdfItems((prev) => prev.filter((_, i) => i !== index))
    setMergedBlobUrl(null)
  }

  const handleMerge = async () => {
    if (pdfItems.length < 2) {
      showToast('Action required', 'Please add at least 2 PDF files to merge.', 'info')
      return
    }

    setIsProcessing(true)
    try {
      const files = pdfItems.map((item) => item.file)
      const mergedBytes = await mergePdfFiles(files)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = new Blob([mergedBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setMergedBlobUrl(url)
      setMergedSize(blob.size)
      showToast('PDFs merged successfully', `Combined into ${formatBytes(blob.size)}`)
    } catch (err: unknown) {
      showToast('Merge failed', (err as Error).message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!mergedBlobUrl) return
    const link = document.createElement('a')
    link.href = mergedBlobUrl
    link.download = `merged_${Date.now()}.pdf`
    link.click()
    showToast('Download started', link.download)
  }

  const totalPages = pdfItems.reduce((acc, curr) => acc + curr.pageCount, 0)

  return (
    <div className="flex flex-col gap-8">
      {/* Upload Zone */}
      <FileUploadZone
        accept="application/pdf"
        multiple={true}
        onFilesSelected={handleFilesSelected}
        label="Drop PDF files here to merge"
        description="Select multiple documents. Reorder pages and assemble into a single PDF."
      />

      {/* Files List & Reorder Controls */}
      {pdfItems.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Documents to Combine ({pdfItems.length} files • {totalPages} total pages):
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPdfItems([])
                setMergedBlobUrl(null)
              }}
            >
              Clear All
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {pdfItems.map((item, idx) => (
              <div
                key={`${item.file.name}-${idx}`}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E5DF] dark:border-slate-700 shadow-2xs"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                  <div className="flex flex-col overflow-hidden text-left">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.file.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} • {formatBytes(item.file.size)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-3">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, 'up')}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === pdfItems.length - 1}
                    onClick={() => moveItem(idx, 'down')}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge trigger */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Files are arranged in top-to-bottom order for the final merged PDF.
            </span>
            <Button
              variant="primary"
              size="lg"
              disabled={pdfItems.length < 2}
              onClick={handleMerge}
              isLoading={isProcessing}
              leftIcon={<FilePlus className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Merge {pdfItems.length} PDF Documents
            </Button>
          </div>

          {/* Download card */}
          {mergedBlobUrl && (
            <div className="p-4 sm:p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Merged PDF Ready!
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {totalPages} total pages • {formatBytes(mergedSize)}
                  </span>
                </div>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleDownload}
                leftIcon={<Download className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                Download Combined PDF
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
