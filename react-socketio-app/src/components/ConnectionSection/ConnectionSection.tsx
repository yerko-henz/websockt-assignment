import React from "react";

interface ConnectionSectionProps {
  username: string;
  onUsernameChange: (value: string) => void;
  onConnect: () => void;
  disabled: boolean;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const ConnectionSection: React.FC<ConnectionSectionProps> = ({
  username,
  onUsernameChange,
  onConnect,
  disabled,
  onKeyPress,
}) => {
  return (
    <div className="connect-section">
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        onKeyDown={onKeyPress}
        className="username-input"
      />
      <button
        onClick={onConnect}
        disabled={disabled}
        className="connect-button"
      >
        Connect
      </button>
    </div>
  );
};

export default ConnectionSection;
