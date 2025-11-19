/// <reference types="vite/client" />

declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly BASE_URL: string
    readonly VITE_BASE?: string
    readonly GEMINI_API_KEY?: string
    readonly API_KEY?: string
  }
}

