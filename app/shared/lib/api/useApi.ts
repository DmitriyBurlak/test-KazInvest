import { useFetch, useRuntimeConfig, type UseFetchOptions } from 'nuxt/app'
import type { ResponseDto } from './types'

/**
 * ResponseT — тип ответа сервера (поле data в ResponseDto, либо тело ответа целиком).
 * MappedResponseT — результат transform; generic не нужен, если задан transform.
 */
export function useApi<ResponseT, MappedResponseT = ResponseT>({
  urlPath,
  options,
  isShowMessageError,
  server = false
}: {
  urlPath: string
  options: UseFetchOptions<ResponseDto<ResponseT> | ResponseT, MappedResponseT>
  isShowMessageError?: boolean
  server?: boolean
}) {
  const config = useRuntimeConfig()
  const baseURL = config.public.baseURL as string | undefined
  const isClient = import.meta.client
  const toast = useToast()

  const headers = server ? useRequestHeaders(['cookie']) : {}
  const { onResponseError: userOnResponseError, ...restOptions } = options

  const fetchOptions: UseFetchOptions<ResponseDto<ResponseT> | ResponseT, MappedResponseT> = {
    ...(baseURL ? { baseURL } : {}),
    ...restOptions,
    credentials: 'include',
    headers,
    server,
    async onResponseError(context) {
      if (!isClient) {
        return
      }

      const responseData = context.response._data as { message?: string } | undefined
      const message = responseData?.message

      if (isShowMessageError) {
        toast.add({
          title: 'Ошибка',
          description: message || 'Произошла непредвиденная ошибка',
          color: 'error'
        })
      }

      if (typeof userOnResponseError === 'function') {
        // TODO: разобрать по сле api
        await userOnResponseError(context)
      }
    }
  }

  return useFetch(urlPath, fetchOptions)
}
