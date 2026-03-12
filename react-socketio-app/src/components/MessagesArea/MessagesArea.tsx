import React from "react";
import { useChatStore } from "../../stores/chatStore";

export const MessagesArea: React.FC = () => {
  const { username } = useChatStore();
  const [messages, setMessages] = React.useState<string[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem("chat_global_messages");
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, []);

  return (
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
  );
};

export default MessagesArea;
