import { useState, useEffect, useRef } from "react";
import { initSocket, getSocket, disconnectSocket } from "./services/socket";
import "../../theme/theme.css";
import "./App.css";
import {
  ConnectionSection,
  StatusBadge,
  MessagesArea,
  MessageInput,
  DisconnectModal,
} from "./components";

const STORAGE_KEY = "chat_username";
const MESSAGES_STORAGE_KEY = "chat_global_messages";

function App() {
  const [username, setUsername] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || "";
  });
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>(() => {
    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [messageInput, setMessageInput] = useState("");
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const hasAutoConnectedRef = useRef(false);

  // Auto-connect if stored username exists on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem(STORAGE_KEY);
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
          setMessages((prev) => {
            const updated = [...prev, data];
            localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });
        });
      }
    }
  }, []);

  const handleConnect = () => {
    if (!username.trim()) return;
    if (getSocket()) return; // Already initialized

    // Save username to local storage
    localStorage.setItem(STORAGE_KEY, username);

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
      setMessages((prev) => {
        const updated = [...prev, data];
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
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
    setMessages([]);
    localStorage.removeItem(MESSAGES_STORAGE_KEY);
    setUsername("");
    localStorage.removeItem(STORAGE_KEY);
    setShowDisconnectModal(false);
  };

  const handleCancelDisconnect = () => {
    setShowDisconnectModal(false);
  };

  const isConnectDisabled = !username.trim() || isConnected;

  return (
    <div className="app-container">
      <div className="chat-box">
        <h2>Chat Box</h2>

        {!isConnected && (
          <ConnectionSection
            username={username}
            onUsernameChange={setUsername}
            onConnect={handleConnect}
            disabled={isConnectDisabled}
            onKeyPress={handleKeyPress}
          />
        )}

        <div className="status-row">
          <StatusBadge isConnected={isConnected} username={username} />
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
            <MessagesArea messages={messages} currentUsername={username} />
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
