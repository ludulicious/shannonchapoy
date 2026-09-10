export const landingPaths = ['/', '/about', '/services', '/philosophy', '/contact'] as const

export const isLandingPath = (path: string) =>
  (landingPaths as readonly string[]).includes(path)
