import React from "react";

interface StatusBadgeProps {
  isConnected: boolean;
  username: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  isConnected,
  username,
}) => {
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
