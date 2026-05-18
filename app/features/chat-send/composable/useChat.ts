import type { ChatMessage, ChatStatus } from '../model/types'
import { createAssistantMessage, createUserMessage } from '../lib/create-message'
import { useApi } from '~/shared'

interface ChatApiResponse {
  role: 'user' | 'assistant'
  reply: string
}

export function useChat() {
  const messages = ref<ChatMessage[]>([])
  const input = ref('')
  const status = ref<ChatStatus>('ready')
  const error = ref<string | null>(null)

  const requestBody = ref({ message: '' })

  const { data, error: apiError, execute } = useApi<ChatApiResponse>({
    urlPath: '/api/chat',
    options: {
      method: 'POST',
      body: requestBody,
      immediate: false,
      watch: false
    },
    isShowMessageError: false
  })

  const isBusy = computed(() => status.value === 'submitted' || status.value === 'streaming')
  const canSend = computed(() => input.value.trim().length > 0 && !isBusy.value)

  function clearError() {
    error.value = null
  }

  async function sendMessage() {
    const text = input.value.trim()
    if (!text || isBusy.value) {
      return
    }

    clearError()
    messages.value.push(createUserMessage(text))
    input.value = ''
    status.value = 'submitted'
    requestBody.value = { message: text }

    await execute()

    if (apiError.value) {
      status.value = 'error'
      error.value = apiError.value.message || 'Не удалось получить ответ. Попробуйте ещё раз.'
      return
    }

    const response = data.value
    if (response?.reply) {
      messages.value.push(createAssistantMessage(response.reply, response.role))
    }

    status.value = 'ready'
  }

  function resetChat() {
    messages.value = []
    input.value = ''
    status.value = 'ready'
    clearError()
  }

  return {
    messages,
    input,
    status,
    error,
    isBusy,
    canSend,
    clearError,
    sendMessage,
    resetChat
  }
}
