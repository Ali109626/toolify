import { useEffect } from 'react'
import { siteConfig } from '../config/site'

interface MetaOptions {
  canonicalPath?: string
  ogType?: 'website' | 'article'
  ogImage?: string
  structuredData?: Record<string, unknown>
}

export function usePageMeta(
  title?: string,
  description?: string,
  options?: MetaOptions
) {
  useEffect(() => {
    const originalTitle = document.title
    if (title) {
      document.title = `${title} — ${siteConfig.name}`
    } else {
      document.title = `${siteConfig.name} — ${siteConfig.tagline}`
    }

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    if (description) {
      metaDesc.setAttribute('content', description)
    }

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (options?.canonicalPath) {
      const canonicalUrl = `${siteConfig.url}${options.canonicalPath.startsWith('/') ? options.canonicalPath : `/${options.canonicalPath}`}`
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', canonicalUrl)
    }

    // OpenGraph tags
    const updateOrCreateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    if (title) {
      updateOrCreateMeta('og:title', `${title} — ${siteConfig.name}`)
    }
    if (description) {
      updateOrCreateMeta('og:description', description)
    }
    if (options?.canonicalPath) {
      updateOrCreateMeta('og:url', `${siteConfig.url}${options.canonicalPath}`)
    }
    if (options?.ogType) {
      updateOrCreateMeta('og:type', options.ogType)
    }

    // JSON-LD Structured Data
    let scriptTag: HTMLScriptElement | null = null
    if (options?.structuredData) {
      scriptTag = document.createElement('script')
      scriptTag.type = 'application/ld+json'
      scriptTag.text = JSON.stringify(options.structuredData)
      scriptTag.id = 'page-structured-data'
      document.head.appendChild(scriptTag)
    }

    return () => {
      document.title = originalTitle
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag)
      }
    }
  }, [title, description, options?.canonicalPath, options?.ogType, options?.ogImage, options?.structuredData])
}
