export interface JsonFormatResult {
  success: boolean
  formatted?: string
  error?: string
  line?: number
  column?: number
}

function sortJsonKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJsonKeys)
  } else if (value !== null && typeof value === 'object') {
    const sortedObj: Record<string, unknown> = {}
    const keys = Object.keys(value as Record<string, unknown>).sort()
    for (const key of keys) {
      sortedObj[key] = sortJsonKeys((value as Record<string, unknown>)[key])
    }
    return sortedObj
  }
  return value
}

export function formatJson(
  input: string,
  indent: 2 | 4 | 'tab' = 2,
  sortKeys = false
): JsonFormatResult {
  if (!input || input.trim().length === 0) {
    return { success: false, error: 'Input is empty. Please paste valid JSON.' }
  }

  try {
    let parsed = JSON.parse(input)
    if (sortKeys) {
      parsed = sortJsonKeys(parsed)
    }
    const space = indent === 'tab' ? '\t' : indent
    const formatted = JSON.stringify(parsed, null, space)
    return { success: true, formatted }
  } catch (err: unknown) {
    const errorMsg = (err as Error).message

    // Attempt to locate line and column from error message
    // e.g., "Unexpected token '}' at 1:15" or "at position 42"
    let line: number | undefined
    let column: number | undefined

    const posMatch = errorMsg.match(/position (\d+)/i)
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10)
      const linesUpToPos = input.slice(0, pos).split('\n')
      line = linesUpToPos.length
      column = linesUpToPos[linesUpToPos.length - 1].length + 1
    } else {
      const lineColMatch = errorMsg.match(/line (\d+) column (\d+)/i)
      if (lineColMatch) {
        line = parseInt(lineColMatch[1], 10)
        column = parseInt(lineColMatch[2], 10)
      }
    }

    return {
      success: false,
      error: errorMsg,
      line,
      column,
    }
  }
}

export function minifyJson(input: string): { success: boolean; minified?: string; error?: string } {
  if (!input || input.trim().length === 0) {
    return { success: false, error: 'Input is empty.' }
  }

  try {
    const parsed = JSON.parse(input)
    return { success: true, minified: JSON.stringify(parsed) }
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message }
  }
}

// UTF-8 safe Base64 encoding
export function encodeBase64(input: string, urlSafe = false): string {
  if (!input) return ''
  const encoder = new TextEncoder()
  const bytes = encoder.encode(input)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  let base64 = btoa(binary)
  if (urlSafe) {
    base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }
  return base64
}

// UTF-8 safe Base64 decoding
export function decodeBase64(
  input: string,
  urlSafe = false
): { success: boolean; decoded?: string; error?: string } {
  if (!input || input.trim().length === 0) {
    return { success: true, decoded: '' }
  }

  try {
    let clean = input.trim()
    if (urlSafe) {
      clean = clean.replace(/-/g, '+').replace(/_/g, '/')
      while (clean.length % 4 !== 0) {
        clean += '='
      }
    }
    const binary = atob(clean)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    const decoder = new TextDecoder()
    const decoded = decoder.decode(bytes)
    return { success: true, decoded }
  } catch (err: unknown) {
    return {
      success: false,
      error: 'Invalid Base64 sequence: ' + (err as Error).message,
    }
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

export function encodeUrl(input: string, componentMode = true): string {
  if (!input) return ''
  try {
    return componentMode ? encodeURIComponent(input) : encodeURI(input)
  } catch (err: unknown) {
    return (err as Error).message
  }
}

export function decodeUrl(
  input: string,
  componentMode = true
): { success: boolean; decoded?: string; error?: string } {
  if (!input) return { success: true, decoded: '' }
  try {
    const decoded = componentMode ? decodeURIComponent(input) : decodeURI(input)
    return { success: true, decoded }
  } catch (err: unknown) {
    return { success: false, error: 'Malformed URI sequence: ' + (err as Error).message }
  }
}

export interface QueryParam {
  key: string
  value: string
}

export function parseQueryParams(input: string): QueryParam[] {
  if (!input) return []
  try {
    let search = input.trim()
    const questionIndex = search.indexOf('?')
    if (questionIndex !== -1) {
      search = search.substring(questionIndex + 1)
    }
    const hashIndex = search.indexOf('#')
    if (hashIndex !== -1) {
      search = search.substring(0, hashIndex)
    }

    const params = new URLSearchParams(search)
    const result: QueryParam[] = []
    params.forEach((value, key) => {
      result.push({ key, value })
    })
    return result
  } catch {
    return []
  }
}
