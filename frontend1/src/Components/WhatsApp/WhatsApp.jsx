import React, { useEffect, useState } from "react";
import "./whatsappChat.css";

const placeholderText = "Ask your question here...";

const WhatsAppChat = () => {
  const [open, setOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");

  // Typing placeholder effect
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setPlaceholder(placeholderText.slice(0, index + 1));
      setIndex((prev) => (prev === placeholderText.length ? 0 : prev + 1));
    }, 100);

    return () => clearInterval(interval);
  }, [index, open]);

  return (
    <>
      {/* CHAT BOX */}
      {open && (
        <div className="wa-chat-box">
          <div className="wa-header">
            <span>Chat with us</span>
            <button onClick={() => setOpen(false)}>×</button>
          </div>

          <div className="wa-body">
            <div className="wa-input-wrapper">
              <textarea
                rows="2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={placeholder}
                className="wa-textarea"
              />

              <button className="wa-send-btn">
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING WHATSAPP ICON */}
      <div className="wa-floating-icon" onClick={() => setOpen(!open)}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
        />
      </div>
    </>
  );
};

export default WhatsAppChat;
