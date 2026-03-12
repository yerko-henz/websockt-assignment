import React from "react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  disabled,
}) => {
  return (
    <div className="message-input-section">
      <input
        type="text"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyPress}
        className="message-input"
      />
      <button onClick={onSend} disabled={disabled} className="send-button">
        Send
      </button>
    </div>
  );
};

export default MessageInput;
