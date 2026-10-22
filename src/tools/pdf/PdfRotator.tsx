import React, { useState } from 'react'
import { RotateCw, RotateCcw, Download, Check, FileText } from 'lucide-react'
import { FileUploadZone } from '../../components/ui/FileUploadZone'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { getPdfPageCount, rotatePdfPages } from '../../lib/pdf'
import { formatBytes } from '../../lib/image'
import { useToast } from '../../components/ui/Toast'

export const PdfRotator: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [rotateAll, setRotateAll] = useState<boolean>(true)
  const [specificPages, setSpecificPages] = useState<string>('')
  const [rotationDegrees, setRotationDegrees] = useState<number>(90)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [rotatedBlobUrl, setRotatedBlobUrl] = useState<string | null>(null)
  const [rotatedSize, setRotatedSize] = useState<number>(0)
  const { showToast } = useToast()

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return
    const file = files[0]
    setSelectedFile(file)
    setRotatedBlobUrl(null)
    try {
      const count = await getPdfPageCount(file)
      setTotalPages(count)
    } catch (err: unknown) {
      showToast('Error reading PDF', (err as Error).message, 'error')
    }
  }

  const handleRotate = async (deg = rotationDegrees) => {
    if (!selectedFile) return
    setIsProcessing(true)

    try {
      let targetPages: number[] | undefined = undefined
      if (!rotateAll && specificPages.trim()) {
        targetPages = specificPages
          .split(',')
          .map((s) => parseInt(s.trim(), 10))
          .filter((p) => !isNaN(p) && p >= 1 && p <= totalPages)
      }

      const bytes = await rotatePdfPages(selectedFile, deg, targetPages)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = new Blob([bytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setRotatedBlobUrl(url)
      setRotatedSize(blob.size)
      showToast('PDF rotated successfully', `Rotated ${targetPages ? targetPages.length : totalPages} page(s) by ${deg}°`)
    } catch (err: unknown) {
      showToast('Rotation failed', (err as Error).message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!rotatedBlobUrl || !selectedFile) return
    const originalName = selectedFile.name.replace(/\.[^/.]+$/, '')
    const link = document.createElement('a')
    link.href = rotatedBlobUrl
    link.download = `${originalName}_rotated_${rotationDegrees}deg.pdf`
    link.click()
    showToast('Download started', link.download)
  }

  return (
    <div className="flex flex-col gap-8">
      {!selectedFile ? (
        <FileUploadZone
          accept="application/pdf"
          onFilesSelected={handleFilesSelected}
          label="Drop a PDF to rotate pages"
          description="Losslessly rotate pages 90°, 180°, or 270° directly in your browser."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* File info */}
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
                setRotatedBlobUrl(null)
              }}
              className="w-full sm:w-auto"
            >
              Change File
            </Button>
          </div>

          {/* Configuration panel */}
          <div className="p-4 sm:p-6 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-6">
            {/* Target pages toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="pageScope"
                  checked={rotateAll}
                  onChange={() => setRotateAll(true)}
                  className="accent-[#1D4ED8]"
                />
                <span>Rotate All Pages ({totalPages})</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="pageScope"
                  checked={!rotateAll}
                  onChange={() => setRotateAll(false)}
                  className="accent-[#1D4ED8]"
                />
                <span>Specific Pages Only</span>
              </label>
            </div>

            {!rotateAll && (
              <Input
                label="Target Page Numbers"
                placeholder="e.g. 1, 3, 5"
                value={specificPages}
                onChange={(e) => setSpecificPages(e.target.value)}
                helperText={`Enter comma-separated page numbers from 1 to ${totalPages}.`}
              />
            )}

            {/* Rotation angle choice */}
            <div className="flex flex-col gap-2 text-left">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Choose Direction:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRotationDegrees(90)
                    handleRotate(90)
                  }}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 font-semibold text-xs cursor-pointer transition-colors ${
                    rotationDegrees === 90
                      ? 'bg-blue-50 border-blue-500 text-[#1D4ED8] dark:bg-blue-950/60 dark:border-blue-600 dark:text-blue-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <RotateCw className="w-5 h-5" />
                  <span>90° Clockwise</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRotationDegrees(270)
                    handleRotate(270)
                  }}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 font-semibold text-xs cursor-pointer transition-colors ${
                    rotationDegrees === 270
                      ? 'bg-blue-50 border-blue-500 text-[#1D4ED8] dark:bg-blue-950/60 dark:border-blue-600 dark:text-blue-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>90° Counter-Clockwise</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRotationDegrees(180)
                    handleRotate(180)
                  }}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 font-semibold text-xs cursor-pointer transition-colors ${
                    rotationDegrees === 180
                      ? 'bg-blue-50 border-blue-500 text-[#1D4ED8] dark:bg-blue-950/60 dark:border-blue-600 dark:text-blue-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <RotateCw className="w-5 h-5" />
                  <span>180° Flip Upside-Down</span>
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => handleRotate(rotationDegrees)}
              isLoading={isProcessing}
              leftIcon={<RotateCw className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Apply Rotation
            </Button>
          </div>

          {/* Success / Download */}
          {rotatedBlobUrl && (
            <div className="p-4 sm:p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Rotated PDF Ready
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Rotated by {rotationDegrees}° • {formatBytes(rotatedSize)}
                  </span>
                </div>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleDownload}
                leftIcon={<Download className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Download Rotated PDF
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
