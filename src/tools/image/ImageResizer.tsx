import React, { useState } from 'react'
import { Download, Lock, Unlock, RefreshCw, Check } from 'lucide-react'
import { FileUploadZone } from '../../components/ui/FileUploadZone'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { loadImage, resizeImage, formatBytes, type ResizeResult } from '../../lib/image'
import { useToast } from '../../components/ui/Toast'

export const ImageResizer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [naturalWidth, setNaturalWidth] = useState<number>(0)
  const [naturalHeight, setNaturalHeight] = useState<number>(0)
  const [targetWidth, setTargetWidth] = useState<number>(0)
  const [targetHeight, setTargetHeight] = useState<number>(0)
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true)
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [result, setResult] = useState<ResizeResult | null>(null)
  const { showToast } = useToast()

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return
    const file = files[0]
    setSelectedFile(file)
    try {
      const img = await loadImage(file)
      setNaturalWidth(img.naturalWidth)
      setNaturalHeight(img.naturalHeight)
      setTargetWidth(img.naturalWidth)
      setTargetHeight(img.naturalHeight)
      performResize(file, img.naturalWidth, img.naturalHeight, format)
    } catch (err: unknown) {
      showToast('Error loading image', (err as Error).message, 'error')
    }
  }

  const performResize = async (
    file: File,
    w: number,
    h: number,
    fmt = format
  ) => {
    if (w <= 0 || h <= 0) return
    setIsProcessing(true)
    try {
      const res = await resizeImage(file, w, h, 0.92, fmt)
      setResult(res)
      showToast('Image resized', `Dimensions: ${w} × ${h}px`)
    } catch (err: unknown) {
      showToast('Resize failed', (err as Error).message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleWidthChange = (newWidth: number) => {
    setTargetWidth(newWidth)
    if (lockAspectRatio && naturalWidth > 0) {
      const ratio = naturalHeight / naturalWidth
      const newHeight = Math.round(newWidth * ratio)
      setTargetHeight(newHeight)
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setTargetHeight(newHeight)
    if (lockAspectRatio && naturalHeight > 0) {
      const ratio = naturalWidth / naturalHeight
      const newWidth = Math.round(newHeight * ratio)
      setTargetWidth(newWidth)
    }
  }

  const applyScalePreset = (percent: number) => {
    if (naturalWidth === 0 || naturalHeight === 0) return
    const newW = Math.round((naturalWidth * percent) / 100)
    const newH = Math.round((naturalHeight * percent) / 100)
    setTargetWidth(newW)
    setTargetHeight(newH)
    if (selectedFile) {
      performResize(selectedFile, newW, newH, format)
    }
  }

  const handleDownload = () => {
    if (!result || !selectedFile) return
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png'
    const originalName = selectedFile.name.replace(/\.[^/.]+$/, '')
    const link = document.createElement('a')
    link.href = result.url
    link.download = `${originalName}_${result.width}x${result.height}.${ext}`
    link.click()
    showToast('Download started', link.download)
  }

  return (
    <div className="flex flex-col gap-8">
      {!selectedFile ? (
        <FileUploadZone
          accept="image/*"
          onFilesSelected={handleFilesSelected}
          label="Drop an image to resize"
          description="Resize dimensions with aspect ratio lock. 100% processed in browser."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Controls Panel */}
          <div className="p-4 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Original Size: {naturalWidth} × {naturalHeight} px ({formatBytes(selectedFile.size)})
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 mr-1">Scale Presets:</span>
                {[25, 50, 75, 100, 200].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => applyScalePreset(p)}
                    className="px-2.5 py-1 text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <Input
                label="Width (px)"
                type="number"
                min={1}
                value={targetWidth}
                onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 0)}
              />

              <div className="flex items-center justify-center pb-2">
                <button
                  type="button"
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                    lockAspectRatio
                      ? 'bg-blue-50 border-blue-200 text-[#1D4ED8] dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300'
                      : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700'
                  }`}
                  title={lockAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                >
                  {lockAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{lockAspectRatio ? 'Ratio Locked' : 'Ratio Free'}</span>
                </button>
              </div>

              <Input
                label="Height (px)"
                type="number"
                min={1}
                value={targetHeight}
                onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 0)}
              />

              <Select
                label="Export Format"
                value={format}
                onChange={(e) => {
                  const fmt = e.target.value as 'image/png' | 'image/jpeg' | 'image/webp'
                  setFormat(fmt)
                }}
                options={[
                  { label: 'PNG (Lossless)', value: 'image/png' },
                  { label: 'JPEG (Standard)', value: 'image/jpeg' },
                  { label: 'WebP (Modern)', value: 'image/webp' },
                ]}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
              <Button
                variant="primary"
                onClick={() => performResize(selectedFile, targetWidth, targetHeight, format)}
                isLoading={isProcessing}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Apply Resize
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedFile(null)
                  setResult(null)
                }}
                className="w-full sm:w-auto"
              >
                Change Image
              </Button>
            </div>
          </div>

          {/* Result preview */}
          {result && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-slate-100 dark:bg-slate-950/60 p-4 flex items-center justify-center min-h-[220px] sm:min-h-[280px] max-h-[460px] overflow-hidden">
                <img
                  src={result.url}
                  alt="Resized preview"
                  className="max-h-[420px] max-w-full object-contain rounded-lg shadow-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    New size: <strong>{result.width} × {result.height} px</strong> ({formatBytes(result.size)})
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleDownload}
                  leftIcon={<Download className="w-5 h-5" />}
                  className="w-full sm:w-auto"
                >
                  Download Resized Image
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
