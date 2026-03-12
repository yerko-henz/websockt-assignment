<script setup lang="ts">
defineProps<{
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}>();
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="onCancel">
    <div class="modal-content" @click.stop>
      <h3>Confirm Disconnect</h3>
      <p>Are you sure you want to disconnect from the chat server?</p>
      <div class="modal-buttons">
        <button @click="onCancel" class="btn-cancel">Cancel</button>
        <button @click="onConfirm" class="btn-confirm">Disconnect</button>
      </div>
    </div>
  </div>
</template>
