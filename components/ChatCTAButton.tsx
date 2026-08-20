"use client";

import React from "react";
import { MessageSquare } from "lucide-react";

export default function ChatCTAButton() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-agent-chat"));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-sm px-xl py-md rounded-xl bg-primary text-surface font-body font-semibold hover:bg-primary-hover transition-all shadow-card hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none cursor-pointer min-h-[44px]"
    >
      <MessageSquare className="w-5 h-5" />
      <span>Chat with Agent Ahmad</span>
    </button>
  );
}
