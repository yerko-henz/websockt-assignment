import { useEffect, useRef, useState } from "react";
import { initSocket, getSocket, disconnectSocket } from "./services/socket";
import { useChatStore } from "./stores/chatStore";
import "../../theme/theme.css";
import "./App.css";
import {
  ConnectionSection,
  StatusBadge,
  MessagesArea,
  MessageInput,
  DisconnectModal,
} from "./components";

function App() {
  const { username, isConnected, setIsConnected, clearStore } = useChatStore();
  const [messageInput, setMessageInput] = useState("");
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const hasAutoConnectedRef = useRef(false);

  // Auto-connect if stored username exists on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("chat_username");
    if (storedUsername && !hasAutoConnectedRef.current) {
      hasAutoConnectedRef.current = true;
      if (!getSocket()) {
        const socket = initSocket(storedUsername, "react");
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
          // MessagesArea handles its own state from localStorage
          console.log("Received message:", data);
        });
      }
    }
  }, [setIsConnected]);

  const handleConnect = () => {
    if (!username.trim()) return;
    if (getSocket()) return; // Already initialized

    const socket = initSocket(username, "react");

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
      // MessagesArea handles its own state from localStorage
      console.log("Received message:", data);
    });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !getSocket()) return;

    const socket = getSocket()!;
    const messageWithSender = `${username}: ${messageInput}`;
    socket.emit("message", messageWithSender);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isConnected) {
        handleSendMessage();
      } else if (username.trim()) {
        handleConnect();
      }
    }
  };

  const handleDisconnectClick = () => {
    setShowDisconnectModal(true);
  };

  const handleConfirmDisconnect = () => {
    disconnectSocket();
    setIsConnected(false);
    clearStore();
    localStorage.removeItem("chat_global_messages");
    setMessageInput("");
    setShowDisconnectModal(false);
  };

  const handleCancelDisconnect = () => {
    setShowDisconnectModal(false);
  };

  return (
    <div className="app-container">
      <div className="chat-box">
        <h2>Chat Box</h2>

        {!isConnected && <ConnectionSection />}

        <div className="status-row">
          <StatusBadge />
          {isConnected && (
            <button
              onClick={handleDisconnectClick}
              className="disconnect-button"
            >
              Disconnect
            </button>
          )}
        </div>

        {isConnected && (
          <>
            <MessagesArea />
            <MessageInput
              value={messageInput}
              onChange={setMessageInput}
              onSend={handleSendMessage}
              onKeyPress={handleKeyPress}
              disabled={!messageInput.trim()}
            />
          </>
        )}

        <DisconnectModal
          show={showDisconnectModal}
          onConfirm={handleConfirmDisconnect}
          onCancel={handleCancelDisconnect}
        />
      </div>
    </div>
  );
}

export default App;
