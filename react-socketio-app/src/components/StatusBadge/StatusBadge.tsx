import React from "react";
import { useChatStore } from "../../stores/chatStore";

export const StatusBadge: React.FC = () => {
  const { isConnected, username } = useChatStore();

  return (
    <div
      className={`status-badge ${isConnected ? "connected" : "disconnected"}`}
    >
      {isConnected
        ? `✓ Connected as ${username}`
        : "✗ Not connected to backend"}
    </div>
  );
};

export default StatusBadge;
