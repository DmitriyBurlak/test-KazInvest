<script setup lang="ts">
import highlight from '@comark/vue/plugins/highlight'
import type { ChatMessage } from '~/features/chat-send/model/types'
import { getMessageText } from '~/features/chat-send/lib/get-message-text'

const props = defineProps<{
  message: ChatMessage
}>()

const text = computed(() => getMessageText(props.message))
const highlightPlugin = highlight()
</script>

<template>
  <Comark
    v-if="message.role === 'assistant'"
    :markdown="text"
    :plugins="[highlightPlugin]"
    class="chat-message-md *:first:mt-0 *:last:mb-0 max-w-none"
  />
  <p
    v-else
    class="whitespace-pre-wrap text-sm"
  >
    {{ text }}
  </p>
</template>

<style scoped>
.chat-message-md :deep(pre) {
  overflow-x: auto;
  border-radius: 0.5rem;
}

.chat-message-md :deep(code) {
  font-size: 0.875em;
}
</style>
