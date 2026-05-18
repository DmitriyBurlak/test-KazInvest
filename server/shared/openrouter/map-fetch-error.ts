import { RateLimitError, UpstreamError } from '#server/utils/error'

export function mapOpenRouterFetchError(error: unknown): never {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const fetchError = error as {
      statusCode?: number
      statusMessage?: string
      data?: {
        error?: { message?: string }
        message?: string
      }
    }

    const status = fetchError.statusCode ?? 502
    const upstreamMessage
      = fetchError.data?.error?.message
        ?? fetchError.data?.message
        ?? fetchError.statusMessage

    if (status === 401 || status === 403) {
      throw new UpstreamError('Неверный API ключ OpenRouter', 'OPENROUTER_AUTH')
    }

    if (status === 429) {
      throw new RateLimitError()
    }

    if (status === 402) {
      throw new UpstreamError('Недостаточно средств или лимит на OpenRouter', 'OPENROUTER_QUOTA')
    }

    throw new UpstreamError(
      upstreamMessage || 'Сервис ИИ временно недоступен',
      'OPENROUTER_ERROR',
      { status }
    )
  }

  throw new UpstreamError('Сервис ИИ временно недоступен', 'OPENROUTER_UNAVAILABLE')
}
