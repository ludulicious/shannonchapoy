export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  if (!config.portalApiKey || !id) {
    throw createError({ statusCode: 503, statusMessage: 'Catalog media is not configured' })
  }

  const target = new URL(`${config.portalUrl}/api/store/media/${encodeURIComponent(id)}`)
  const purpose = getQuery(event).purpose
  if (typeof purpose === 'string') {
    target.searchParams.set('purpose', purpose)
  }

  return proxyRequest(event, target.toString(), {
    headers: {
      Authorization: `Bearer ${config.portalApiKey}`
    }
  })
})
