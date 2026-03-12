<script setup lang="ts">
defineProps<{
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: KeyboardEvent) => void;
  disabled: boolean;
}>();
</script>

<template>
  <div class="message-input-section">
    <input
      type="text"
      placeholder="Type your message..."
      :value="value"
      @input="(e) => onChange((e.target as HTMLInputElement).value)"
      @keydown="onKeyPress"
      class="message-input"
    />
    <button @click="onSend" :disabled="disabled" class="send-button">
      Send
    </button>
  </div>
</template>
