import type { ChatMessage, ChatRole } from '../model/types'
import { createId } from '~/shared'

function createMessage(role: ChatRole, text: string): ChatMessage {
  return {
    id: createId(),
    role,
    parts: [{ type: 'text', text }]
  }
}
export function createUserMessage(text: string): ChatMessage {
  return createMessage('user', text)
}

export function createAssistantMessage(text: string, role: ChatRole = 'assistant'): ChatMessage {
  return createMessage(role, text)
}
