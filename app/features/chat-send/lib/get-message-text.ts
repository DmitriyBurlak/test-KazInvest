import type { ChatMessage, ChatTextPart } from '../model/types'

export function getMessageText(message: ChatMessage): string {
  return message.parts
    .filter((part): part is ChatTextPart => part.type === 'text')
    .map(part => part.text)
    .join('')
}
