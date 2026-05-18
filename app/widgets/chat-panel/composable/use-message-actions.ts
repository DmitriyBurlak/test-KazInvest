import type { ButtonProps } from '@nuxt/ui'
import type { ChatMessage } from '~/features/chat-send/model/types'
import { getMessageText } from '~/features/chat-send/lib/get-message-text'

const COPIED_RESET_MS = 2000

export function useMessageActions() {
  const copiedMessageId = ref<string | null>(null)
  let resetCopiedTimer: ReturnType<typeof setTimeout> | undefined

  function scheduleCopiedReset() {
    if (resetCopiedTimer) {
      clearTimeout(resetCopiedTimer)
    }
    resetCopiedTimer = setTimeout(() => {
      copiedMessageId.value = null
      resetCopiedTimer = undefined
    }, COPIED_RESET_MS)
  }

  async function copyToClipboard(message: ChatMessage) {
    const text = getMessageText(message)
    if (!text) {
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      copiedMessageId.value = message.id
      scheduleCopiedReset()
    } catch {
      copiedMessageId.value = null
    }
  }

  function getActions(message: ChatMessage): ButtonProps[] | undefined {
    if (message.role !== 'assistant') {
      return undefined
    }

    const isCopied = copiedMessageId.value === message.id

    return [
      {
        label: isCopied ? 'Скопировано' : 'Копировать',
        icon: isCopied ? 'i-lucide-check' : 'i-lucide-copy',
        onClick: () => copyToClipboard(message)
      }
    ]
  }

  onBeforeUnmount(() => {
    if (resetCopiedTimer) {
      clearTimeout(resetCopiedTimer)
    }
  })

  return {
    copiedMessageId,
    getActions,
    copyToClipboard
  }
}
