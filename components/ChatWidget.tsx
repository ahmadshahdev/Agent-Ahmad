"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  Trash2,
  Minimize2,
  RefreshCw,
} from "lucide-react";
import ChatMessage, { Message, SourceCitation } from "./ChatMessage";

const INITIAL_WELCOME_MESSAGE: Message = {
  id: "welcome-1",
  role: "assistant",
  content:
    "Hello! 👋 I'm **Agent Ahmad**, Ahmad's AI representative. Ask me anything about his technical skills, background, recent projects, or availability!",
};

const SUGGESTED_QUESTIONS = [
  "What's your tech stack?",
  "What projects have you built?",
  "Are you open to freelance work?",
  "What have you been working on lately?",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isStreaming]);

  // Keyboard shortcut (Escape to close) & External trigger event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleOpenTrigger = () => {
      setIsOpen(true);
      if (!hasOpenedBefore) {
        setHasOpenedBefore(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-agent-chat", handleOpenTrigger);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-agent-chat", handleOpenTrigger);
    };
  }, [isOpen, hasOpenedBefore]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    if (!hasOpenedBefore) {
      setHasOpenedBefore(true);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
  };

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isStreaming) return;

    setInputMessage("");

    // User message
    const userMessageId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMessageId,
      role: "user",
      content: query,
    };

    // Placeholder assistant message for streaming
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMsg: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      isStreaming: true,
    };

    const newHistory = [...messages, userMsg];
    setMessages([...newHistory, assistantMsg]);
    setIsStreaming(true);

    try {
      const historyPayload = newHistory
        .filter((m) => m.id !== "welcome-1")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }

      // Extract sources citation metadata from headers
      const sourcesHeader = res.headers.get("X-Sources");
      let sources: SourceCitation[] = [];
      if (sourcesHeader) {
        try {
          sources = JSON.parse(sourcesHeader);
        } catch {
          sources = [];
        }
      }

      if (!res.body) {
        throw new Error("No response body received from server stream.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: accumulatedText,
                  sources,
                  isStreaming: true,
                }
              : msg
          )
        );
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    } catch (error: unknown) {
      console.error("❌ Chat streaming error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content:
                  "I apologize, but I encountered a connection issue while answering your query. Please try again or reach out to Ahmad directly!",
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <aside aria-label="AI Chat Assistant" className="fixed z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-3">
          {/* Subtle invitation chip */}
          <button
            onClick={toggleChat}
            className="hidden md:flex items-center gap-2 bg-surface text-neutralDark border border-neutralLight-border px-4 py-2.5 rounded-full shadow-floating text-xs font-semibold hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none transition-all duration-200 cursor-pointer min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>Chat with Agent Ahmad</span>
          </button>

          <button
            onClick={toggleChat}
            aria-label="Open chat with Agent Ahmad (Press Escape to close when open)"
            className="bg-primary hover:bg-primary-hover text-white rounded-full p-4 shadow-floating shadow-agent-glow flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none min-w-[52px] min-h-[52px]"
          >
            <Bot className="w-6 h-6" />
            {/* Pulse Indicator */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-bright opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white"></span>
            </span>
          </button>
        </div>
      )}

      {/* Expanded Chat Window Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-canvas sm:bg-transparent sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[620px] sm:max-h-[85vh] sm:rounded-2xl sm:border sm:border-neutralLight-border sm:shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95">
          {/* Chat Window Panel */}
          <div className="flex-1 flex flex-col bg-surface overflow-hidden sm:rounded-2xl">
            {/* Header */}
            <div className="bg-neutralDark text-white px-4 py-3.5 flex items-center justify-between shadow-subtle border-b border-neutralDark-muted/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white ring-2 ring-primary-light shadow-agent-glow">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-neutralDark" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm tracking-wide flex items-center gap-1.5 text-white">
                    Agent Ahmad
                    <span className="text-[10px] bg-primary/40 text-primary-light px-1.5 py-0.2 rounded font-normal">
                      AI Rep
                    </span>
                  </h3>
                  <p className="text-[11px] text-neutralLight-lightMuted flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Online • Grounded Knowledge
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Clear chat history"
                  aria-label="Clear chat history"
                  className="p-2 text-neutralLight-lightMuted hover:text-white hover:bg-neutralDark-hover rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleChat}
                  title="Close chat window (Escape)"
                  aria-label="Close chat window"
                  className="p-2 text-neutralLight-lightMuted hover:text-white hover:bg-neutralDark-hover rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-canvas/40">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  sources={msg.sources}
                  isStreaming={msg.isStreaming}
                />
              ))}

              {/* Suggested Questions Chips */}
              {messages.length === 1 && !isStreaming && (
                <div className="mt-4 pt-2">
                  <p className="text-xs font-semibold text-neutralLight-muted mb-2.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    Suggested Questions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(q)}
                        className="text-left text-xs bg-surface hover:bg-primary-light hover:text-primary text-neutralDark border border-neutralLight-border hover:border-primary-border rounded-xl px-3 py-2.5 transition-all duration-200 shadow-subtle active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none min-h-[44px] flex items-center"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Area */}
            <div className="p-3 bg-surface border-t border-neutralLight-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    isStreaming
                      ? "Agent Ahmad is responding..."
                      : "Ask Agent Ahmad anything..."
                  }
                  disabled={isStreaming}
                  className="flex-1 bg-neutralLight-card text-neutralDark text-sm rounded-xl px-3.5 py-2.5 border border-neutralLight-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light/50 disabled:opacity-60 transition-all min-h-[44px]"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isStreaming}
                  aria-label="Send message"
                  className="bg-primary hover:bg-primary-hover disabled:bg-neutralLight-border text-white p-2.5 rounded-xl shadow-subtle transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center min-w-[44px] min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary outline-none"
                >
                  {isStreaming ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
              <div className="mt-1.5 text-center">
                <span className="text-[10px] text-neutralLight-muted">
                  Powered by Agent Ahmad RAG & Tool Execution Pipeline
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
