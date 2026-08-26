"use client";

import React, { useState, useRef, useEffect } from "react";
import { Smile, Paperclip, Send, Mic, Sparkles } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  quickPrompts?: string[];
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  quickPrompts = [
    "📅 Ik wil graag een afspraak maken",
    "💰 Wat zijn de tarieven?",
    "📍 Wat is jullie adres?",
    "⏰ Wat zijn de openingstijden?",
  ],
}) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSendMessage(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPromptClick = (promptText: string) => {
    // Strip leading emoji if desired or keep as prompt
    const cleaned = promptText.replace(/^[^\w\s]+\s*/, "");
    onSendMessage(cleaned);
  };

  return (
    <div className="bg-[#F0F2F5] border-t border-[#E9EDEF] p-2 sm:p-3 relative z-20 flex flex-col gap-2">
      {/* Quick Suggestion Chips */}
      {quickPrompts && quickPrompts.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <div className="flex items-center gap-1 text-gray-500 text-[11px] font-medium pl-1 shrink-0">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span className="hidden sm:inline">Suggesties:</span>
          </div>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPromptClick(prompt)}
              disabled={disabled}
              className="bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200 hover:border-emerald-300 rounded-full px-2.5 py-1 text-[11.5px] whitespace-nowrap transition-all shadow-xs shrink-0 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Main Input Row */}
      <div className="flex items-center gap-2">
        {/* Emoji Button */}
        <button
          type="button"
          className="text-[#54656F] hover:text-[#111B21] p-1.5 rounded-full hover:bg-gray-200/60 transition-colors"
          title="Emoji"
          onClick={() => {
            setText((prev) => prev + " 😊");
            textareaRef.current?.focus();
          }}
        >
          <Smile className="w-6 h-6" />
        </button>

        {/* Attachment Button */}
        <button
          type="button"
          className="text-[#54656F] hover:text-[#111B21] p-1.5 rounded-full hover:bg-gray-200/60 transition-colors"
          title="Bijlage"
        >
          <Paperclip className="w-5 h-5 -rotate-45" />
        </button>

        {/* Text Input */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200/80 shadow-inner px-3 py-1.5 flex items-center min-h-[42px]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Typ een bericht..."
            className="w-full bg-transparent text-[#111B21] placeholder:text-[#8696A0] text-[14.5px] outline-none resize-none max-h-[120px]"
          />
        </div>

        {/* Send or Voice Record Button */}
        {text.trim().length > 0 ? (
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled}
            className="w-10 h-10 rounded-full bg-[#00A884] hover:bg-[#069677] active:scale-95 text-white flex items-center justify-center shadow-md transition-all disabled:opacity-50"
            title="Versturen"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        ) : (
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-[#00A884] hover:bg-[#069677] active:scale-95 text-white flex items-center justify-center shadow-md transition-all"
            title="Spraakbericht"
            onClick={() => {
              onSendMessage("🎤 [Spraakbericht van 12 sec]");
            }}
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
