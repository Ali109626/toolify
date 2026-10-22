import React, { useState, useRef, useEffect } from 'react'
import { Download, RotateCw, FlipHorizontal, Check, Crop as CropIcon } from 'lucide-react'
import { FileUploadZone } from '../../components/ui/FileUploadZone'
import { Button } from '../../components/ui/Button'
import { cropImage, loadImage, formatBytes, type CompressResult } from '../../lib/image'
import { useToast } from '../../components/ui/Toast'

type AspectRatioPreset = 'free' | '1:1' | '16:9' | '4:3' | '9:16'

export const ImageCropper: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)
  const [preset, setPreset] = useState<AspectRatioPreset>('free')
  const [rotation, setRotation] = useState<number>(0)
  const [flipH, setFlipH] = useState<boolean>(false)
  const [flipV, setFlipV] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [result, setResult] = useState<CompressResult | null>(null)

  // Normalized crop box (0 to 1 relative to container)
  const [cropBox, setCropBox] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0.1,
    y: 0.1,
    width: 0.8,
    height: 0.8,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const dragModeRef = useRef<'move' | 'nw' | 'ne' | 'se' | 'sw' | null>(null)
  const startDragRef = useRef<{ clientX: number; clientY: number; box: typeof cropBox }>({
    clientX: 0,
    clientY: 0,
    box: cropBox,
  })

  const { showToast } = useToast()

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return
    const file = files[0]
    setSelectedFile(file)
    try {
      const img = await loadImage(file)
      setImageElement(img)
      setCropBox({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 })
      setResult(null)
      setRotation(0)
      setFlipH(false)
      setFlipV(false)
    } catch (err: unknown) {
      showToast('Error loading image', (err as Error).message, 'error')
    }
  }

  // Adjust crop box when preset changes
  useEffect(() => {
    if (!imageElement || preset === 'free') return
    const ratios: Record<string, number> = {
      '1:1': 1,
      '16:9': 16 / 9,
      '4:3': 4 / 3,
      '9:16': 9 / 16,
    }
    const targetRatio = ratios[preset]
    if (!targetRatio) return

    setCropBox((prev) => {
      let newW = prev.width
      let newH = newW / targetRatio
      if (newH > 0.9) {
        newH = 0.9
        newW = newH * targetRatio
      }
      return {
        x: Math.max(0.05, Math.min(0.95 - newW, prev.x)),
        y: Math.max(0.05, Math.min(0.95 - newH, prev.y)),
        width: Math.min(0.9, newW),
        height: Math.min(0.9, newH),
      }
    })
  }, [preset, imageElement])

  // Mouse / Touch handlers for interactive crop box
  const startDrag = (mode: 'move' | 'nw' | 'ne' | 'se' | 'sw', e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragModeRef.current = mode
    startDragRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      box: { ...cropBox },
    }
  }

  const startDragTouch = (mode: 'move' | 'nw' | 'ne' | 'se' | 'sw', e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    e.stopPropagation()
    dragModeRef.current = mode
    startDragRef.current = {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
      box: { ...cropBox },
    }
  }

  const updateDragCoords = (clientX: number, clientY: number) => {
    if (!dragModeRef.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const dx = (clientX - startDragRef.current.clientX) / rect.width
    const dy = (clientY - startDragRef.current.clientY) / rect.height
    const initial = startDragRef.current.box
    const mode = dragModeRef.current

    setCropBox(() => {
      let x = initial.x
      let y = initial.y
      let width = initial.width
      let height = initial.height

      if (mode === 'move') {
        x = Math.max(0, Math.min(1 - width, initial.x + dx))
        y = Math.max(0, Math.min(1 - height, initial.y + dy))
      } else if (mode === 'se') {
        width = Math.max(0.1, Math.min(1 - x, initial.width + dx))
        height = Math.max(0.1, Math.min(1 - y, initial.height + dy))
      } else if (mode === 'nw') {
        const newX = Math.max(0, Math.min(initial.x + initial.width - 0.1, initial.x + dx))
        const newY = Math.max(0, Math.min(initial.y + initial.height - 0.1, initial.y + dy))
        width = initial.width + (initial.x - newX)
        height = initial.height + (initial.y - newY)
        x = newX
        y = newY
      } else if (mode === 'ne') {
        const newY = Math.max(0, Math.min(initial.y + initial.height - 0.1, initial.y + dy))
        width = Math.max(0.1, Math.min(1 - initial.x, initial.width + dx))
        height = initial.height + (initial.y - newY)
        y = newY
      } else if (mode === 'sw') {
        const newX = Math.max(0, Math.min(initial.x + initial.width - 0.1, initial.x + dx))
        width = initial.width + (initial.x - newX)
        height = Math.max(0.1, Math.min(1 - initial.y, initial.height + dy))
        x = newX
      }

      return { x, y, width, height }
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    updateDragCoords(e.clientX, e.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    updateDragCoords(e.touches[0].clientX, e.touches[0].clientY)
  }

  const endDrag = () => {
    dragModeRef.current = null
  }

  const executeCrop = async () => {
    if (!selectedFile || !imageElement) return
    setIsProcessing(true)

    try {
      const is90or270 = rotation % 180 !== 0
      const activeWidth = is90or270 ? imageElement.naturalHeight : imageElement.naturalWidth
      const activeHeight = is90or270 ? imageElement.naturalWidth : imageElement.naturalHeight

      const pixelCrop = {
        x: Math.round(cropBox.x * activeWidth),
        y: Math.round(cropBox.y * activeHeight),
        width: Math.round(cropBox.width * activeWidth),
        height: Math.round(cropBox.height * activeHeight),
      }

      const res = await cropImage(selectedFile, pixelCrop, rotation, flipH, flipV, 'image/png')
      setResult(res)
      showToast('Crop generated', `${res.width} × ${res.height} px`)
    } catch (err: unknown) {
      showToast('Crop failed', (err as Error).message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!result || !selectedFile) return
    const originalName = selectedFile.name.replace(/\.[^/.]+$/, '')
    const link = document.createElement('a')
    link.href = result.url
    link.download = `${originalName}_cropped.png`
    link.click()
    showToast('Download started', link.download)
  }

  return (
    <div className="flex flex-col gap-8 select-none">
      {!selectedFile || !imageElement ? (
        <FileUploadZone
          accept="image/*"
          onFilesSelected={handleFilesSelected}
          label="Drop an image to crop"
          description="Interactive crop bounding box with presets and rotation."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="p-4 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E5E5DF] dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
            {/* Aspect Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mr-2">
                Aspect:
              </span>
              {(['free', '1:1', '16:9', '4:3', '9:16'] as AspectRatioPreset[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPreset(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                    preset === p
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Transform Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                leftIcon={<RotateCw className="w-3.5 h-3.5" />}
              >
                Rotate 90°
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFlipH(!flipH)}
                leftIcon={<FlipHorizontal className="w-3.5 h-3.5" />}
              >
                Flip H
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null)
                  setImageElement(null)
                  setResult(null)
                }}
              >
                Change Image
              </Button>
            </div>
          </div>

          {/* Interactive Crop Stage */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchMove={handleTouchMove}
            onTouchEnd={endDrag}
            onTouchCancel={endDrag}
            className="relative w-full h-[280px] sm:h-[380px] md:h-[450px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center p-2 sm:p-4 border border-slate-800 touch-none select-none"
          >
            {/* Visual background image with rotation & flip */}
            <img
              src={imageElement.src}
              alt="Source"
              style={{
                transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
              }}
              className="max-h-full max-w-full object-contain pointer-events-none transition-transform duration-150"
            />

            {/* Dark overlay backdrop outside crop area */}
            <div className="absolute inset-0 pointer-events-none bg-black/40" />

            {/* Interactive Crop Box */}
            <div
              style={{
                left: `${cropBox.x * 100}%`,
                top: `${cropBox.y * 100}%`,
                width: `${cropBox.width * 100}%`,
                height: `${cropBox.height * 100}%`,
              }}
              onMouseDown={(e) => startDrag('move', e)}
              onTouchStart={(e) => startDragTouch('move', e)}
              className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] cursor-move select-none touch-none"
            >
              {/* Grid rule-of-thirds lines */}
              <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none">
                <div className="border-r border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-b border-white/30" />
                <div className="border-r border-white/30" />
                <div className="border-r border-white/30" />
                <div />
              </div>

              {/* 4 Draggable Corner Handles */}
              <div
                onMouseDown={(e) => startDrag('nw', e)}
                onTouchStart={(e) => startDragTouch('nw', e)}
                className="absolute -top-2 -left-2 w-4 h-4 sm:w-3.5 sm:h-3.5 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize touch-none"
              />
              <div
                onMouseDown={(e) => startDrag('ne', e)}
                onTouchStart={(e) => startDragTouch('ne', e)}
                className="absolute -top-2 -right-2 w-4 h-4 sm:w-3.5 sm:h-3.5 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize touch-none"
              />
              <div
                onMouseDown={(e) => startDrag('sw', e)}
                onTouchStart={(e) => startDragTouch('sw', e)}
                className="absolute -bottom-2 -left-2 w-4 h-4 sm:w-3.5 sm:h-3.5 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize touch-none"
              />
              <div
                onMouseDown={(e) => startDrag('se', e)}
                onTouchStart={(e) => startDragTouch('se', e)}
                className="absolute -bottom-2 -right-2 w-4 h-4 sm:w-3.5 sm:h-3.5 bg-blue-500 border-2 border-white rounded-full cursor-se-resize touch-none"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Drag corners to resize crop. Drag inside box to reposition.
            </span>
            <Button
              variant="primary"
              size="lg"
              onClick={executeCrop}
              isLoading={isProcessing}
              leftIcon={<CropIcon className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Apply Crop
            </Button>
          </div>

          {/* Result preview */}
          {result && (
            <div className="p-4 sm:p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 flex flex-col gap-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Crop ready: {result.width} × {result.height} px ({formatBytes(result.size)})
                  </span>
                </div>
                <Button
                  variant="primary"
                  onClick={handleDownload}
                  leftIcon={<Download className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Download Cropped PNG
                </Button>
              </div>
              <div className="max-h-80 flex items-center justify-center p-3 bg-slate-900 rounded-xl overflow-hidden">
                <img src={result.url} alt="Cropped preview" className="max-h-72 object-contain rounded" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
