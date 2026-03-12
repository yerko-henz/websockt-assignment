import { useState } from "react";
import { initSocket, getSocket, disconnectSocket } from "./services/socket";
import "../../theme/theme.css";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

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
      setMessages((prev) => [...prev, data]);
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
      } else {
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
    setUsername("");
    setShowDisconnectModal(false);
  };

  const handleCancelDisconnect = () => {
    setShowDisconnectModal(false);
  };

  return (
    <div className="app-container">
      <div className="chat-box">
        <h2>Chat Box</h2>

        {!isConnected && (
          <div className="connect-section">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyPress}
              className="username-input"
            />
            <button
              onClick={handleConnect}
              disabled={!username.trim()}
              className="connect-button"
            >
              Connect
            </button>
          </div>
        )}

        <div className="status-row">
          <div
            className={`status-badge ${isConnected ? "connected" : "disconnected"}`}
          >
            {isConnected
              ? `✓ Connected as ${username}`
              : "✗ Not connected to backend"}
          </div>
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
            <div className="messages-area">
              {messages.length === 0 ? (
                <p className="no-messages">No messages yet</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.startsWith(`${username}:`) ? "own-message" : ""}`}
                  >
                    {msg.startsWith(`${username}:`) && (
                      <span className="you-tag">(you) </span>
                    )}
                    {msg}
                  </div>
                ))
              )}
            </div>

            <div className="message-input-section">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="message-input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="send-button"
              >
                Send
              </button>
            </div>
          </>
        )}

        {/* Disconnect Confirmation Modal */}
        {showDisconnectModal && (
          <div className="modal-overlay" onClick={handleCancelDisconnect}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Confirm Disconnect</h3>
              <p>Are you sure you want to disconnect from the chat server?</p>
              <div className="modal-buttons">
                <button onClick={handleCancelDisconnect} className="btn-cancel">
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDisconnect}
                  className="btn-confirm"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
