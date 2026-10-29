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
  answer: string
  categories?: string[]
  order?: number
  isActive?: boolean
}
type FaqCategory = { slug: string; title: string; order?: number }

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

export const selectedFaqs = (faqs: Faq[], selection: FaqSelection) =>
  ordered(faqs)
    .filter(
      (faq) =>
        faq.isActive !== false &&
        (selection.faqSlugs?.includes(faq.slug) ||
          (faq.categories ?? []).some((category) => selection.faqCategories?.includes(category)))
    )
    .map((faq) => ({ ...faq, question: faq.title }))

export const groupedFaqs = (faqs: ReturnType<typeof selectedFaqs>, categories: FaqCategory[]) => {
  const remaining = new Set(faqs)
  const groups = ordered(categories).flatMap((category) => {
    const items = faqs.filter((faq) => remaining.has(faq) && faq.categories?.includes(category.slug))
    for (const item of items) {
      remaining.delete(item)
    }
    return items.length ? [{ title: category.title, items }] : []
  })
  if (remaining.size) {
    groups.push({ title: '', items: [...remaining] })
  }
  return groups
}
