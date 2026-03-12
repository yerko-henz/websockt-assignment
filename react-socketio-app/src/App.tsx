import { useState } from "react";
import { initSocket, getSocket, disconnectSocket } from "./services/socket";

function App() {
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConnect();
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div
        style={{
          width: "400px",
          height: "500px",
          backgroundColor: "white",
          border: "2px solid #333",
          borderRadius: "10px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ margin: "0 0 15px 0", textAlign: "center" }}>Chat Box</h2>

        {!isConnected && (
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={handleConnect}
              disabled={!username.trim()}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px",
                backgroundColor: !username.trim() ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: !username.trim() ? "not-allowed" : "pointer",
              }}
            >
              Connect
            </button>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: isConnected ? "#d4edda" : "#f8d7da",
              color: isConnected ? "#155724" : "#721c24",
              textAlign: "center",
              fontWeight: "bold",
              flex: 1,
            }}
          >
            {isConnected
              ? `✓ Connected as ${username}`
              : "✗ Not connected to backend"}
          </div>
          {isConnected && (
            <button
              onClick={handleDisconnectClick}
              style={{
                padding: "10px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                height: "100%",
              }}
            >
              Disconnect
            </button>
          )}
        </div>

        {isConnected && (
          <div
            style={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              marginBottom: "10px",
              overflowY: "auto",
              backgroundColor: "#fafafa",
            }}
          >
            {messages.length === 0 ? (
              <p style={{ textAlign: "center", color: "#999" }}>
                No messages yet
              </p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>
                  {msg}
                </div>
              ))
            )}
          </div>
        )}

        {/* Disconnect Confirmation Modal */}
        {showDisconnectModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={handleCancelDisconnect}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                maxWidth: "400px",
                width: "90%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ marginTop: 0, marginBottom: "15px" }}>
                Confirm Disconnect
              </h3>
              <p style={{ marginBottom: "20px" }}>
                Are you sure you want to disconnect from the chat server?
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  onClick={handleCancelDisconnect}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDisconnect}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
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
