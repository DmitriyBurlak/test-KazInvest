import { useFetch, useRuntimeConfig, type UseFetchOptions } from 'nuxt/app'
import type { ResponseDto } from './types'
import { getApiErrorMessage } from './get-api-error-message'

/**
 * ResponseT — тип ответа сервера (поле data в ResponseDto, либо тело ответа целиком).
 * MappedResponseT — результат transform; generic не нужен, если задан transform.
 */
export function useApi<ResponseT, MappedResponseT = ResponseT>({
  urlPath,
  options,
  isShowMessageError = false,
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
      if (isClient && isShowMessageError) {
        toast.add({
          title: 'Ошибка',
          description: getApiErrorMessage(context),
          color: 'error'
        })
      }

      if (typeof userOnResponseError === 'function') {
        await userOnResponseError(context)
      }
    }
  }

  return useFetch(urlPath, fetchOptions)
}
