import type { MaybeRefOrGetter } from 'vue'
import { groupedFaqs, selectedFaqs, type FaqSelection } from '~/utils/managedContent'

export const useFaqs = async (selection: MaybeRefOrGetter<FaqSelection | null | undefined>) => {
  const [{ data: faqs }, { data: categories }] = await Promise.all([
    useAsyncData('shared-faqs', () => queryCollection('faqs').all()),
    useAsyncData('shared-faq-categories', () => queryCollection('faq_categories').all())
  ])
  const items = computed(() => selectedFaqs(faqs.value ?? [], toValue(selection) ?? {}))
  const groups = computed(() => groupedFaqs(items.value, categories.value ?? []))
  return { items, groups }
}
