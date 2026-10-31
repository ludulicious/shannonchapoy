export type FaqSelection = {
  faqSlugs?: string[]
  faqCategories?: string[]
}

export type ManagedOffering = FaqSelection & {
  slug: string
  order?: number
  isActive?: boolean
  isFeatured?: boolean
}

type PublicProduct = { slug: string; visibility?: string }
type Faq = {
  slug: string
  title: string
  body: { value: unknown[] }
  categories?: string[]
  order?: number
  isActive?: boolean
}

const ordered = <T extends { order?: number; slug: string }>(items: T[]) =>
  [...items].sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.slug.localeCompare(b.slug))

// Studio controls inclusion and order. Portal publication and visibility still apply.
export const managedCatalogProducts = <T extends PublicProduct>(products: T[], offerings: ManagedOffering[]) => {
  const seen = new Set<string>()
  return ordered(offerings).flatMap((offering) => {
    if (!offering.isActive || seen.has(offering.slug)) {
      return []
    }
    const product = products.find((item) => item.slug === offering.slug && item.visibility !== 'unlisted')
    if (!product) {
      return []
    }
    seen.add(offering.slug)
    return [{ ...product, isFeatured: !!offering.isFeatured }]
  })
}

// Read the same parsed Markdown rendered in the answer panel for FAQ structured data.
export const faqAnswerText = (body: { value: unknown[] }) => {
  const blockTags = new Set(['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'pre', 'br', 'hr'])
  const read = (node: unknown): string => {
    if (typeof node === 'string') {
      return node
    }
    if (!Array.isArray(node)) {
      return ''
    }
    if (typeof node[0] === 'string' && node[1] && typeof node[1] === 'object' && !Array.isArray(node[1])) {
      const [tag, props, ...children] = node
      if (tag === 'img') {
        return typeof props.alt === 'string' ? props.alt : ''
      }
      const text = children.map(read).join('')
      return blockTags.has(tag) ? ` ${text} ` : text
    }
    return node.map(read).join('')
  }
  return read(body.value).replace(/\s+/g, ' ').trim()
}

export const selectedFaqs = (faqs: Faq[], selection: FaqSelection) => {
  const selected = (selection.faqSlugs ?? []).flatMap((slug) => faqs.find((faq) => faq.slug === slug) ?? [])
  const fromCategories = ordered(faqs).filter((faq) =>
    (faq.categories ?? []).some((category) => selection.faqCategories?.includes(category))
  )
  const seen = new Set<string>()
  return [...selected, ...fromCategories]
    .filter((faq) => {
      if (faq.isActive === false || seen.has(faq.slug)) {
        return false
      }
      seen.add(faq.slug)
      return true
    })
    .map((faq) => ({ ...faq, question: faq.title, answer: faqAnswerText(faq.body) }))
}

export const groupedFaqs = (faqs: ReturnType<typeof selectedFaqs>, categories: string[] = []) => {
  const remaining = new Set(faqs)
  const categoryNames = new Set([...categories, ...faqs.flatMap((faq) => faq.categories ?? [])])
  const groups = [...categoryNames].flatMap((category) => {
    const items = faqs.filter((faq) => remaining.has(faq) && faq.categories?.includes(category))
    for (const item of items) {
      remaining.delete(item)
    }
    return items.length ? [{ title: category, items }] : []
  })
  if (remaining.size) {
    groups.push({ title: '', items: [...remaining] })
  }
  return groups
}

export type FaqGroup = ReturnType<typeof groupedFaqs>[number]
