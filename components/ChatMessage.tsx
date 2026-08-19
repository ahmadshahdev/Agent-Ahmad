"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User, BookOpen, Sparkles } from "lucide-react";

export interface SourceCitation {
  id: string;
  sourceFile: string;
  sectionTitle: string;
  score: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceCitation[];
  isStreaming?: boolean;
}

export interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: SourceCitation[];
  isStreaming?: boolean;
}

export default function ChatMessage({
  role,
  content,
  sources = [],
  isStreaming = false,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-start gap-2.5 my-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar Icon */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-subtle ${
          isUser
            ? "bg-neutralDark text-white"
            : "bg-primary text-white ring-2 ring-primary-light shadow-agent-glow"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-white rounded-tr-xs shadow-subtle"
            : "bg-surface text-neutralDark border border-neutralLight-border rounded-tl-xs shadow-subtle"
        }`}
      >
        {/* Message Content */}
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm max-w-none text-neutralDark">
            {content ? (
              <ReactMarkdown
                components={{
                  a: ({ ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold underline hover:text-primary-hover transition-colors"
                    />
                  ),
                  p: ({ ...props }) => (
                    <p className="mb-2 last:mb-0 leading-relaxed" {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="list-disc list-inside space-y-1 my-2 pl-1" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol className="list-decimal list-inside space-y-1 my-2 pl-1" {...props} />
                  ),
                  li: ({ ...props }) => (
                    <li className="mb-0.5" {...props} />
                  ),
                  strong: ({ ...props }) => (
                    <strong className="font-semibold text-neutralDark" {...props} />
                  ),
                  code: ({ children, ...props }) => (
                    <code
                      className="bg-neutralLight-card text-primary font-mono px-1.5 py-0.5 rounded text-[12px] border border-neutralLight-border"
                      {...props}
                    >
                      {children}
                    </code>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            ) : isStreaming ? (
              /* Skeleton Loading State for initial streaming */
              <div className="space-y-2 py-1 min-w-[210px] animate-pulse">
                <div className="flex items-center gap-1.5 text-neutralLight-muted text-xs font-medium mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" />
                  <span>Agent Ahmad is gathering answer...</span>
                </div>
                <div className="h-3 bg-neutralLight-border/70 rounded w-full" />
                <div className="h-3 bg-neutralLight-border/60 rounded w-4/5" />
                <div className="h-3 bg-neutralLight-border/40 rounded w-3/5" />
              </div>
            ) : null}

            {/* Streaming Cursor */}
            {isStreaming && content && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
            )}
          </div>
        )}

        {/* Source Citations Tag */}
        {!isUser && sources && sources.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-neutralLight-border/70 flex flex-wrap items-center gap-1.5 text-[11px] text-neutralLight-muted">
            <span className="flex items-center gap-1 font-semibold text-primary">
              <BookOpen className="w-3 h-3" />
              Sources:
            </span>
            {sources.map((src, idx) => (
              <span
                key={src.id || idx}
                className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium text-[10px] border border-primary-border/40"
                title={`Relevance score: ${src.score}`}
              >
                {src.sourceFile.replace(/\.md$/, "")} → {src.sectionTitle}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
