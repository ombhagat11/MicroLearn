"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  FileText,
  MessageSquare,
  Zap,
  UploadCloud,
  ArrowUp,
  X,
  Paperclip,
  AlertCircle,
  Loader,
  Menu,
  Trash2,
  Edit3,
  Copy,
  Check,
  Share2,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Code
} from "lucide-react";

// Chat History Sidebar Component
const ChatHistorySidebar = ({ chats, currentChatId, onSelectChat, onNewChat, onDeleteChat, isOpen, setIsOpen }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-col z-30 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Chats</h2>
          <button onClick={onNewChat} className="p-2 hover:bg-gray-200 rounded-lg transition">
            <Edit3 size={18} />
          </button>
        </div>

        <button 
          onClick={() => {
            onNewChat();
            if (window.innerWidth < 1024) setIsOpen(false);
          }} 
          className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition mb-6"
        >
          <Plus size={18} /> New Chat
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {chats.length === 0 ? (
            <p className="text-center text-gray-400 text-sm mt-10">No chat history</p>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                  currentChatId === chat.id
                    ? "bg-white shadow-sm border border-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  onSelectChat(chat.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <MessageSquare size={18} className={currentChatId === chat.id ? "text-teal-500" : "text-gray-400"} />
                  <span className="text-sm font-medium truncate">
                    {chat.title || "Untitled Chat"}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-500 rounded transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

// File Sidebar Component
const FileSidebar = ({ uploadedFiles, setUploadedFiles, isOpen, setIsOpen }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    Array.from(files).forEach((file) => {
      if (file.size <= 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedFiles((prev) => [...prev, {
            id: Date.now() + Math.random(),
            name: file.name,
            size: (file.size / 1024).toFixed(2) + " KB",
            content: event.target.result,
          }]);
        };
        reader.readAsText(file);
      }
    });
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
      <div className={`fixed lg:static inset-y-0 right-0 w-72 bg-gray-50 border-l border-gray-200 p-6 flex flex-col z-30 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UploadCloud size={20} />
            Files
          </h3>
          <button onClick={() => setIsOpen(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()} 
          className="border-2 border-dashed border-gray-300 hover:border-teal-400 p-6 rounded-xl text-center cursor-pointer transition mb-6 bg-white"
        >
          <UploadCloud size={32} className="mx-auto text-gray-400 mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">Click to upload</p>
          <p className="text-xs text-gray-500">PDF, DOCX, TXT (Max 5MB)</p>
          <input 
            ref={fileInputRef} 
            type="file" 
            multiple 
            accept=".pdf,.docx,.txt" 
            onChange={(e) => handleFileSelect(e.target.files)} 
            className="hidden" 
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Documents ({uploadedFiles.length})</p>
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition group">
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText size={16} className="text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                </div>
              </div>
              <button 
                onClick={() => setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id))} 
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// Message Content Component with Markdown Support
const MessageContent = ({ text, isUser, onCopyCode }) => {
  if (isUser) {
    return <div className="text-sm leading-relaxed whitespace-pre-wrap">{text}</div>;
  }

  const parseMarkdown = () => {
    const lines = text.split('\n');
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks
      if (line.trim().startsWith('```')) {
        const lang = line.trim().slice(3).trim() || 'code';
        const codeLines = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        const code = codeLines.join('\n');
        elements.push(
          <div key={i} className="my-4 rounded-xl overflow-hidden border border-gray-200">
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code size={14} className="text-gray-400" />
                <span className="text-xs text-gray-300 font-mono">{lang}</span>
              </div>
              <button
                onClick={() => onCopyCode(code)}
                className="text-gray-400 hover:text-white transition text-xs flex items-center gap-1"
              >
                <Copy size={14} />
              </button>
            </div>
            <pre className="bg-gray-900 p-4 overflow-x-auto">
              <code className="text-sm text-gray-100 font-mono">{code}</code>
            </pre>
          </div>
        );
        i++;
        continue;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-lg font-bold mt-6 mb-3">{line.slice(4)}</h3>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-xl font-bold mt-7 mb-3">{line.slice(3)}</h2>);
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-2xl font-bold mt-8 mb-4">{line.slice(2)}</h1>);
      }
      // Unordered lists
      else if (line.trim().match(/^[-*]\s/)) {
        const items = [];
        while (i < lines.length && lines[i].trim().match(/^[-*]\s/)) {
          items.push(<li key={i}>{lines[i].trim().slice(2)}</li>);
          i++;
        }
        elements.push(<ul key={i} className="list-disc list-inside space-y-2 my-3 ml-4">{items}</ul>);
        continue;
      }
      // Ordered lists
      else if (line.trim().match(/^\d+\.\s/)) {
        const items = [];
        while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
          items.push(<li key={i}>{lines[i].trim().replace(/^\d+\.\s/, '')}</li>);
          i++;
        }
        elements.push(<ol key={i} className="list-decimal list-inside space-y-2 my-3 ml-4">{items}</ol>);
        continue;
      }
      // Regular text
      else if (line.trim()) {
        let formatted = line;
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        formatted = formatted.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
        formatted = formatted.replace(/`(.+?)`/g, '<code class="bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-sm font-mono">$1</code>');
        elements.push(<p key={i} className="mb-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />);
      } else {
        elements.push(<div key={i} className="h-2" />);
      }
      i++;
    }

    return elements;
  };

  return <div className="text-sm text-gray-800">{parseMarkdown()}</div>;
};

// Main Chat Interface Component
const ChatInterface = ({ 
  conversation, 
  inputValue, 
  setInputValue, 
  onSendMessage, 
  isLoading, 
  onAttachFile, 
  error, 
  setError, 
  uploadedFiles, 
  toggleLeftSidebar, 
  toggleRightSidebar, 
  currentChatId,
  onRegenerateMessage 
}) => {
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleShare = async (text) => {
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        handleCopy(text, 'share');
      }
    } else {
      handleCopy(text, 'share');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 bg-white">
        <div className="flex items-center gap-3">
          <button onClick={toggleLeftSidebar} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {currentChatId ? "Chat" : "New Conversation"}
          </h1>
        </div>
        <button onClick={toggleRightSidebar} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg relative">
          <FileText size={20} />
          {uploadedFiles.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-900 flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
        {conversation.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-teal-500 to-blue-500 p-8 rounded-3xl mb-8 shadow-xl">
              <Zap size={56} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to MicroLearn AI</h2>
            <p className="text-gray-600 text-lg mb-12 text-center max-w-xl">
              Your intelligent learning companion. Upload documents, ask questions, and get instant insights.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <button 
                onClick={() => setInputValue("Summarize this document")} 
                className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-teal-400 hover:shadow-lg transition text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-lg">
                  <FileText size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Summarize</h3>
                <p className="text-sm text-gray-600">Get concise document summaries</p>
              </button>
              
              <button 
                onClick={() => setInputValue("Create a study plan")} 
                className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-teal-400 hover:shadow-lg transition text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-lg">
                  <Zap size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Study Plan</h3>
                <p className="text-sm text-gray-600">Get personalized learning paths</p>
              </button>
              
              <button 
                onClick={() => setInputValue("Explain this concept simply")} 
                className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-teal-400 hover:shadow-lg transition text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-lg">
                  <MessageSquare size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Explain</h3>
                <p className="text-sm text-gray-600">Break down complex topics</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {conversation.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
                <div className={`max-w-[85%] ${msg.role !== 'user' ? 'w-full' : ''}`}>
                  <div className={`rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 shadow-lg'
                      : 'bg-gray-50 border border-gray-200 p-5'
                  }`}>
                    {msg.role !== 'user' && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                          <Zap size={16} className="text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">MicroLearn AI</span>
                      </div>
                    )}
                    <MessageContent 
                      text={msg.text} 
                      isUser={msg.role === 'user'}
                      onCopyCode={(code) => handleCopy(code, `code-${idx}`)}
                    />
                  </div>

                  {msg.role !== 'user' && (
                    <div className="flex items-center gap-2 mt-3 ml-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleCopy(msg.text, idx)}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition text-xs flex items-center gap-1"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check size={14} />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleShare(msg.text)}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition text-xs flex items-center gap-1"
                      >
                        <Share2 size={14} />
                        <span>Share</span>
                      </button>

                      {idx === conversation.length - 1 && !isLoading && (
                        <button
                          onClick={() => onRegenerateMessage(idx)}
                          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition text-xs flex items-center gap-1"
                        >
                          <RefreshCw size={14} />
                          <span>Regenerate</span>
                        </button>
                      )}

                      <div className="w-px h-4 bg-gray-300 mx-1" />

                      <button
                        onClick={() => setFeedback({ ...feedback, [idx]: 'up' })}
                        className={`p-2 rounded-lg transition ${
                          feedback[idx] === 'up' ? 'text-teal-600 bg-teal-50' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsUp size={14} />
                      </button>

                      <button
                        onClick={() => setFeedback({ ...feedback, [idx]: 'down' })}
                        className={`p-2 rounded-lg transition ${
                          feedback[idx] === 'down' ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                      <Loader size={16} className="animate-spin text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Thinking</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 lg:p-6 bg-gradient-to-t from-white to-gray-50/50">
        <div className="max-w-4xl mx-auto">
          {uploadedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {uploadedFiles.map(f => (
                <div key={f.id} className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <FileText size={12} />
                  <span className="font-medium">{f.name}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 bg-white border-2 border-gray-200 rounded-2xl p-2 shadow-lg focus-within:border-teal-400 transition">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition"
            >
              <Paperclip size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={(e) => onAttachFile(e.target.files)}
              className="hidden"
            />

            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 bg-transparent border-0 text-gray-900 text-sm focus:ring-0 p-3 resize-none placeholder:text-gray-400"
              placeholder="Ask anything..."
              rows={1}
              style={{ minHeight: '48px', maxHeight: '200px' }}
            />

            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg active:scale-95"
            >
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <ArrowUp size={20} strokeWidth={2.5} />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 px-2 text-xs text-gray-500">
            <span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded font-mono text-[10px]">Enter</kbd> to send
              {' • '}
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded font-mono text-[10px]">Shift+Enter</kbd> new line
            </span>
            <span>AI may make mistakes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function AIChatWorkspace() {
  const [conversation, setConversation] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (err) {
      console.error("Failed to fetch chats", err);
    }
  };

  const fetchMessages = async (chatId) => {
    setIsLoading(true);
    setConversation([]);
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      if (res.ok) {
        const data = await res.json();
        const formatted = data.messages.map(m => ({
          role: m.role === 'assistant' ? 'ai' : m.role,
          text: m.content
        }));
        setConversation(formatted);
        setCurrentChatId(chatId);
      }
    } catch (err) {
      console.error(err);
      setError("Could not load chat");
    } finally {
      setIsLoading(false);
    }
  };

  const onNewChat = () => {
    setConversation([]);
    setInputValue("");
    setError(null);
    setCurrentChatId(null);
    setLeftSidebarOpen(false);
  };

  const onSelectChat = (chatId) => {
    if (chatId !== currentChatId) {
      fetchMessages(chatId);
    }
  };

  const handleDeleteChat = async (id) => {
    if (!confirm("Delete this chat?")) return;
    try {
      const res = await fetch(`/api/chats/${id}`, { method: "DELETE" });
      if (res.ok) {
        setChats(prev => prev.filter(c => c.id !== id));
        if (currentChatId === id) onNewChat();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onAttachFile = (files) => {
    Array.from(files).forEach((file) => {
      if (file.size <= 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedFiles((prev) => [...prev, {
            id: Date.now() + Math.random(),
            name: file.name,
            size: (file.size / 1024).toFixed(2) + " KB",
            content: event.target.result,
          }]);
        };
        reader.readAsText(file);
      }
    });
  };

  const onRegenerateMessage = async (messageIndex) => {
    if (messageIndex < 1) return;
    const messagesBeforeAI = conversation.slice(0, messageIndex);
    const lastUserMsg = messagesBeforeAI[messagesBeforeAI.length - 1];
    if (lastUserMsg?.role !== 'user') return;
    setConversation(messagesBeforeAI);
    await onSendMessage(lastUserMsg.text, true);
  };

  const onSendMessage = async (message, isRegenerate = false) => {
    if (!message.trim()) return;

    if (!isRegenerate) {
      setConversation((prev) => [...prev, { role: "user", text: message }]);
    }

    setIsLoading(true);
    setError(null);

    try {
      let fileContext = "";
      if (uploadedFiles.length > 0) {
        fileContext = `\n\nUploaded documents: ${uploadedFiles.map(f => f.name).join(", ")}\n`;
        fileContext += uploadedFiles.map(f => `\n--- ${f.name} ---\n${f.content}`).join("\n");
      }

      const fullMessage = message + fileContext;

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...conversation.map(msg => ({
              role: msg.role === "ai" ? "assistant" : msg.role,
              content: msg.text,
            })),
            { role: "user", content: fullMessage },
          ],
          chatId: currentChatId
        }),
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      const aiReply = data.reply || data.message;

      setConversation((prev) => [...prev, { role: "ai", text: aiReply }]);

      if (!currentChatId && data.chatId) {
        setCurrentChatId(data.chatId);
        fetchChats();
      }
    } catch (err) {
      setError("Failed to generate response. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-50">
      <ChatHistorySidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={onSelectChat}
        onNewChat={onNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={leftSidebarOpen}
        setIsOpen={setLeftSidebarOpen}
      />

      <ChatInterface
        conversation={conversation}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        onAttachFile={onAttachFile}
        error={error}
        setError={setError}
        uploadedFiles={uploadedFiles}
        toggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
        toggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        currentChatId={currentChatId}
        onRegenerateMessage={onRegenerateMessage}
      />

      <FileSidebar
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        isOpen={rightSidebarOpen}
        setIsOpen={setRightSidebarOpen}
      />
    </div>
  );
}