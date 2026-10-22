import React, { Suspense, lazy } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { TOOLS } from '../config/site'
import { ToolLayout } from '../components/tools/ToolLayout'
import { NotFound } from './NotFound'

// Lazy loaded Image Tools
const ImageCompressor = lazy(() =>
  import('../tools/image/ImageCompressor').then((m) => ({ default: m.ImageCompressor }))
)
const ImageResizer = lazy(() =>
  import('../tools/image/ImageResizer').then((m) => ({ default: m.ImageResizer }))
)
const ImageConverter = lazy(() =>
  import('../tools/image/ImageConverter').then((m) => ({ default: m.ImageConverter }))
)
const ImageCropper = lazy(() =>
  import('../tools/image/ImageCropper').then((m) => ({ default: m.ImageCropper }))
)

// Lazy loaded PDF Tools
const PdfMerger = lazy(() =>
  import('../tools/pdf/PdfMerger').then((m) => ({ default: m.PdfMerger }))
)
const PdfSplitter = lazy(() =>
  import('../tools/pdf/PdfSplitter').then((m) => ({ default: m.PdfSplitter }))
)
const PdfRotator = lazy(() =>
  import('../tools/pdf/PdfRotator').then((m) => ({ default: m.PdfRotator }))
)
const PdfExtractor = lazy(() =>
  import('../tools/pdf/PdfExtractor').then((m) => ({ default: m.PdfExtractor }))
)

// Lazy loaded Text Tools
const WordCounter = lazy(() =>
  import('../tools/text/WordCounter').then((m) => ({ default: m.WordCounter }))
)
const CaseConverter = lazy(() =>
  import('../tools/text/CaseConverter').then((m) => ({ default: m.CaseConverter }))
)
const LineCleaner = lazy(() =>
  import('../tools/text/LineCleaner').then((m) => ({ default: m.LineCleaner }))
)
const TextDiff = lazy(() =>
  import('../tools/text/TextDiff').then((m) => ({ default: m.TextDiff }))
)

// Lazy loaded Developer Tools
const JsonFormatter = lazy(() =>
  import('../tools/dev/JsonFormatter').then((m) => ({ default: m.JsonFormatter }))
)
const Base64Tool = lazy(() =>
  import('../tools/dev/Base64Tool').then((m) => ({ default: m.Base64Tool }))
)
const UrlEncoderTool = lazy(() =>
  import('../tools/dev/UrlEncoderTool').then((m) => ({ default: m.UrlEncoderTool }))
)

// Lazy loaded Calculators
const PercentageCalculator = lazy(() =>
  import('../tools/calc/PercentageCalculator').then((m) => ({ default: m.PercentageCalculator }))
)
const DiscountCalculator = lazy(() =>
  import('../tools/calc/DiscountCalculator').then((m) => ({ default: m.DiscountCalculator }))
)
const AgeCalculator = lazy(() =>
  import('../tools/calc/AgeCalculator').then((m) => ({ default: m.AgeCalculator }))
)

function ToolLoadingFallback() {
  return (
    <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="text-xs font-semibold">Loading tool workspace...</span>
    </div>
  )
}

export const ToolPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>()
  const tool = TOOLS.find((t) => t.id === toolId)

  if (!tool) {
    return <NotFound />
  }

  const renderToolComponent = () => {
    switch (tool.id) {
      case 'image-compressor':
        return <ImageCompressor />
      case 'image-resizer':
        return <ImageResizer />
      case 'image-converter':
        return <ImageConverter />
      case 'image-cropper':
        return <ImageCropper />
      case 'pdf-merger':
        return <PdfMerger />
      case 'pdf-split':
        return <PdfSplitter />
      case 'pdf-rotate':
        return <PdfRotator />
      case 'pdf-extract':
        return <PdfExtractor />
      case 'word-counter':
        return <WordCounter />
      case 'case-converter':
        return <CaseConverter />
      case 'line-cleaner':
        return <LineCleaner />
      case 'text-diff':
        return <TextDiff />
      case 'json-formatter':
        return <JsonFormatter />
      case 'base64-converter':
        return <Base64Tool />
      case 'url-encoder':
        return <UrlEncoderTool />
      case 'percentage-calculator':
        return <PercentageCalculator />
      case 'discount-calculator':
        return <DiscountCalculator />
      case 'age-calculator':
        return <AgeCalculator />
      default:
        return <div>Tool not found</div>
    }
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense fallback={<ToolLoadingFallback />}>{renderToolComponent()}</Suspense>
    </ToolLayout>
  )
}
