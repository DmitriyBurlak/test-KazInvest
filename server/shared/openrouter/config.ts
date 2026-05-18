export function getOpenRouterApiKey(): string {
  const config = useRuntimeConfig()

  return (
    config.openrouterApiKey
    || process.env.NUXT_OPENROUTER_API_KEY
    || ''
  )
}

export function getOpenRouterModel(): string {
  const config = useRuntimeConfig()

  return (
    config.openrouterModel
    || process.env.NUXT_OPENROUTER_MODEL
    || 'openai/gpt-4o-mini'
  )
}

export function getOpenRouterAppMeta() {
  const config = useRuntimeConfig()

  return {
    referer: config.public.appUrl || process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: config.public.appName || process.env.NUXT_PUBLIC_APP_NAME || 'Test Chat'
  }
}
