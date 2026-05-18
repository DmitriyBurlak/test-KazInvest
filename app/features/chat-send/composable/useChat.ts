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

  /** Текст текущего запроса — body читается через computed, чтобы execute() не отправлял старое тело */
  const messageToSend = ref<string | null>(null)

  const { data, error: apiError, execute, clear } = useApi<ChatApiResponse>({
    urlPath: '/api/chat',
    options: {
      method: 'POST',
      body: computed(() => ({ message: messageToSend.value ?? '' })),
      immediate: false,
      watch: false,
      dedupe: 'cancel'
    },
    isShowMessageError: true
  })

  const isBusy = computed(() => status.value === 'submitted' || status.value === 'streaming')
  const canSend = computed(() => input.value.trim().length > 0 && !isBusy.value)

  async function sendMessage() {
    const text = input.value.trim()
    if (!text || isBusy.value) {
      return
    }

    const userMessage = createUserMessage(text)
    messages.value.push(userMessage)
    input.value = ''
    status.value = 'submitted'
    messageToSend.value = text

    await nextTick()
    await execute()

    if (apiError.value) {
      const index = messages.value.findIndex(message => message.id === userMessage.id)
      if (index !== -1) {
        messages.value.splice(index, 1)
      }
      input.value = text
      status.value = 'ready'
      messageToSend.value = null
      return
    }

    const response = data.value
    if (response?.reply) {
      messages.value.push(createAssistantMessage(response.reply, response.role))
    }

    status.value = 'ready'
    messageToSend.value = null
  }

  function resetChat() {
    messages.value = []
    input.value = ''
    status.value = 'ready'
    messageToSend.value = null
    clear()
  }

  return {
    messages,
    input,
    status,
    isBusy,
    canSend,
    sendMessage,
    resetChat
  }
}
