import React from "react";

interface MessagesAreaProps {
  messages: string[];
  currentUsername: string;
}

export const MessagesArea: React.FC<MessagesAreaProps> = ({
  messages,
  currentUsername,
}) => {
  return (
    <div className="messages-area">
      {messages.length === 0 ? (
        <p className="no-messages">No messages yet</p>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.startsWith(`${currentUsername}:`) ? "own-message" : ""}`}
          >
            {msg.startsWith(`${currentUsername}:`) && (
              <span className="you-tag">(you) </span>
            )}
            {msg}
          </div>
        ))
      )}
    </div>
  );
};

export default MessagesArea;
