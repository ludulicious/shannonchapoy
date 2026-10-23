type TurnstileOptions = {
  sitekey: string
  action: string
  theme: 'light'
  size: 'flexible' | 'compact'
  'response-field': true
  'response-field-name': 'turnstileToken'
  callback: (token: string) => void
  'expired-callback': () => void
  'error-callback': () => void
  'timeout-callback': () => void
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileOptions) => string
      reset: (id: string) => void
      remove: (id: string) => void
    }
  }
}

let loading: Promise<void> | undefined

export function loadTurnstile(): Promise<void> {
  if (window.turnstile) {
    return Promise.resolve()
  }
  if (loading) {
    return loading
  }
  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    const fail = () => {
      window.clearTimeout(timeout)
      script.remove()
      reject(new Error('Security check could not load'))
    }
    const timeout = window.setTimeout(fail, 15000)
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onload = () => {
      window.clearTimeout(timeout)
      if (window.turnstile) {
        resolve()
      } else {
        fail()
      }
    }
    script.onerror = fail
    document.head.appendChild(script)
  }).catch((error) => {
    loading = undefined
    throw error
  })
  return loading
}
