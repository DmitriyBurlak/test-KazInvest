export type ChatRole = 'user' | 'assistant'

export type ChatStatus = 'ready' | 'submitted' | 'streaming' | 'error'

export interface ChatTextPart {
  type: 'text'
  text: string
}

export interface ChatMessage {
  id: string
  role: ChatRole
  parts: ChatTextPart[]
}

