export default defineEventHandler((event) => {
  // Only set headers for HTML responses (not API routes or static files)
  const url = getRequestURL(event);
  const pathname = url.pathname;
  
  // Skip for API routes and static assets
  if (pathname.startsWith('/api/') || 
      pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    return;
  }

  // Set comprehensive CSP headers for iframe and form resources
  setHeaders(event, {
    'Content-Security-Policy': [
      "default-src 'self'",
      "frame-src 'self' https://actions.shannonchapoy.com https://storage.googleapis.com https://*.googleapis.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://actions.shannonchapoy.com https://storage.googleapis.com https://*.googleapis.com",
      "connect-src 'self' https://actions.shannonchapoy.com https://backend.leadconnectorhq.com https://storage.googleapis.com https://*.googleapis.com https://*.leadconnectorhq.com",
      "img-src 'self' data: https: blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://actions.shannonchapoy.com",
      "frame-ancestors 'self'"
    ].join('; '),
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'autoplay=*, camera=(), microphone=(), geolocation=()'
  });
});

