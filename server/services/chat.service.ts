import {
  getOpenRouterApiKey,
  getOpenRouterAppMeta,
  getOpenRouterModel,
  mapOpenRouterFetchError,
  OPENROUTER_CHAT_URL,
  OPENROUTER_REQUEST_TIMEOUT_MS
} from '#server/shared/openrouter'
import type { OpenRouterChatCompletionResponse, ChatResponseBody } from '#server/types'
import { InternalServerError, UpstreamError } from '#server/utils/error'

function parseAssistantMessage(response: OpenRouterChatCompletionResponse): ChatResponseBody {
  const message = response.choices?.[0]?.message
  const content = message?.content
  const reply = typeof content === 'string' ? content.trim() : ''

  if (!reply) {
    const apiMessage = response.error?.message
    throw new UpstreamError(apiMessage || 'Пустой ответ от модели', 'EMPTY_MODEL_RESPONSE')
  }

  const role: ChatResponseBody['role'] = message?.role === 'user' ? 'user' : 'assistant'

  return { role, reply }
}

export class ChatService {
  async completeMessage(message: string): Promise<ChatResponseBody> {
    const apiKey = getOpenRouterApiKey()
    const { referer, title } = getOpenRouterAppMeta()

    if (!apiKey) {
      throw new InternalServerError('OPENROUTE_KEY не задан. Добавьте ключ в .env')
    }

    let response: OpenRouterChatCompletionResponse

    try {
      response = await $fetch<OpenRouterChatCompletionResponse>(OPENROUTER_CHAT_URL, {
        method: 'POST',
        timeout: OPENROUTER_REQUEST_TIMEOUT_MS,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': referer,
          'X-Title': title
        },
        body: {
          model: getOpenRouterModel(),
          messages: [
            {
              role: 'user',
              content: message
            }
          ]
        }
      })
    } catch (error) {
      throw mapOpenRouterFetchError(error)
    }

    return parseAssistantMessage(response)
  }
}

export const chatService = new ChatService()
