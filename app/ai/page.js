"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function AIPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    const updatedMessages = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (!data.reply) {
        throw new Error("No response received from AI");
      }

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message);
      setMessages([
        ...updatedMessages,
        { 
          role: "assistant", 
          content: `❌ **Error**: ${err.message}\n\nPlease try again or contact support if the issue persists.`,
          isError: true
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-6 md:py-10">
      <section className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl flex flex-col h-[85vh] md:h-[80vh] border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl p-4 md:p-6 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              AI Chat Assistant
            </h1>
            <p className="text-blue-100 text-xs md:text-sm mt-1">
              Powered by advanced AI • Always here to help
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
            >
              Clear Chat
            </button>
          )}
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Start a Conversation
              </h2>
              <p className="text-gray-500 max-w-md">
                Ask me anything! I'm here to help with questions, ideas, coding, and more.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 w-full max-w-2xl">
                {[
                  "Explain quantum computing",
                  "Write a Python function",
                  "Creative writing ideas",
                  "Help me plan my day"
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(suggestion)}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all duration-200 text-sm text-gray-700 text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-md ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                    : msg.isError
                    ? "bg-red-50 border border-red-200"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {msg.role === "user" ? "👤" : msg.isError ? "⚠️" : "🤖"}
                  </span>
                  <span className={`text-xs font-semibold ${
                    msg.role === "user" ? "text-blue-100" : "text-gray-600"
                  }`}>
                    {msg.role === "user" ? "You" : "AI Assistant"}
                  </span>
                </div>
                <div className={`prose prose-sm max-w-none ${
                  msg.role === "user" ? "text-white prose-invert" : "text-gray-800"
                }`}>
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-lg my-2"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm" {...props}>
                              {children}
                            </code>
                          );
                        },
                        p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        h1: ({ children }) => <h1 className="text-2xl font-bold mb-3 mt-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-bold mb-2 mt-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-2">{children}</h3>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-blue-500 pl-4 italic my-3 text-gray-600">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="max-w-[75%] rounded-2xl p-4 bg-white border border-gray-200 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white border-t border-gray-200 rounded-b-2xl">
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          <form
            className="flex gap-2 md:gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <textarea
              ref={inputRef}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-gray-800"
              placeholder="Type your message... (Shift+Enter for new line)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows={1}
              style={{
                minHeight: "48px",
                maxHeight: "120px",
              }}
              autoFocus
            />
            <button
              type="submit"
              className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 ${
                loading || !input.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:scale-105 active:scale-95"
              }`}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </span>
              )}
            </button>
          </form>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}