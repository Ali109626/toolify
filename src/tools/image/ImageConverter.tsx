import React, { useState, useRef, useEffect } from 'react'
import { Download, RefreshCw, Check } from 'lucide-react'
import { FileUploadZone } from '../../components/ui/FileUploadZone'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { Slider } from '../../components/ui/Slider'
import { convertImage, formatBytes, type CompressResult } from '../../lib/image'
import { useToast } from '../../components/ui/Toast'

export const ImageConverter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [targetFormat, setTargetFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/webp')
  const [quality, setQuality] = useState<number>(90)
  const [bgColor] = useState<string>('#FFFFFF')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [result, setResult] = useState<CompressResult | null>(null)
  const { showToast } = useToast()

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeRequestIdRef = useRef<number>(0)
  const prevUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current)
      }
    }
  }, [])

  const handleConvert = async (
    fileToProcess?: File,
    fmt = targetFormat,
    q = quality,
    bg = bgColor,
    showToastNotification = true
  ) => {
    const file = fileToProcess || selectedFile
    if (!file) return

    const requestId = ++activeRequestIdRef.current
    setIsProcessing(true)

    try {
      const res = await convertImage(file, fmt, q / 100, bg)

      if (requestId !== activeRequestIdRef.current) {
        URL.revokeObjectURL(res.url)
        return
      }

      if (prevUrlRef.current && prevUrlRef.current !== res.url) {
        URL.revokeObjectURL(prevUrlRef.current)
      }
      prevUrlRef.current = res.url

      setResult(res)

      if (showToastNotification) {
        showToast(
          'Conversion successful',
          `Converted to ${fmt.replace('image/', '').toUpperCase()}`,
          'success',
          { id: 'image-converter-result' }
        )
      }
    } catch (err: unknown) {
      if (requestId === activeRequestIdRef.current) {
        showToast('Conversion failed', (err as Error).message, 'error', {
          id: 'image-converter-error',
        })
      }
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsProcessing(false)
      }
    }
  }

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
      handleConvert(file, targetFormat, quality, bgColor, true)
    }
  }

  const handleDownload = () => {
    if (!result || !selectedFile) return
    const ext = targetFormat === 'image/jpeg' ? 'jpg' : targetFormat === 'image/webp' ? 'webp' : 'png'
    const originalName = selectedFile.name.replace(/\.[^/.]+$/, '')
    const link = document.createElement('a')
    link.href = result.url
    link.download = `${originalName}.${ext}`
    link.click()
    showToast('Download started', link.download, 'info', { id: 'download-status' })
  }

  const handleReset = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current)
      prevUrlRef.current = null
    }
    setSelectedFile(null)
    setResult(null)
  }

  return (
    <div className="flex flex-col gap-8">
      {!selectedFile ? (
        <FileUploadZone
          accept="image/*"
          onFilesSelected={handleFilesSelected}
          label="Drop an image to convert format"
          description="Convert between PNG, JPEG, and WebP instantly in your browser."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Controls */}
          <div className="p-4 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <Select
              label="Target Format"
              value={targetFormat}
              onChange={(e) => {
                const fmt = e.target.value as 'image/png' | 'image/jpeg' | 'image/webp'
                setTargetFormat(fmt)
                if (debounceTimerRef.current) {
                  clearTimeout(debounceTimerRef.current)
                }
                handleConvert(selectedFile, fmt, quality, bgColor, true)
              }}
              options={[
                { label: 'WebP (Modern, compact)', value: 'image/webp' },
                { label: 'PNG (Lossless with transparency)', value: 'image/png' },
                { label: 'JPEG (Universal photo standard)', value: 'image/jpeg' },
              ]}
            />

            {targetFormat !== 'image/png' ? (
              <Slider
                label="Quality"
                value={quality}
                min={10}
                max={100}
                step={1}
                unit="%"
                onChange={(q) => {
                  setQuality(q)
                  if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current)
                  }
                  debounceTimerRef.current = setTimeout(() => {
                    handleConvert(selectedFile, targetFormat, q, bgColor, true)
                  }, 300)
                }}
              />
            ) : (
              <div className="flex flex-col gap-1 text-xs text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Format note:</span>
                <span>PNG uses lossless compression (quality slider is not needed).</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current)
                  }
                  handleConvert(selectedFile, targetFormat, quality, bgColor, true)
                }}
                isLoading={isProcessing}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="w-full sm:flex-1"
              >
                Convert Now
              </Button>
              <Button
                variant="secondary"
                onClick={handleReset}
                className="w-full sm:w-auto"
              >
                Change
              </Button>
            </div>
          </div>

          {/* Result view */}
          {result && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-[#E5E5DF] dark:border-slate-700 bg-slate-100 dark:bg-slate-950/60 p-4 flex items-center justify-center min-h-[220px] sm:min-h-[280px] max-h-[460px] overflow-hidden">
                <img
                  src={result.url}
                  alt="Converted output"
                  className="max-h-[420px] max-w-full object-contain rounded-lg shadow-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Output size: <strong>{formatBytes(result.size)}</strong> (Original:{' '}
                    {formatBytes(selectedFile.size)})
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleDownload}
                  leftIcon={<Download className="w-5 h-5" />}
                  className="w-full sm:w-auto"
                >
                  Download {targetFormat.replace('image/', '').toUpperCase()}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
