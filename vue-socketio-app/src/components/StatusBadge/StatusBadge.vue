<script setup lang="ts">
defineProps<{
  isConnected: boolean;
  username: string;
}>();
</script>

<template>
  <div class="status-badge" :class="isConnected ? 'connected' : 'disconnected'">
    {{
      isConnected ? `✓ Connected as ${username}` : "✗ Not connected to backend"
    }}
  </div>
</template>
