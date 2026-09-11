export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  if (!config.portalApiKey || !id) {
    throw createError({ statusCode: 503, statusMessage: 'Catalog media is not configured' })
  }

  return proxyRequest(event, `${config.portalUrl}/api/store/media/${encodeURIComponent(id)}`, {
    headers: {
      Authorization: `Bearer ${config.portalApiKey}`
    }
  })
})
