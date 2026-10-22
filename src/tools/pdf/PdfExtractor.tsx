import React, { useState } from 'react'
import { CopyCheck, Download, Check, FileText } from 'lucide-react'
import { FileUploadZone } from '../../components/ui/FileUploadZone'
import { Button } from '../../components/ui/Button'
import { getPdfPageCount, extractPdfPages } from '../../lib/pdf'
import { formatBytes } from '../../lib/image'
import { useToast } from '../../components/ui/Toast'

export const PdfExtractor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [extractedBlobUrl, setExtractedBlobUrl] = useState<string | null>(null)
  const [extractedSize, setExtractedSize] = useState<number>(0)
  const { showToast } = useToast()

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return
    const file = files[0]
    setSelectedFile(file)
    setExtractedBlobUrl(null)

    try {
      const count = await getPdfPageCount(file)
      setTotalPages(count)
      // Default select first page
      setSelectedPages(count > 0 ? [1] : [])
    } catch (err: unknown) {
      showToast('Error reading PDF', (err as Error).message, 'error')
    }
  }

  const togglePage = (pageNum: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum].sort((a, b) => a - b)
    )
    setExtractedBlobUrl(null)
  }

  const selectAll = () => {
    const all = []
    for (let i = 1; i <= totalPages; i++) all.push(i)
    setSelectedPages(all)
    setExtractedBlobUrl(null)
  }

  const clearSelection = () => {
    setSelectedPages([])
    setExtractedBlobUrl(null)
  }

  const invertSelection = () => {
    const inverted = []
    for (let i = 1; i <= totalPages; i++) {
      if (!selectedPages.includes(i)) inverted.push(i)
    }
    setSelectedPages(inverted)
    setExtractedBlobUrl(null)
  }

  const handleExtract = async () => {
    if (!selectedFile || selectedPages.length === 0) {
      showToast('Selection needed', 'Please select at least 1 page to extract.', 'info')
      return
    }

    setIsProcessing(true)
    try {
      const bytes = await extractPdfPages(selectedFile, selectedPages)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = new Blob([bytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setExtractedBlobUrl(url)
      setExtractedSize(blob.size)
      showToast('Extraction successful', `Extracted ${selectedPages.length} page(s)`)
    } catch (err: unknown) {
      showToast('Extraction failed', (err as Error).message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!extractedBlobUrl || !selectedFile) return
    const originalName = selectedFile.name.replace(/\.[^/.]+$/, '')
    const link = document.createElement('a')
    link.href = extractedBlobUrl
    link.download = `${originalName}_extracted_${selectedPages.length}pages.pdf`
    link.click()
    showToast('Download started', link.download)
  }

  return (
    <div className="flex flex-col gap-8">
      {!selectedFile ? (
        <FileUploadZone
          accept="application/pdf"
          onFilesSelected={handleFilesSelected}
          label="Drop a PDF to extract pages"
          description="Select specific pages visually and export them as a fresh PDF."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* File header */}
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
                setExtractedBlobUrl(null)
              }}
              className="w-full sm:w-auto"
            >
              Change File
            </Button>
          </div>

          {/* Interactive Page Selection Grid */}
          <div className="p-4 sm:p-6 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Click pages to include in the new document ({selectedPages.length} of {totalPages} selected):
              </span>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="secondary" size="sm" onClick={invertSelection}>
                  Invert
                </Button>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
            </div>

            {/* Page chips grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-72 overflow-y-auto p-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1
                const isSelected = selectedPages.includes(pageNum)
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => togglePage(pageNum)}
                    className={`h-12 rounded-lg border font-mono text-xs font-bold flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-102'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    <span>p. {pageNum}</span>
                  </button>
                )
              })}
            </div>

            <Button
              variant="primary"
              size="lg"
              disabled={selectedPages.length === 0}
              onClick={handleExtract}
              isLoading={isProcessing}
              leftIcon={<CopyCheck className="w-5 h-5" />}
              className="mt-2 w-full sm:w-auto"
            >
              Extract {selectedPages.length} Selected Page(s)
            </Button>
          </div>

          {/* Success / Download */}
          {extractedBlobUrl && (
            <div className="p-4 sm:p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Extracted PDF Ready
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Pages: [{selectedPages.join(', ')}] • {formatBytes(extractedSize)}
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
                Download Extracted PDF
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
