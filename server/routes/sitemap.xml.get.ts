import { queryCollection } from '@nuxt/content/server'

const siteUrl = 'https://shannonchapoy.com'
const pagePaths = [
  '/',
  '/contact',
  '/pj-circle',
  '/one-on-one-love-coaching',
  '/art-of-dating-yourself',
  '/privacy',
  '/terms'
]

export default defineEventHandler(async (event) => {
  const pages = await queryCollection(event, 'content').all()
  const urls = new Set<string>()
  for (const path of pagePaths) {
    const page = pages.find((item) => item.path === path)
    if (!page || page.seo?.noindex) {
      continue
    }
    try {
      const url = new URL(page.seo?.canonical || path, siteUrl)
      if (url.origin !== siteUrl) {
        continue
      }
      url.search = ''
      url.hash = ''
      urls.add(url.href)
    } catch {
      urls.add(new URL(path, siteUrl).href)
    }
  }
  const escapeXml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...urls].map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}\n</urlset>`
})
