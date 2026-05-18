<script setup lang="ts">
import VoiceVisualizer from './VoiceVisualizer.vue'

const props = defineProps<{
  isSupported: boolean
  isListening: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  start: []
  confirm: []
  cancel: []
}>()

const micLabel = computed(() => {
  if (!props.isSupported) {
    return 'Голосовой ввод недоступен'
  }
  return 'Начать диктовку'
})
</script>

<template>
  <div
    class="flex items-end w-full min-h-9"
    :class="isListening ? 'gap-2' : 'justify-end'"
  >
    <template v-if="isListening">
      <VoiceVisualizer active />

      <UTooltip text="Отменить диктовку">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-x"
          size="md"
          aria-label="Отменить диктовку"
          :disabled="disabled"
          @click="emit('cancel')"
        />
      </UTooltip>

      <UTooltip text="Готово">
        <UButton
          color="neutral"
          variant="soft"
          size="md"
          icon="i-lucide-check"
          aria-label="Готово"
          :disabled="disabled"
          @click="emit('confirm')"
        />
      </UTooltip>
    </template>

    <UTooltip
      v-else
      :text="micLabel"
    >
      <UButton
        type="button"
        color="neutral"
        variant="ghost"
        square
        size="md"
        icon="i-lucide-mic"
        :disabled="!isSupported || disabled"
        :aria-label="micLabel"
        @click="emit('start')"
      />
    </UTooltip>
  </div>
</template>
