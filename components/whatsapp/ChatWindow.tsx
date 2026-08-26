"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BusinessProfile, ChatMessage, BookingConfirmation } from "@/lib/schemas";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { CalendarInviteModal } from "./CalendarInviteModal";
import { BusinessInfoModal } from "./BusinessInfoModal";
import { EmbedModal } from "./EmbedModal";
import { playIncomingChime, playOutgoingChime } from "./sound";

interface ChatWindowProps {
  profile: BusinessProfile;
  presetScenarioPrompt?: string;
  onClearPresetScenario?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  profile,
  presetScenarioPrompt,
  onClearPresetScenario,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeBooking, setActiveBooking] = useState<BookingConfirmation | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const getCurrentTimeString = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  };

  // 1. Send automatic welcome greeting on initial load
  const initChat = useCallback(() => {
    const initialGreeting =
      profile.customGreeting ||
      `Hoi! Welkom bij ${profile.businessName}. 👋 Ik ben de virtuele assistent. Hoe kan ik je vandaag helpen? Wil je een afspraak maken of heb je een specifieke vraag?`;

    setMessages([
      {
        id: "msg-welcome",
        role: "assistant",
        content: initialGreeting,
        timestamp: getCurrentTimeString(),
      },
    ]);
  }, [profile]);

  useEffect(() => {
    initChat();
  }, [initChat]);

  // Handle external scenario trigger
  useEffect(() => {
    if (presetScenarioPrompt && presetScenarioPrompt.trim()) {
      handleSendMessage(presetScenarioPrompt);
      if (onClearPresetScenario) onClearPresetScenario();
    }
  }, [presetScenarioPrompt]);

  // 2. Handle sending user message
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: getCurrentTimeString(),
    };

    // Append user message immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    if (soundEnabled) {
      playOutgoingChime();
    }

    // Set typing indicator
    setIsTyping(true);

    try {
      // Call backend API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: profile.slug,
          messages: updatedMessages,
          currentMessage: content.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Fout bij verzenden van bericht.");
      }

      // Realistic typing delay of 1.1 seconds for human WhatsApp feel
      setTimeout(() => {
        setIsTyping(false);

        const agentMessage: ChatMessage = {
          id: `agent-${Date.now()}`,
          role: "assistant",
          content: data.reply || "Bedankt voor je bericht!",
          timestamp: getCurrentTimeString(),
          bookingData: data.bookingData || undefined,
          proposedSlots: data.proposedSlots || undefined,
        };

        setMessages((prev) => [...prev, agentMessage]);

        if (soundEnabled) {
          playIncomingChime();
        }

        if (data.bookingData) {
          setActiveBooking(data.bookingData);
        }
      }, 1100);
    } catch (err: any) {
      console.error("Chat error:", err);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: "Sorry, er ging even iets mis bij het verwerken. Probeer het alsjeblieft opnieuw!",
            timestamp: getCurrentTimeString(),
          },
        ]);
      }, 800);
    }
  };

  // 3. Handle slot choice chip click
  const handleSelectSlot = (slotIso: string, slotFormatted: string) => {
    handleSendMessage(`Ik kies graag de optie: ${slotFormatted} (${slotIso})`);
  };

  // 4. Handle share link copy
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    }
  };

  // Generate dynamic quick prompts based on available services
  const quickPrompts = [
    ...(profile.services[0] ? [`📅 ${profile.services[0].title} inplannen`] : ["📅 Afspraak maken"]),
    ...(profile.services[1] ? [`✨ ${profile.services[1].title}`] : []),
    "💰 Wat zijn de kosten?",
    "📍 Wat is het adres?",
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#EFEAE2] relative overflow-hidden shadow-2xl rounded-none sm:rounded-2xl border border-[#D1D7DB]">
      {/* Background WhatsApp Doodle Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none bg-repeat bg-[radial-gradient(#075E54_1px,transparent_1px)] [background-size:16px_16px]"
        aria-hidden="true"
      />

      {/* Copied Notification Toast */}
      {copiedNotification && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-[#111B21] text-white text-xs px-4 py-2 rounded-full shadow-lg border border-white/20 animate-fade-in flex items-center gap-2">
          <span>✓ Demo link gekopieerd naar klembord!</span>
        </div>
      )}

      {/* WhatsApp Header */}
      <ChatHeader
        profile={profile}
        isTyping={isTyping}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onResetChat={initChat}
        onShare={handleShare}
        onOpenInfo={() => setIsInfoOpen(true)}
        onOpenEmbed={() => setIsEmbedOpen(true)}
      />

      {/* Messages Feed */}
      <MessageList
        messages={messages}
        isTyping={isTyping}
        onSelectSlot={handleSelectSlot}
        onOpenBookingModal={(booking) => setActiveBooking(booking)}
      />

      {/* Input Bar */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isTyping}
        quickPrompts={quickPrompts}
      />

      {/* Calendar Confirmation Modal */}
      <CalendarInviteModal
        booking={activeBooking}
        onClose={() => setActiveBooking(null)}
      />

      {/* Business Info / Profile Details Modal */}
      <BusinessInfoModal
        profile={profile}
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        onSelectService={(serviceTitle) => {
          handleSendMessage(`Ik wil graag een afspraak voor ${serviceTitle}`);
        }}
      />

      {/* Embed & Widget Modal */}
      <EmbedModal
        profile={profile}
        isOpen={isEmbedOpen}
        onClose={() => setIsEmbedOpen(false)}
      />
    </div>
  );
};
