<script setup lang="ts">
import { useChat } from '~/features/chat-send'
import { useSpeechRecognition, VoiceInputControls } from '~/features/voice-input'
import { useMessageActions } from '../composable/use-message-actions'

const {
  messages,
  input,
  status,
  isBusy,
  sendMessage,
  resetChat
} = useChat()

const toast = useToast()

const { getActions, copiedMessageId } = useMessageActions()

const messagesWithActions = computed(() => {
  void copiedMessageId.value

  return messages.value.map(message => ({
    ...message,
    actions: getActions(message)
  }))
})

const promptSpacing = 16

const speech = useSpeechRecognition({
  onRecordingStart() {
    input.value = ''
  },
  onRecordingCancel() {
    input.value = ''
  },
  onTranscript(text) {
    input.value = text.trim()
  }
})

const isSpeechSupported = computed(() => speech.isSupported.value)
const isSpeechListening = computed(() => speech.isListening.value)

watch(() => speech.error.value, (message) => {
  if (!message) {
    return
  }

  toast.add({
    title: 'Голосовой ввод',
    description: message,
    color: 'error'
  })
  speech.clearError()
})

function onSubmit() {
  sendMessage()
}

async function onVoiceConfirm() {
  const text = input.value.trim()
  speech.confirm()
  await nextTick()

  if (text) {
    input.value = text
    await sendMessage()
  }
}
</script>

<template>
  <section class="flex flex-col flex-1 min-h-0 w-full max-w-3xl mx-auto gap-4">
    <div class="flex justify-end shrink-0">
      <UButton
        v-if="messages.length"
        label="Очистить"
        color="neutral"
        variant="ghost"
        size="sm"
        icon="i-lucide-trash-2"
        :disabled="isBusy"
        @click="resetChat"
      />
    </div>

    <div class="flex flex-col flex-1 min-h-0 rounded-xl ring ring-default bg-default/50 overflow-hidden">
      <div class="relative flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-2 py-4">
        <div
          v-if="!messages.length"
          class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6 text-center text-muted pointer-events-none"
        >
          <UIcon
            name="i-lucide-message-square-dashed"
            class="size-10 opacity-60"
          />
          <p class="text-sm max-w-sm">
            Что у тебя сегодня на уме?
          </p>
        </div>

        <UChatMessages
          :messages="messagesWithActions"
          :user="{
            side: 'right',
            variant: 'subtle'
          }"
          :assistant="{
            side: 'left',
            avatar: {
              icon: 'i-lucide-bot'
            }
          }"
          :status="status"
          :spacing-offset="promptSpacing"
          should-auto-scroll
          class="w-full"
        >
          <template #indicator>
            <div class="flex items-center gap-2 py-2">
              <UChatShimmer
                text="Думаю…"
                class="text-sm"
              />
            </div>
          </template>
        </UChatMessages>
      </div>

      <div class="shrink-0 border-t border-default bg-default/90 backdrop-blur p-3">
        <UChatPrompt
          v-model="input"
          variant="subtle"
          placeholder="Введите ваше сообщение здесь…"
          :disabled="isBusy || isSpeechListening"
          :maxrows="6"
          class="w-full"
          @submit="onSubmit"
        >
          <template #footer>
            <ClientOnly>
              <VoiceInputControls
                :is-supported="isSpeechSupported"
                :is-listening="isSpeechListening"
                :disabled="isBusy"
                @start="speech.start()"
                @confirm="onVoiceConfirm"
                @cancel="speech.cancel()"
              />
              <template #fallback>
                <USkeleton class="h-9 w-full rounded-md" />
              </template>
            </ClientOnly>
          </template>
        </UChatPrompt>
      </div>
    </div>
  </section>
</template>
