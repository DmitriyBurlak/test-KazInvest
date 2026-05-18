<script setup lang="ts">
import { ChatPanel } from '~/widgets/chat-panel'
</script>

<template>
  <UContainer class="flex flex-col h-[calc(100dvh-var(--ui-header-height,4rem))] min-h-0 py-4 sm:py-6">
    <ChatPanel />
  </UContainer>
</template>
