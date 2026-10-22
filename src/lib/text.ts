import { diffWords, diffChars, diffLines, type Change } from 'diff'

export interface TextMetrics {
  words: number
  characters: number
  charactersNoSpaces: number
  sentences: number
  paragraphs: number
  readingTimeMinutes: number
  speakingTimeMinutes: number
  topWords: { word: string; count: number; percentage: number }[]
}

export function countText(text: string): TextMetrics {
  if (!text || text.trim().length === 0) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      topWords: [],
    }
  }

  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length

  // Words
  const wordTokens = text.trim().match(/[\p{L}\p{N}'’-]+/gu) || []
  const words = wordTokens.length

  // Sentences
  const sentenceTokens = text
    .trim()
    .split(/[.!?]+(?:\s+|$)/)
    .filter((s) => s.trim().length > 0)
  const sentences = sentenceTokens.length

  // Paragraphs
  const paragraphTokens = text
    .split(/\n+/)
    .filter((p) => p.trim().length > 0)
  const paragraphs = paragraphTokens.length

  // Reading time (approx 200 words per minute)
  const readingTimeMinutes = Math.max(1, Math.round((words / 200) * 10) / 10)
  // Speaking time (approx 130 words per minute)
  const speakingTimeMinutes = Math.max(1, Math.round((words / 130) * 10) / 10)

  // Word frequency (excluding tiny words < 2 chars)
  const frequencyMap = new Map<string, number>()
  for (const token of wordTokens) {
    const cleanWord = token.toLowerCase()
    if (cleanWord.length > 2) {
      frequencyMap.set(cleanWord, (frequencyMap.get(cleanWord) || 0) + 1)
    }
  }

  const sortedWords = Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({
      word,
      count,
      percentage: Math.round((count / (words || 1)) * 100),
    }))

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTimeMinutes,
    speakingTimeMinutes,
    topWords: sortedWords,
  }
}

export type CaseFormat =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant'
  | 'dot'

export function convertCase(text: string, format: CaseFormat): string {
  if (!text) return ''

  switch (format) {
    case 'upper':
      return text.toUpperCase()

    case 'lower':
      return text.toLowerCase()

    case 'title': {
      const stopWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'])
      return text.replace(/\b[\w'-]+\b/g, (word, index) => {
        const lower = word.toLowerCase()
        if (index > 0 && stopWords.has(lower)) {
          return lower
        }
        return lower.charAt(0).toUpperCase() + lower.slice(1)
      })
    }

    case 'sentence': {
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase())
    }

    case 'camel': {
      const words = text
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
      return words
        .map((w, idx) => {
          const lower = w.toLowerCase()
          return idx === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1)
        })
        .join('')
    }

    case 'pascal': {
      const words = text
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
      return words
        .map((w) => {
          const lower = w.toLowerCase()
          return lower.charAt(0).toUpperCase() + lower.slice(1)
        })
        .join('')
    }

    case 'snake': {
      return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .toLowerCase()
    }

    case 'kebab': {
      return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase()
    }

    case 'constant': {
      return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .toUpperCase()
    }

    case 'dot': {
      return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[^a-zA-Z0-9]+/g, '.')
        .replace(/^\.+|\.+$/g, '')
        .toLowerCase()
    }

    default:
      return text
  }
}

export interface CleanLinesOptions {
  removeDuplicates: boolean
  trimLines: boolean
  collapseSpaces: boolean
  removeEmptyLines: boolean
  caseSensitive: boolean
  sortMode: 'none' | 'asc' | 'desc' | 'length'
}

export interface CleanLinesResult {
  text: string
  originalLines: number
  cleanedLines: number
  duplicatesRemoved: number
  emptyLinesRemoved: number
}

export function cleanLines(text: string, options: CleanLinesOptions): CleanLinesResult {
  const rawLines = text.split(/\r?\n/)
  const originalLines = rawLines.length
  let lines = [...rawLines]

  // Trim lines
  if (options.trimLines) {
    lines = lines.map((line) => line.trim())
  }

  // Collapse spaces
  if (options.collapseSpaces) {
    lines = lines.map((line) => line.replace(/\s+/g, ' '))
  }

  // Remove empty lines
  let emptyLinesRemoved = 0
  if (options.removeEmptyLines) {
    const beforeCount = lines.length
    lines = lines.filter((line) => line.trim().length > 0)
    emptyLinesRemoved = beforeCount - lines.length
  }

  // Remove duplicates
  let duplicatesRemoved = 0
  if (options.removeDuplicates) {
    const seen = new Set<string>()
    const uniqueLines: string[] = []
    for (const line of lines) {
      const key = options.caseSensitive ? line : line.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        uniqueLines.push(line)
      } else {
        duplicatesRemoved++
      }
    }
    lines = uniqueLines
  }

  // Sort
  if (options.sortMode === 'asc') {
    lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  } else if (options.sortMode === 'desc') {
    lines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }))
  } else if (options.sortMode === 'length') {
    lines.sort((a, b) => a.length - b.length)
  }

  return {
    text: lines.join('\n'),
    originalLines,
    cleanedLines: lines.length,
    duplicatesRemoved,
    emptyLinesRemoved,
  }
}

export interface DiffResult {
  changes: Change[]
  additions: number
  deletions: number
  unchanged: number
}

export function computeDiff(
  oldText: string,
  newText: string,
  mode: 'words' | 'chars' | 'lines' = 'words'
): DiffResult {
  let changes: Change[] = []

  if (mode === 'lines') {
    changes = diffLines(oldText, newText)
  } else if (mode === 'chars') {
    changes = diffChars(oldText, newText)
  } else {
    changes = diffWords(oldText, newText)
  }

  let additions = 0
  let deletions = 0
  let unchanged = 0

  for (const part of changes) {
    const count = part.count || 1
    if (part.added) {
      additions += count
    } else if (part.removed) {
      deletions += count
    } else {
      unchanged += count
    }
  }

  return { changes, additions, deletions, unchanged }
}
