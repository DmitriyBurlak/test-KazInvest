import type { FetchContext } from 'ofetch'

const FALLBACK_MESSAGE = 'Произошла непредвиденная ошибка'

export function getApiErrorMessage(context: FetchContext): string {
  const data = context.response?._data

  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }

  if (context.error?.message?.trim()) {
    return context.error.message
  }

  const status = context.response?.status
  if (status === 408 || context.error?.name === 'TimeoutError') {
    return 'Превышено время ожидания. Попробуйте ещё раз'
  }

  if (!context.response) {
    return 'Нет соединения с сервером. Проверьте сеть'
  }

  if (status && status >= 500) {
    return 'Сервис временно недоступен. Попробуйте позже'
  }

  return FALLBACK_MESSAGE
}
