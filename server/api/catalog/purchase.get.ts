type PurchaseResponse = {
  status: string
  files: Array<{ id: string; name: string; url: string }>
}

export default defineEventHandler(async (event) => {
  setHeaders(event, { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer' })
  const token = getQuery(event).purchase
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid purchase link' })
  }
  const config = useRuntimeConfig()
  try {
    const purchase = await $fetch<PurchaseResponse>(`/api/store/purchases/${token}`, {
      baseURL: config.portalUrl
    })
    return { status: purchase.status, files: purchase.status === 'paid' ? purchase.files : [] }
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Purchase downloads are currently unavailable' })
  }
})
