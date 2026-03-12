import { create } from "zustand";
import { persist } from "zustand/middleware";

const USERNAME_STORAGE_KEY = "chat_username";

interface ChatState {
  username: string;
  isConnected: boolean;
  setUsername: (username: string) => void;
  setIsConnected: (isConnected: boolean) => void;
  clearStore: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      username: "",
      isConnected: false,
      setUsername: (username) => {
        localStorage.setItem(USERNAME_STORAGE_KEY, username);
        set({ username });
      },
      setIsConnected: (isConnected) => set({ isConnected }),
      clearStore: () =>
        set({
          username: "",
          isConnected: false,
        }),
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        username: state.username,
        isConnected: state.isConnected,
      }),
    },
  ),
);
