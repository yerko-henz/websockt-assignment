import React from "react";

interface DisconnectModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DisconnectModal: React.FC<DisconnectModalProps> = ({
  show,
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Confirm Disconnect</h3>
        <p>Are you sure you want to disconnect from the chat server?</p>
        <div className="modal-buttons">
          <button onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-confirm">
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisconnectModal;
