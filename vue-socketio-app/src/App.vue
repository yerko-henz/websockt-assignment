<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { initSocket, getSocket, disconnectSocket } from "./services/socket";
import { useChatStore } from "./stores/chatStore";
import {
  ConnectionSection,
  StatusBadge,
  MessagesArea,
  MessageInput,
  DisconnectModal,
} from "./components";

const MESSAGES_STORAGE_KEY = "chat_global_messages";

const chatStore = useChatStore();
const { username, isConnected } = storeToRefs(chatStore);
const { setIsConnected, clearStore } = chatStore;

const messages = ref<string[]>([]);
const messageInput = ref("");
const showDisconnectModal = ref(false);
const hasAutoConnected = ref(false);

// Load stored messages on mount
onMounted(() => {
  const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);

  if (storedMessages) {
    messages.value = JSON.parse(storedMessages);
  }

  // Auto-connect if stored username exists (handled by Pinia store initialization)
  if (username.value && !hasAutoConnected.value && !getSocket()) {
    hasAutoConnected.value = true;
    const socket = initSocket(username.value, "vue");
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Connected to backend! Socket ID:", socket.id);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("❌ Disconnected from backend");
    });
    socket.on("connect_error", (error: Error) => {
      setIsConnected(false);
      console.error("🔴 Connection error:", error);
    });
    socket.on("message", (data: string) => {
      messages.value.push(data);
      localStorage.setItem(
        MESSAGES_STORAGE_KEY,
        JSON.stringify(messages.value),
      );
    });
  }
});

const isConnectDisabled = computed(
  () => !username.value.trim() || isConnected.value,
);

const handleConnect = () => {
  if (!username.value.trim()) return;
  if (getSocket()) return; // Already initialized

  const socket = initSocket(username.value, "vue");

  socket.on("connect", () => {
    setIsConnected(true);
    console.log("✅ Connected to backend! Socket ID:", socket.id);
  });

  socket.on("disconnect", () => {
    setIsConnected(false);
    console.log("❌ Disconnected from backend");
  });

  socket.on("connect_error", (error: Error) => {
    setIsConnected(false);
    console.error("🔴 Connection error:", error);
  });

  socket.on("message", (data: string) => {
    messages.value.push(data);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages.value));
  });
};

const handleSendMessage = () => {
  if (!messageInput.value.trim() || !getSocket()) return;

  const socket = getSocket()!;
  const messageWithSender = `${username.value}: ${messageInput.value}`;
  socket.emit("message", messageWithSender);
  messageInput.value = "";
};

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    if (isConnected.value) {
      handleSendMessage();
    } else if (username.value.trim()) {
      handleConnect();
    }
  }
};

const handleDisconnectClick = () => {
  showDisconnectModal.value = true;
};

const handleConfirmDisconnect = () => {
  disconnectSocket();
  setIsConnected(false);
  messages.value = [];
  messageInput.value = "";
  clearStore();
  localStorage.removeItem(MESSAGES_STORAGE_KEY);
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

      <ConnectionSection
        v-if="!isConnected"
        :username="username"
        :on-username-change="(value: string) => (username = value)"
        :on-connect="handleConnect"
        :disabled="isConnectDisabled"
        :on-key-press="handleKeyPress"
      />

      <div class="status-row">
        <StatusBadge :is-connected="isConnected" :username="username" />
        <button
          v-if="isConnected"
          @click="handleDisconnectClick"
          class="disconnect-button"
        >
          Disconnect
        </button>
      </div>

      <template v-if="isConnected">
        <MessagesArea :messages="messages" :current-username="username" />
        <MessageInput
          :value="messageInput"
          :on-change="(value: string) => (messageInput = value)"
          :on-send="handleSendMessage"
          :on-key-press="handleKeyPress"
          :disabled="!messageInput.trim()"
        />
      </template>

      <DisconnectModal
        :show="showDisconnectModal"
        :on-confirm="handleConfirmDisconnect"
        :on-cancel="handleCancelDisconnect"
      />
    </div>
  </div>
</template>

<style>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--color-background);
  margin: 0;
  padding: 0;
}

.chat-box {
  width: var(--chat-box-width);
  height: var(--chat-box-height);
  background-color: var(--color-surface);
  border: var(--border-width-thick) solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--padding-lg);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-default);
  position: relative;
}

.chat-box h2 {
  margin: 0 0 15px 0;
  text-align: center;
}

.connect-section {
  margin-bottom: 15px;
}

.username-input {
  width: 100%;
  padding: var(--padding-xs);
  border: var(--border-width-thin) solid var(--color-border-light);
  border-radius: var(--border-radius-sm);
  box-sizing: border-box;
}

.connect-button {
  margin-top: 10px;
  width: 100%;
  padding: var(--padding-xs);
  background-color: var(--color-primary);
  color: var(--color-text);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
}

.connect-button:disabled {
  background-color: var(--color-disabled);
  cursor: not-allowed;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  gap: 0.5rem;
}

.status-badge {
  padding: var(--padding-sm);
  border-radius: var(--border-radius-sm);
  text-align: center;
  font-weight: bold;
  flex: 1;
}

.status-badge.connected {
  background-color: var(--color-success);
  color: var(--color-success-text);
}

.status-badge.disconnected {
  background-color: var(--color-error);
  color: var(--color-error-text);
}

.disconnect-button {
  padding: var(--padding-sm) var(--padding-md);
  background-color: var(--color-danger);
  color: var(--color-text);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  white-space: nowrap;
  height: 100%;
}

.messages-area {
  flex: 1;
  border: var(--border-width-thin) solid var(--color-border-light);
  border-radius: var(--border-radius-sm);
  padding: var(--padding-sm);
  margin-bottom: 10px;
  overflow-y: auto;
  background-color: var(--color-messages-area);
}

.no-messages {
  text-align: center;
  color: var(--color-placeholder);
  margin: 0;
}

.message {
  margin-bottom: 5px;
}

.message.own-message {
  font-weight: bold;
}

.you-tag {
  font-weight: bold;
}

.message-input-section {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.message-input {
  flex: 1;
  padding: var(--padding-xs);
  border: var(--border-width-thin) solid var(--color-border-light);
  border-radius: var(--border-radius-sm);
  box-sizing: border-box;
}

.send-button {
  padding: var(--padding-xs) var(--padding-md);
  background-color: var(--color-primary);
  color: var(--color-text);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  white-space: nowrap;
}

.send-button:disabled {
  background-color: var(--color-disabled);
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-modal-overlay);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-surface);
  padding: var(--padding-xl);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-default);
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
  padding: var(--padding-xs) var(--padding-md);
  background-color: var(--color-secondary);
  color: var(--color-text);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
}

.btn-confirm {
  padding: var(--padding-xs) var(--padding-md);
  background-color: var(--color-danger);
  color: var(--color-text);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
}
</style>
