export default defineEventHandler((event) => {
  // Set CORS headers to allow requests from actions.shannonchapoy.com
  setHeaders(event, {
    'Access-Control-Allow-Origin': 'https://actions.shannonchapoy.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400' // 24 hours
  })

  // Handle OPTIONS preflight requests
  if (event.method === 'OPTIONS') {
    setResponseStatus(event, 204)
    return null
  }
})
