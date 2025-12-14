"use client";

import { useState, useRef, useEffect } from "react";

export default function AIPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const updatedMessages = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center justify-center px-4 py-10">
      <section className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 flex flex-col h-[70vh]">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">AI Chat Assistant</h1>
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.length === 0 && (
            <div className="text-gray-400 text-center mt-10">Start the conversation!</div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-[80%] ${msg.role === "user" ? "bg-blue-100 ml-auto text-right" : "bg-gray-100 mr-auto text-left"}`}
            >
              <span className="block text-sm font-medium mb-1">
                {msg.role === "user" ? "You" : "AI"}
              </span>
              <span>{msg.content}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          className="flex gap-2 mt-auto"
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </section>
    </main>
  );
}