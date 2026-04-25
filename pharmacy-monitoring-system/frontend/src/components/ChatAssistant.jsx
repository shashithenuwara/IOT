import { useState } from "react";

export default function ChatAssistant({ data }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function sendMessage() {
    if (!input.trim()) return;

    const res = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: input,
        data
      })
    });

    const result = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "bot", text: result.answer }
    ]);

    setInput("");
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Assistant</h2>

      <div style={{ marginBottom: "12px" }}>
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.role === "user" ? "You" : "Bot"}:</strong> {m.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about temperature, humidity..."
      />
      <button onClick={sendMessage} style={{ marginLeft: "8px" }}>
        Send
      </button>
    </div>
  );
}