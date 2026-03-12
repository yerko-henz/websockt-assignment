<script setup lang="ts">
defineProps<{
  username: string;
  onUsernameChange: (value: string) => void;
  onConnect: () => void;
  disabled: boolean;
  onKeyPress: (e: KeyboardEvent) => void;
}>();
</script>

<template>
  <div class="connect-section">
    <input
      type="text"
      placeholder="Enter your username"
      :value="username"
      @input="(e) => onUsernameChange((e.target as HTMLInputElement).value)"
      @keydown="onKeyPress"
      class="username-input"
    />
    <button @click="onConnect" :disabled="disabled" class="connect-button">
      Connect
    </button>
  </div>
</template>
