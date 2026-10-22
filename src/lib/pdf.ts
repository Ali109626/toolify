import { PDFDocument, degrees } from 'pdf-lib'

export async function getPdfPageCount(file: File): Promise<number> {
  const buffer = await file.arrayBuffer()
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true })
  return doc.getPageCount()
}

export async function mergePdfFiles(files: File[]): Promise<Uint8Array> {
  if (files.length === 0) throw new Error('At least one PDF file is required to merge.')
  
  const mergedDoc = await PDFDocument.create()

  for (const file of files) {
    const buffer = await file.arrayBuffer()
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices())
    copiedPages.forEach((page) => mergedDoc.addPage(page))
  }

  return mergedDoc.save()
}

export interface SplitResult {
  name: string
  bytes: Uint8Array
  pageCount: number
}

export function parsePageRangeString(rangeStr: string, totalPages: number): number[][] {
  const parts = rangeStr.split(',').map((p) => p.trim()).filter(Boolean)
  const result: number[][] = []

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim())
      const start = parseInt(startStr, 10)
      const end = parseInt(endStr, 10)
      if (isNaN(start) || isNaN(end)) continue
      const cleanStart = Math.max(1, Math.min(start, totalPages))
      const cleanEnd = Math.max(1, Math.min(end, totalPages))
      const range: number[] = []
      if (cleanStart <= cleanEnd) {
        for (let i = cleanStart; i <= cleanEnd; i++) range.push(i)
      } else {
        for (let i = cleanStart; i >= cleanEnd; i--) range.push(i)
      }
      if (range.length > 0) result.push(range)
    } else {
      const pageNum = parseInt(part, 10)
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        result.push([pageNum])
      }
    }
  }

  return result
}

export async function splitPdfByRanges(file: File, rangeStr: string): Promise<SplitResult[]> {
  const buffer = await file.arrayBuffer()
  const sourceDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })
  const totalPages = sourceDoc.getPageCount()
  const parsedRanges = parsePageRangeString(rangeStr, totalPages)

  if (parsedRanges.length === 0) {
    throw new Error('Please provide at least one valid page range (e.g., "1-3, 5, 7-10").')
  }

  const results: SplitResult[] = []
  const baseName = file.name.replace(/\.[^/.]+$/, '')

  for (let idx = 0; idx < parsedRanges.length; idx++) {
    const pageGroup = parsedRanges[idx]
    const subDoc = await PDFDocument.create()
    const pageIndices = pageGroup.map((p) => p - 1)
    const copiedPages = await subDoc.copyPages(sourceDoc, pageIndices)
    copiedPages.forEach((p) => subDoc.addPage(p))
    const bytes = await subDoc.save()
    const rangeLabel = pageGroup.length === 1 ? `page_${pageGroup[0]}` : `pages_${pageGroup[0]}-${pageGroup[pageGroup.length - 1]}`

    results.push({
      name: `${baseName}_${rangeLabel}.pdf`,
      bytes,
      pageCount: pageGroup.length,
    })
  }

  return results
}

export async function rotatePdfPages(
  file: File,
  deg: number, // 90, 180, 270
  targetPages?: number[]
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer()
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true })
  const pages = doc.getPages()

  pages.forEach((page, index) => {
    const pageNum = index + 1
    if (!targetPages || targetPages.length === 0 || targetPages.includes(pageNum)) {
      const currentRotation = page.getRotation().angle
      const newRotation = (currentRotation + deg) % 360
      page.setRotation(degrees(newRotation))
    }
  })

  return doc.save()
}

export async function extractPdfPages(file: File, selectedPages: number[]): Promise<Uint8Array> {
  if (selectedPages.length === 0) {
    throw new Error('Please select at least one page to extract.')
  }
  const buffer = await file.arrayBuffer()
  const sourceDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })
  const totalPages = sourceDoc.getPageCount()

  const validPages = selectedPages
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b)

  if (validPages.length === 0) {
    throw new Error('No valid pages found in the selection.')
  }

  const newDoc = await PDFDocument.create()
  const indices = validPages.map((p) => p - 1)
  const copiedPages = await newDoc.copyPages(sourceDoc, indices)
  copiedPages.forEach((p) => newDoc.addPage(p))

  return newDoc.save()
}
