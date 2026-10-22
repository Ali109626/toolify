export type BlogCategoryId =
  | 'pdf-guides'
  | 'image-tools'
  | 'developer-tools'
  | 'text-and-writing'
  | 'calculators'
  | 'productivity-tips'

export interface BlogCategory {
  id: BlogCategoryId
  name: string
  description: string
  icon: string
  badgeColor?: string
}

export interface ArticleFaq {
  question: string
  answer: string
}

export interface ArticleStep {
  title: string
  description: string
  tip?: string
}

export interface ArticleSection {
  id: string
  title: string
  content: string[]
  steps?: ArticleStep[]
  codeSnippet?: {
    language: string
    code: string
    caption?: string
  }
  callout?: {
    type: 'tip' | 'info' | 'warning'
    text: string
  }
}

export interface BlogPost {
  slug: string
  title: string
  seoTitle?: string
  metaDescription: string
  excerpt: string
  category: BlogCategoryId
  publishedAt: string
  updatedAt?: string
  readingTimeMinutes: number
  status: 'published' | 'draft'
  featured?: boolean
  thumbnailGradient: {
    from: string
    to: string
    accent: string
    icon: string
  }
  author: {
    name: string
    role: string
  }
  toolCta?: {
    toolId: string
    toolName: string
    toolPath: string
    buttonText: string
    tagline: string
  }
  introduction: string[]
  sections: ArticleSection[]
  limitations?: string[]
  faqs?: ArticleFaq[]
  relatedSlugs: string[]
}
