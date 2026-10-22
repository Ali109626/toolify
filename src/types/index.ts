export type CategoryType = 'image' | 'pdf' | 'text' | 'developer' | 'calculators' | 'productivity'

export interface ToolItem {
  id: string
  name: string
  shortDescription: string
  description: string
  category: CategoryType
  icon: string
  path: string
  keywords: string[]
  badge?: string
  features: string[]
  howTo: {
    title: string
    description: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
}

export interface CategoryInfo {
  id: CategoryType
  name: string
  description: string
  icon: string
}

export interface RecentToolRecord {
  id: string
  name: string
  path: string
  category: CategoryType
  timestamp: number
}
