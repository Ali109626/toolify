import { useLocalStorage } from './useLocalStorage'
import type { RecentToolRecord } from '../types'
import { TOOLS } from '../config/site'

const STORAGE_KEY = 'toolify_recent_tools'
const MAX_RECENTS = 6

export function useRecentTools() {
  const [recents, setRecents] = useLocalStorage<RecentToolRecord[]>(STORAGE_KEY, [])

  const addRecent = (toolId: string) => {
    const tool = TOOLS.find((t) => t.id === toolId)
    if (!tool) return

    setRecents((prev) => {
      const filtered = prev.filter((item) => item.id !== toolId)
      const newRecord: RecentToolRecord = {
        id: tool.id,
        name: tool.name,
        path: tool.path,
        category: tool.category,
        timestamp: Date.now(),
      }
      return [newRecord, ...filtered].slice(0, MAX_RECENTS)
    })
  }

  const clearRecents = () => {
    setRecents([])
  }

  return { recents, addRecent, clearRecents }
}
