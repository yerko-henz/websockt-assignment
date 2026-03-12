<script setup lang="ts">
defineProps<{
  messages: string[];
  currentUsername: string;
}>();
</script>

<template>
  <div class="messages-area">
    <p v-if="messages.length === 0" class="no-messages">No messages yet</p>
    <div
      v-else
      v-for="(msg, index) in messages"
      :key="index"
      class="message"
      :class="{ 'own-message': msg.startsWith(currentUsername + ':') }"
    >
      <span v-if="msg.startsWith(currentUsername + ':')" class="you-tag"
        >(you)</span
      >
      {{ msg }}
    </div>
  </div>
</template>
