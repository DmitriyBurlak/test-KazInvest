import type { H3Event } from 'h3'
import { chatService } from '#server/services'
import type { ChatRequestBody, ChatResponseBody } from '#server/types'
import { ValidationError } from '#server/utils/error'

const MAX_MESSAGE_LENGTH = 500

export const chatController = {
  async sendMessage(event: H3Event): Promise<ChatResponseBody> {
    const body = await readBody<ChatRequestBody>(event)
    const message = body?.message?.trim()

    if (!message) {
      throw new ValidationError('Сообщение не может быть пустым')
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new ValidationError(`Сообщение не длиннее ${MAX_MESSAGE_LENGTH} символов`)
    }

    return chatService.completeMessage(message)
  }
}
