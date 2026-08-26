"use client";

import React, { useState, useRef } from "react";
import { Plus, Smile, Camera, Mic, Send, Sparkles } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  quickPrompts?: string[];
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  quickPrompts = [
    "📅 Afspraak inplannen",
    "💰 Wat zijn de tarieven?",
    "📍 Wat is jullie adres?",
    "⏰ Openingstijden",
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

  return (
    <div className="bg-[#F0F2F5] border-t border-[#E9EDEF] p-2 sm:p-2.5 relative z-20 flex flex-col gap-2 shrink-0">
      {/* Quick Suggestion Chips (WhatsApp List & Flow shortcuts) */}
      {quickPrompts && quickPrompts.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <div className="flex items-center gap-1 text-gray-500 text-[11px] font-medium pl-1 shrink-0">
            <Sparkles className="w-3 h-3 text-[#00A884]" />
            <span className="hidden sm:inline">Snelkeuzes:</span>
          </div>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(prompt.replace(/^[^\w\s]+\s*/, ""))}
              disabled={disabled}
              className="bg-white hover:bg-[#EBF7F4] text-[#111B21] hover:text-[#00A884] border border-[#E9EDEF] hover:border-[#00A884]/40 rounded-full px-3 py-1 text-[11.5px] whitespace-nowrap transition-all shadow-2xs shrink-0 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Main WhatsApp iOS Input Row */}
      <div className="flex items-center gap-2">
        {/* iOS + Attachment Button */}
        <button
          type="button"
          className="text-[#007AFF] hover:text-[#0056B3] p-1.5 rounded-full hover:bg-gray-200/60 transition-colors shrink-0"
          title="Bijlage toevoegen"
          onClick={() => alert("Simulatie: Foto/Document bijlage toevoegen")}
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Rounded Input Field Container */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E9EDEF] shadow-2xs px-3 py-1.5 flex items-center gap-2 min-h-[38px]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Bericht"
            className="w-full bg-transparent text-[#111B21] placeholder:text-[#8696A0] text-[15px] outline-none resize-none max-h-[100px] leading-tight"
          />

          <button
            type="button"
            className="text-[#54656F] hover:text-[#111B21] transition-colors shrink-0"
            title="Emoji"
            onClick={() => {
              setText((prev) => prev + " 😊");
              textareaRef.current?.focus();
            }}
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* Right Buttons: Camera & Mic / Send */}
        {text.trim().length > 0 ? (
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled}
            className="w-9 h-9 rounded-full bg-[#00A884] hover:bg-[#069677] active:scale-95 text-white flex items-center justify-center shadow-md transition-all shrink-0 disabled:opacity-50"
            title="Versturen"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        ) : (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              className="text-[#54656F] hover:text-[#111B21] p-1.5 rounded-full hover:bg-gray-200/60 transition-colors"
              title="Camera"
              onClick={() => alert("Simulatie: Camera openen")}
            >
              <Camera className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="text-[#54656F] hover:text-[#111B21] p-1.5 rounded-full hover:bg-gray-200/60 transition-colors"
              title="Spraakbericht opnemen"
              onClick={() => onSendMessage("🎤 [Spraakbericht van 8 sec]")}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
