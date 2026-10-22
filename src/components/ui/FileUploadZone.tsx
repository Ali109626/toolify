import React, { useRef, useState } from 'react'
import { UploadCloud, File, X } from 'lucide-react'
import { formatBytes } from '../../lib/image'

export interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSizeMB?: number
  label?: string
  description?: string
  selectedFiles?: File[]
  onRemoveFile?: (index: number) => void
  className?: string
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  accept = '*/*',
  multiple = false,
  maxSizeMB = 50,
  label = 'Drag & drop files here, or browse',
  description = 'Processed 100% locally on your device',
  selectedFiles = [],
  onRemoveFile,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const validateAndProcessFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    setError(null)
    const validFiles: File[] = []
    const maxBytes = maxSizeMB * 1024 * 1024

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      if (file.size > maxBytes) {
        setError(`File "${file.name}" exceeds the maximum size limit of ${maxSizeMB}MB.`)
        continue
      }
      validFiles.push(file)
      if (!multiple) break
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    validateAndProcessFiles(e.dataTransfer.files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndProcessFiles(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group ${
          isDragging
            ? 'border-[#1D4ED8] bg-blue-50/70 dark:bg-blue-950/40'
            : 'border-[#E5E5DF] dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50/50 dark:hover:bg-slate-900'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#1D4ED8] dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>

        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">{label}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-2">{description}</p>
        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          Max {maxSizeMB}MB • {multiple ? 'Multiple files supported' : 'Single file'}
        </span>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Selected Files ({selectedFiles.length}):
          </span>
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            {selectedFiles.map((f, idx) => (
              <div
                key={`${f.name}-${idx}`}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-[#E5E5DF] dark:border-slate-700 text-xs shadow-2xs"
              >
                <div className="flex items-center gap-2 overflow-hidden pr-2">
                  <File className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{f.name}</span>
                  <span className="text-slate-400 shrink-0">({formatBytes(f.size)})</span>
                </div>
                {onRemoveFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveFile(idx)
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
