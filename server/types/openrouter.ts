export type OpenRouterMessageRole = 'assistant' | 'user' | 'system' | 'tool'

export interface OpenRouterChatMessage {
  role?: OpenRouterMessageRole
  content?: string | null
  refusal?: string | null
  reasoning?: string | null
}

export interface OpenRouterChatCompletionResponse {
  choices?: Array<{
    message?: OpenRouterChatMessage
  }>
  error?: {
    message?: string
  }
}
