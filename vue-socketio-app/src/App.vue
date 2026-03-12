<script setup lang="ts">
import { ref, computed } from "vue";
import { initSocket, getSocket, disconnectSocket } from "./services/socket";

const username = ref("");
const isConnected = ref(false);
const messages = ref<string[]>([]);
const showDisconnectModal = ref(false);

const isConnectDisabled = computed(
  () => !username.value.trim() || isConnected.value,
);

const connectButtonStyle = computed(() => ({
  marginTop: "10px",
  width: "100%",
  padding: "8px",
  backgroundColor: isConnectDisabled.value ? "#ccc" : "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: isConnectDisabled.value ? "not-allowed" : "pointer",
}));

const handleConnect = () => {
  if (!username.value.trim()) return;
  if (getSocket()) return; // Already initialized

  const socket = initSocket(username.value, "vue");

  socket.on("connect", () => {
    isConnected.value = true;
    console.log("✅ Connected to backend! Socket ID:", socket.id);
  });

  socket.on("disconnect", () => {
    isConnected.value = false;
    console.log("❌ Disconnected from backend");
  });

  socket.on("connect_error", (error: Error) => {
    isConnected.value = false;
    console.error("🔴 Connection error:", error);
  });

  socket.on("message", (data: string) => {
    messages.value.push(data);
  });
};

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    handleConnect();
  }
};

const handleDisconnectClick = () => {
  showDisconnectModal.value = true;
};

const handleConfirmDisconnect = () => {
  disconnectSocket();
  isConnected.value = false;
  messages.value = [];
  username.value = "";
  showDisconnectModal.value = false;
};

const handleCancelDisconnect = () => {
  showDisconnectModal.value = false;
};
</script>

<template>
  <div class="app-container">
    <div class="chat-box">
      <h2>Chat Box</h2>

      <div v-if="!isConnected" style="margin-bottom: 15px">
        <input
          type="text"
          placeholder="Enter your username"
          v-model="username"
          @keydown="handleKeyPress"
          style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
          "
        />
        <button
          @click="handleConnect"
          :disabled="isConnectDisabled"
          :style="connectButtonStyle"
        >
          Connect
        </button>
      </div>

      <div :class="['status-row', isConnected ? 'connected' : 'disconnected']">
        <div
          class="status-badge"
          :class="isConnected ? 'connected' : 'disconnected'"
        >
          {{
            isConnected
              ? `✓ Connected as ${username}`
              : "✗ Not connected to backend"
          }}
        </div>
        <button
          v-if="isConnected"
          @click="handleDisconnectClick"
          class="disconnect-button"
        >
          Disconnect
        </button>
      </div>

      <div v-if="isConnected" class="messages-area">
        <p v-if="messages.length === 0" class="no-messages">No messages yet</p>
        <div
          v-else
          v-for="(msg, index) in messages"
          :key="index"
          class="message"
        >
          {{ msg }}
        </div>
      </div>

      <!-- Disconnect Confirmation Modal -->
      <div
        v-if="showDisconnectModal"
        class="modal-overlay"
        @click="handleCancelDisconnect"
      >
        <div class="modal-content" @click.stop>
          <h3>Confirm Disconnect</h3>
          <p>Are you sure you want to disconnect from the chat server?</p>
          <div class="modal-buttons">
            <button @click="handleCancelDisconnect" class="btn-cancel">
              Cancel
            </button>
            <button @click="handleConfirmDisconnect" class="btn-confirm">
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
}

.chat-box {
  width: 400px;
  height: 500px;
  background-color: white;
  border: 2px solid #333;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.chat-box h2 {
  margin: 0 0 15px 0;
  text-align: center;
}

.chat-box input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  gap: 0.5rem;
}

.status-badge {
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  flex: 1;
}

.status-badge.connected {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.disconnected {
  background-color: #f8d7da;
  color: #721c24;
}

.messages-area {
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  overflow-y: auto;
  background-color: #fafafa;
}

.no-messages {
  text-align: center;
  color: #999;
  margin: 0;
}

.message {
  margin-bottom: 5px;
}

.disconnect-button {
  padding: 10px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  height: 100%;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.modal-content h3 {
  margin: 0 0 15px 0;
}

.modal-content p {
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-confirm {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
