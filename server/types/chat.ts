export type ChatMessageRole = 'user' | 'assistant'

export interface ChatRequestBody {
  message?: string
}

export interface ChatResponseBody {
  role: ChatMessageRole
  reply: string
}
