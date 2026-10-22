export const landingPaths = ['/', '/about', '/offerings', '/philosophy', '/faq'] as const

export const isLandingPath = (path: string) => (landingPaths as readonly string[]).includes(path)
