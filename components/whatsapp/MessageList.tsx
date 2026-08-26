"use client";

import React, { useEffect, useRef } from "react";
import { ChatMessage } from "@/lib/schemas";
import { CheckCheck, Calendar, Clock, Lock, Sparkles, ChevronRight } from "lucide-react";

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSelectSlot: (slotIso: string, slotFormatted: string) => void;
  onOpenBookingModal: (booking: any) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  onSelectSlot,
  onOpenBookingModal,
}) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 relative z-10 scrollbar-thin scrollbar-thumb-gray-400/40">
      {/* End-to-End Encryption Notice (Exact WhatsApp Style) */}
      <div className="flex justify-center my-1.5">
        <div className="bg-[#FFEECD] text-[#54656F] text-[11.5px] px-3.5 py-1.5 rounded-lg shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] max-w-sm text-center flex items-center gap-1.5 border border-[#FFE2A4]/80 select-none">
          <Lock className="w-3 h-3 text-[#54656F] shrink-0" />
          <span>
            Berichten zijn end-to-end versleuteld. Niemand buiten deze chat kan ze lezen.
          </span>
        </div>
      </div>

      {/* Date Divider */}
      <div className="flex justify-center my-2">
        <span className="wa-notice backdrop-blur-xs text-[11px] font-semibold px-3 py-0.5 rounded-md shadow-[0_1px_0.5px_rgba(0,0,0,0.15)] uppercase tracking-wider select-none">
          Vandaag
        </span>
      </div>

      {/* Message Bubbles */}
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isUser ? "items-end" : "items-start"} w-full group`}
          >
            <div
              className={`relative max-w-[85%] sm:max-w-[78%] rounded-2xl shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] text-[14.5px] leading-relaxed transition-all ${
                isUser
                  ? "bg-[var(--wa-bubble-out)] text-[var(--wa-text)] rounded-tr-xs"
                  : "wa-bubble-in rounded-tl-xs"
              }`}
            >
              {/* Message text content */}
              <div className="px-3.5 pt-2.5 pb-1.5 whitespace-pre-wrap break-words">
                {msg.content}
              </div>

              {/* Timestamp & Delivery Double Checkmarks inside bubble */}
              <div
                className={`flex items-center justify-end gap-1 px-3 pb-1.5 text-[10.5px] leading-none select-none ${
                  isUser ? "text-slate-500" : "text-[#667781]"
                }`}
              >
                <span>{msg.timestamp}</span>
                {isUser && (
                  <CheckCheck className="w-3.5 h-3.5 text-[#2196F3] stroke-[2.5]" />
                )}
              </div>

              {/* Real WhatsApp Cloud API Interactive Quick Reply Buttons */}
              {msg.proposedSlots && msg.proposedSlots.length > 0 && (
                <div className="border-t border-[var(--wa-divider)] divide-y divide-[var(--wa-divider)] bg-[#F7F8FA] rounded-b-2xl overflow-hidden">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-[#2196F3] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Kies een tijdstip (WhatsApp Interactive Button):</span>
                  </div>

                  {msg.proposedSlots.map((slot) => (
                    <button
                      key={slot.iso}
                      onClick={() => onSelectSlot(slot.iso, slot.formatted)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50 active:bg-blue-100 transition-colors flex items-center justify-between text-xs font-medium text-[#2196F3] group/btn"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Clock className="w-3.5 h-3.5 text-[#2196F3] shrink-0" />
                        <span className="truncate">{slot.formatted}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#2196F3] group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Booking Success Confirmation Widget Card */}
              {msg.bookingData && (
                <div className="border-t border-[var(--wa-divider)] bg-gradient-to-br from-[#0D47A1] to-[#1565C0] text-white rounded-b-2xl p-3.5">
                  <div
                    onClick={() => onOpenBookingModal(msg.bookingData)}
                    className="cursor-pointer space-y-2 hover:opacity-95 transition-opacity"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/20">
                      <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#FF9100]" /> Afspraak Bevestigd!
                      </span>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                        {msg.bookingData.bookingId}
                      </span>
                    </div>

                    <div className="text-xs space-y-0.5">
                      <p className="font-semibold text-[13.5px] text-white">
                        {msg.bookingData.serviceTitle}
                      </p>
                      <p className="text-blue-100">Klant: {msg.bookingData.customerName}</p>
                      <p className="text-blue-100">Telefoon: {msg.bookingData.customerPhone}</p>
                    </div>

                    <div className="pt-1">
                      <div className="text-center bg-white text-[#0D47A1] text-xs font-bold py-1.5 rounded-lg shadow-sm">
                        Bekijk Google Agenda Link & .ics →
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Typing Bubble */}
      {isTyping && (
        <div className="flex items-start w-full">
          <div className="bg-white rounded-2xl rounded-tl-xs px-4 py-3 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2196F3] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-[#2196F3] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-[#2196F3] animate-bounce" />
          </div>
        </div>
      )}

      <div ref={scrollEndRef} />
    </div>
  );
};
