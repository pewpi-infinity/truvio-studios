/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

interface SparkUser {
  id?: number
  token?: string
  [key: string]: any
}

interface WindowSpark {
  user(): Promise<SparkUser | null>
}

declare global {
  interface Window {
    spark: WindowSpark
  }
}