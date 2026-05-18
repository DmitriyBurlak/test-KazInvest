<script setup lang="ts">
defineProps<{
  active?: boolean
}>()
</script>

<template>
  <div
    class="voice-visualizer"
    :class="{ 'voice-visualizer--active': active }"
    role="status"
    :aria-label="active ? 'Идёт запись' : undefined"
    aria-live="polite"
  >
    <span
      v-for="i in 5"
      :key="i"
      class="voice-visualizer__bar"
      :style="{ '--bar-index': i }"
    />
  </div>
</template>

<style scoped>
.voice-visualizer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 2rem;
  min-width: 0;
  flex: 1;
}

.voice-visualizer__bar {
  width: 3px;
  height: 6px;
  border-radius: 9999px;
  background: var(--ui-text-muted);
  opacity: 0.35;
  transform-origin: center bottom;
}

.voice-visualizer--active .voice-visualizer__bar {
  background: var(--ui-primary);
  opacity: 1;
  animation: voice-bar 0.85s ease-in-out infinite;
  animation-delay: calc(var(--bar-index) * 0.1s);
}

@keyframes voice-bar {
  0%,
  100% {
    transform: scaleY(0.35);
  }

  50% {
    transform: scaleY(1);
  }
}
</style>
