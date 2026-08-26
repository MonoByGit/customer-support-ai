"use client";

import React, { useEffect, useRef } from "react";
import { ChatMessage } from "@/lib/schemas";
import { Check, CheckCheck, Calendar, Clock, Lock, Sparkles } from "lucide-react";

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
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 relative z-10 scrollbar-thin scrollbar-thumb-gray-300">
      {/* End-to-End Encryption Notice */}
      <div className="flex justify-center my-2">
        <div className="bg-[#FFEECD] text-[#54656F] text-[11px] px-3 py-1.5 rounded-lg shadow-sm max-w-sm text-center flex items-center gap-1.5 border border-[#FFE2A4]/60">
          <Lock className="w-3 h-3 text-[#54656F] flex-shrink-0" />
          <span>
            Berichten en oproepen zijn end-to-end versleuteld. Dit is een live AI WhatsApp preview.
          </span>
        </div>
      </div>

      {/* Date Divider */}
      <div className="flex justify-center my-2">
        <span className="bg-white/80 backdrop-blur-sm text-[#54656F] text-[11px] font-medium px-3 py-1 rounded-md shadow-sm uppercase tracking-wider">
          Vandaag
        </span>
      </div>

      {/* Message Bubbles */}
      {messages.map((msg) => {
        const isUser = msg.role === "user";

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isUser ? "items-end" : "items-start"} w-full`}
          >
            <div
              className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] text-[14.5px] leading-relaxed transition-all ${
                isUser
                  ? "bg-[#DCF8C6] text-[#111B21] rounded-tr-none"
                  : "bg-white text-[#111B21] rounded-tl-none border border-gray-100/80"
              }`}
            >
              {/* Message text formatted */}
              <div className="whitespace-pre-wrap break-words">{msg.content}</div>

              {/* Proposed Slots Quick Action Chips */}
              {msg.proposedSlots && msg.proposedSlots.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-gray-200/70 space-y-1.5">
                  <div className="text-[12px] font-semibold text-[#075E54] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Beschikbare tijdstippen (klik om te kiezen):</span>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-1">
                    {msg.proposedSlots.map((slot) => (
                      <button
                        key={slot.iso}
                        onClick={() => onSelectSlot(slot.iso, slot.formatted)}
                        className="text-left bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300/80 hover:border-emerald-500 rounded-lg px-3 py-2 text-xs font-medium transition-colors flex items-center justify-between group shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{slot.formatted}</span>
                        </div>
                        <span className="text-[11px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-normal group-hover:bg-emerald-700">
                          Kies tijd
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Success Confirmation Widget Card */}
              {msg.bookingData && (
                <div className="mt-3 pt-2.5 border-t border-emerald-300">
                  <div
                    onClick={() => onOpenBookingModal(msg.bookingData)}
                    className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/20">
                      <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Afspraak Bevestigd!
                      </span>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                        {msg.bookingData.bookingId}
                      </span>
                    </div>
                    <div className="pt-2 text-xs space-y-0.5">
                      <p className="font-semibold text-[13px]">{msg.bookingData.serviceTitle}</p>
                      <p className="text-emerald-100">Klant: {msg.bookingData.customerName}</p>
                      <p className="text-emerald-100">Telefoon: {msg.bookingData.customerPhone}</p>
                    </div>
                    <div className="mt-2 text-center bg-white text-emerald-800 text-[11px] font-bold py-1.5 rounded-lg shadow-sm">
                      Bekijk Afspraak & Agenda Link →
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamp & Read Status Checks */}
              <div
                className={`flex items-center justify-end gap-1 mt-1 text-[10.5px] leading-none ${
                  isUser ? "text-emerald-800/80" : "text-gray-400"
                }`}
              >
                <span>{msg.timestamp}</span>
                {isUser && (
                  <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB] stroke-[2.5]" />
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing Bubble */}
      {isTyping && (
        <div className="flex items-start w-full">
          <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] border border-gray-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
          </div>
        </div>
      )}

      <div ref={scrollEndRef} />
    </div>
  );
};
