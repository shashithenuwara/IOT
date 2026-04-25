import { useState, useRef, useEffect } from "react";

export default function ChatAssistant({ data }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I can help you interpret sensor readings, diagnose issues, and provide storage recommendations. What would you like to know?" }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, data }),
      });
      const result = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: result.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Unable to reach the assistant service. Please check that the backend is running." }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: open ? "var(--bg-elevated)" : "var(--accent)",
          border: open ? "1px solid var(--border-med)" : "none",
          color: open ? "var(--text-secondary)" : "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1001,
          transition: "all 0.2s ease",
          boxShadow: open ? "none" : "0 4px 20px rgba(78,184,255,0.35)",
        }}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4h14M2 9h10M2 14h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: "84px",
          right: "24px",
          width: "340px",
          height: "460px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-med)",
          borderRadius: "var(--radius-xl)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 1000,
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 18px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <div style={{
              width: "8px", height: "8px",
              borderRadius: "50%",
              background: "var(--safe)",
              boxShadow: "0 0 6px var(--safe)",
            }}/>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>AI Assistant</div>
              <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Pharmacy storage advisor</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "82%",
                  padding: "10px 13px",
                  borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.role === "user" ? "var(--accent-dim)" : "var(--bg-card)",
                  border: `1px solid ${m.role === "user" ? "rgba(78,184,255,0.2)" : "var(--border)"}`,
                  fontSize: "12.5px",
                  lineHeight: "1.5",
                  color: "var(--text-primary)",
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: "5px", height: "5px",
                    borderRadius: "50%",
                    background: "var(--text-muted)",
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}/>
                ))}
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 14px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: "8px",
            alignItems: "flex-end",
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask about sensor readings..."
              style={{
                flex: 1,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "8px 12px",
                fontSize: "12.5px",
                color: "var(--text-primary)",
                outline: "none",
                fontFamily: "var(--font-sans)",
                resize: "none",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                width: "34px",
                height: "34px",
                flexShrink: 0,
                background: input.trim() && !loading ? "var(--accent)" : "var(--bg-hover)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                color: input.trim() && !loading ? "#fff" : "var(--text-muted)",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 1L1 5.5l5 1.5 1.5 5L13 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
