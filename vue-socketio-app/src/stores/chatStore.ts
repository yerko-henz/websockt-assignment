import { defineStore } from "pinia";
import { ref } from "vue";

const USERNAME_STORAGE_KEY = "chat_username";

export const useChatStore = defineStore("chat", () => {
  const username = ref("");
  const isConnected = ref(false);

  const storedUsername = localStorage.getItem(USERNAME_STORAGE_KEY);
  if (storedUsername) {
    username.value = storedUsername;
  }

  const setUsername = (value: string) => {
    username.value = value;
    localStorage.setItem(USERNAME_STORAGE_KEY, value);
  };

  const setIsConnected = (value: boolean) => {
    isConnected.value = value;
  };

  const clearStore = () => {
    username.value = "";
    isConnected.value = false;
    localStorage.removeItem(USERNAME_STORAGE_KEY);
  };

  return {
    username,
    isConnected,
    setUsername,
    setIsConnected,
    clearStore,
  };
});
