export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes <= 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(new Error(`Failed to load image: ${err}`))
    }
    img.src = url
  })
}

export interface CompressResult {
  blob: Blob
  url: string
  width: number
  height: number
  size: number
}

export async function compressImage(
  file: File,
  quality: number, // 0.05 to 1.0
  format: 'image/jpeg' | 'image/webp' = 'image/jpeg'
): Promise<CompressResult> {
  const img = await loadImage(file)
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context is not available')

  // If output format does not support transparency, composite on white background
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(img, 0, 0)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Image compression failed'))
          return
        }
        resolve({
          blob,
          url: URL.createObjectURL(blob),
          width: canvas.width,
          height: canvas.height,
          size: blob.size,
        })
      },
      format,
      Math.max(0.05, Math.min(1.0, quality))
    )
  })
}

export interface ResizeResult {
  blob: Blob
  url: string
  width: number
  height: number
  size: number
}

export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  quality = 0.92,
  format: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/png'
): Promise<ResizeResult> {
  const img = await loadImage(file)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(targetWidth))
  canvas.height = Math.max(1, Math.round(targetHeight))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context is not available')

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Image resize failed'))
          return
        }
        resolve({
          blob,
          url: URL.createObjectURL(blob),
          width: canvas.width,
          height: canvas.height,
          size: blob.size,
        })
      },
      format,
      quality
    )
  })
}

export async function convertImage(
  file: File,
  targetFormat: 'image/png' | 'image/jpeg' | 'image/webp',
  quality = 0.92,
  bgColor = '#FFFFFF'
): Promise<CompressResult> {
  const img = await loadImage(file)
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context is not available')

  if (targetFormat === 'image/jpeg') {
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(img, 0, 0)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Image conversion failed'))
          return
        }
        resolve({
          blob,
          url: URL.createObjectURL(blob),
          width: canvas.width,
          height: canvas.height,
          size: blob.size,
        })
      },
      targetFormat,
      quality
    )
  })
}

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export async function cropImage(
  file: File,
  cropArea: CropArea,
  rotation = 0, // 0, 90, 180, 270
  flipH = false,
  flipV = false,
  format: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png'
): Promise<CompressResult> {
  const img = await loadImage(file)
  
  // First render onto canvas with rotation and flip if necessary
  const tempCanvas = document.createElement('canvas')
  const rads = (rotation * Math.PI) / 180
  const is90or270 = rotation % 180 !== 0
  tempCanvas.width = is90or270 ? img.naturalHeight : img.naturalWidth
  tempCanvas.height = is90or270 ? img.naturalWidth : img.naturalHeight

  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) throw new Error('Canvas context unavailable')

  tempCtx.save()
  tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2)
  tempCtx.rotate(rads)
  tempCtx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
  tempCtx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
  tempCtx.restore()

  // Now perform crop from tempCanvas
  const outCanvas = document.createElement('canvas')
  outCanvas.width = Math.max(1, Math.round(cropArea.width))
  outCanvas.height = Math.max(1, Math.round(cropArea.height))
  const outCtx = outCanvas.getContext('2d')
  if (!outCtx) throw new Error('Canvas context unavailable')

  if (format === 'image/jpeg') {
    outCtx.fillStyle = '#FFFFFF'
    outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height)
  }

  outCtx.drawImage(
    tempCanvas,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    outCanvas.width,
    outCanvas.height
  )

  return new Promise((resolve, reject) => {
    outCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Cropping failed'))
          return
        }
        resolve({
          blob,
          url: URL.createObjectURL(blob),
          width: outCanvas.width,
          height: outCanvas.height,
          size: blob.size,
        })
      },
      format,
      0.95
    )
  })
}
