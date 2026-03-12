import React from "react";
import { useChatStore } from "../../stores/chatStore";

export const ConnectionSection: React.FC = () => {
  const { username, setUsername } = useChatStore();
  const [localUsername, setLocalUsername] = React.useState(username);

  const handleUsernameChange = (value: string) => {
    setLocalUsername(value);
    setUsername(value);
  };

  return (
    <div className="connect-section">
      <input
        type="text"
        placeholder="Enter your username"
        value={localUsername}
        onChange={(e) => handleUsernameChange(e.target.value)}
        className="username-input"
      />
      <button
        onClick={() => {
          if (localUsername.trim()) {
            setUsername(localUsername.trim());
          }
        }}
        disabled={!localUsername.trim()}
        className="connect-button"
      >
        Connect
      </button>
    </div>
  );
};

export default ConnectionSection;
