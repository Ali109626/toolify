import React, { useState } from 'react'
import { Download, RefreshCw, Check } from 'lucide-react'
import { FileUploadZone } from '../../components/ui/FileUploadZone'
import { Button } from '../../components/ui/Button'
import { Slider } from '../../components/ui/Slider'
import { Select } from '../../components/ui/Select'
import { compressImage, formatBytes, type CompressResult } from '../../lib/image'
import { useToast } from '../../components/ui/Toast'

export const ImageCompressor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [quality, setQuality] = useState<number>(75)
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [result, setResult] = useState<CompressResult | null>(null)
  const { showToast } = useToast()

  const handleProcess = async (fileToProcess?: File, qVal = quality, fmt = format) => {
    const file = fileToProcess || selectedFile
    if (!file) return

    setIsProcessing(true)
    try {
      const res = await compressImage(file, qVal / 100, fmt)
      setResult(res)
      showToast('Compression complete', `Saved ${Math.max(0, Math.round(((file.size - res.size) / file.size) * 100))}% file size`)
    } catch (err: unknown) {
      showToast('Compression failed', (err as Error).message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
      handleProcess(file, quality, format)
    }
  }

  const handleDownload = () => {
    if (!result || !selectedFile) return
    const ext = format === 'image/webp' ? 'webp' : 'jpg'
    const originalName = selectedFile.name.replace(/\.[^/.]+$/, '')
    const link = document.createElement('a')
    link.href = result.url
    link.download = `${originalName}_compressed.${ext}`
    link.click()
    showToast('Download started', `Saving ${link.download}`)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setResult(null)
  }

  const savingsPercent =
    selectedFile && result
      ? Math.round(((selectedFile.size - result.size) / selectedFile.size) * 100)
      : 0

  return (
    <div className="flex flex-col gap-8">
      {!selectedFile ? (
        <FileUploadZone
          accept="image/*"
          onFilesSelected={handleFilesSelected}
          label="Drop an image here to compress"
          description="Supports PNG, JPG, WebP. Compressed 100% locally in your browser."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="p-4 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <Slider
              label="Quality Factor"
              value={quality}
              min={5}
              max={100}
              step={1}
              unit="%"
              onChange={(val) => {
                setQuality(val)
                handleProcess(selectedFile, val, format)
              }}
            />

            <Select
              label="Target Format"
              value={format}
              onChange={(e) => {
                const newFmt = e.target.value as 'image/jpeg' | 'image/webp'
                setFormat(newFmt)
                handleProcess(selectedFile, quality, newFmt)
              }}
              options={[
                { label: 'JPEG (Best compatibility)', value: 'image/jpeg' },
                { label: 'WebP (Maximum compression)', value: 'image/webp' },
              ]}
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button
                variant="primary"
                onClick={() => handleProcess(selectedFile, quality, format)}
                isLoading={isProcessing}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="w-full sm:flex-1"
              >
                Re-compress
              </Button>
              <Button variant="secondary" onClick={handleReset} title="Upload different image" className="w-full sm:w-auto">
                Change
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          {result && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-1">
                <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400">Original Size</span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                  {formatBytes(selectedFile.size)}
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-1">
                <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400">Compressed Size</span>
                <span className="text-sm sm:text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                  {formatBytes(result.size)}
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-1">
                <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400">Space Saved</span>
                <span
                  className={`text-sm sm:text-base font-extrabold font-mono ${
                    savingsPercent >= 0 ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {savingsPercent >= 0 ? `-${savingsPercent}%` : `+${Math.abs(savingsPercent)}%`}
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E5DF] dark:border-slate-700 flex flex-col gap-1">
                <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400">Dimensions</span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                  {result.width} × {result.height}
                </span>
              </div>
            </div>
          )}

          {/* Preview & Download */}
          {result && (
            <div className="flex flex-col gap-4">
              <div className="relative rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-slate-100 dark:bg-slate-950/60 p-4 flex items-center justify-center min-h-[220px] sm:min-h-[300px] max-h-[480px] overflow-hidden">
                <img
                  src={result.url}
                  alt="Compressed preview"
                  className="max-h-[440px] max-w-full object-contain rounded-lg shadow-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Image optimized and ready for download.</span>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleDownload}
                  leftIcon={<Download className="w-5 h-5" />}
                  className="w-full sm:w-auto"
                >
                  Download Compressed Image
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
