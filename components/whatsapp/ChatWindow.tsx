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
  soundEnabled?: boolean;
  onOpenEmbedModal?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  profile,
  presetScenarioPrompt,
  onClearPresetScenario,
  soundEnabled = true,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeBooking, setActiveBooking] = useState<BookingConfirmation | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState<boolean>(false);

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

      // Realistic typing delay of 1.1 seconds for authentic human feel
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

  // Generate dynamic quick prompts based on available services
  const quickPrompts = [
    ...(profile.services[0] ? [`📅 ${profile.services[0].title} inplannen`] : ["📅 Afspraak maken"]),
    ...(profile.services[1] ? [`✨ ${profile.services[1].title}`] : []),
    "💰 Wat zijn de tarieven?",
    "📍 Wat is het adres?",
  ];

  return (
    <div className="flex flex-col h-full w-full whatsapp-bg relative overflow-hidden select-text">
      {/* WhatsApp iOS Header */}
      <ChatHeader
        profile={profile}
        isTyping={isTyping}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      {/* Messages Feed */}
      <MessageList
        messages={messages}
        isTyping={isTyping}
        onSelectSlot={handleSelectSlot}
        onOpenBookingModal={(booking) => setActiveBooking(booking)}
      />

      {/* WhatsApp iOS Input Bar */}
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
