import type { MaybeRefOrGetter } from 'vue'
import { groupedFaqs, selectedFaqs, type FaqSelection } from '~/utils/managedContent'

export const useFaqs = async (
  selection: MaybeRefOrGetter<FaqSelection | null | undefined>,
  { includeCategories = false }: { includeCategories?: boolean } = {}
) => {
  const { data: faqs } = await useAsyncData('shared-faqs', () => queryCollection('faqs').all())
  const items = computed(() => {
    const chosen = toValue(selection) ?? {}
    return selectedFaqs(faqs.value ?? [], includeCategories ? chosen : { faqSlugs: chosen.faqSlugs })
  })
  const groups = computed(() =>
    includeCategories
      ? groupedFaqs(items.value, toValue(selection)?.faqCategories ?? [])
      : items.value.length
        ? [{ title: '', items: items.value }]
        : []
  )
  return { items, groups }
}
