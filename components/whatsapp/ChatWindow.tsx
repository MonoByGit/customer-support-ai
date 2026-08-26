"use client";

import React, { useState, useEffect, useRef } from "react";
import { BusinessProfile, ChatMessage, BookingConfirmation } from "@/lib/schemas";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { CalendarInviteModal } from "./CalendarInviteModal";
import { BusinessInfoModal } from "./BusinessInfoModal";
import { Clock, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

interface ChatWindowProps {
  profile: BusinessProfile;
  presetScenarioPrompt?: string;
  onClearPresetScenario?: () => void;
  soundEnabled?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  profile,
  presetScenarioPrompt,
  onClearPresetScenario,
  soundEnabled = true,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(600); // 10 minutes
  const [messageCount, setMessageCount] = useState<number>(0);
  const [maxMessages, setMaxMessages] = useState<number>(30);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingConfirmation | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [extensionRequested, setExtensionRequested] = useState<boolean>(false);

  const initialLoaded = useRef(false);

  // 1. Load persistent chat history & session from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storageKey = `verde_chat_${profile.slug}`;
      const sessionKey = `verde_session_${profile.slug}`;
      
      const savedMessages = localStorage.getItem(storageKey);
      const savedSession = localStorage.getItem(sessionKey);

      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch (e) {
          console.error("Error parsing saved messages", e);
        }
      } else {
        // Initial welcome message
        setMessages([
          {
            id: "msg_init",
            role: "assistant",
            content: `Goedendag! Welkom bij ${profile.businessName}. 👋 Ik ben uw virtuele assistent. Hoe kan ik u vandaag van dienst zijn? U kunt direct een afspraak inplannen of vragen stellen over onze behandelingen.`,
            timestamp: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
            proposedSlots: [
              {
                iso: "2026-08-27T10:00:00.000Z",
                formatted: "Morgen om 10:00 uur",
                durationMinutes: 30,
              },
              {
                iso: "2026-08-27T14:00:00.000Z",
                formatted: "Morgen om 14:00 uur",
                durationMinutes: 30,
              },
            ],
          },
        ]);
      }

      if (savedSession) {
        try {
          const sess = JSON.parse(savedSession);
          if (sess.startTime) {
            setSessionStartTime(sess.startTime);
            setMessageCount(sess.messageCount || 0);
            const elapsed = Math.round((Date.now() - sess.startTime) / 1000);
            const left = Math.max(0, 600 - elapsed);
            setRemainingSeconds(left);
            if (left <= 0 || sess.messageCount >= 30) {
              setIsExpired(true);
            }
          }
        } catch (e) {
          console.error("Error parsing saved session", e);
        }
      }
    }
    initialLoaded.current = true;
  }, [profile.slug, profile.businessName]);

  // 2. Persist messages to localStorage on change
  useEffect(() => {
    if (initialLoaded.current && typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem(`verde_chat_${profile.slug}`, JSON.stringify(messages));
    }
  }, [messages, profile.slug]);

  // 3. 10-Minute Second-by-Second Countdown Timer (Only runs after first user message)
  useEffect(() => {
    if (!sessionStartTime || isExpired) return;

    const interval = setInterval(() => {
      const elapsed = Math.round((Date.now() - sessionStartTime) / 1000);
      const left = Math.max(0, 600 - elapsed);
      setRemainingSeconds(left);

      if (left <= 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime, isExpired]);

  // 4. Handle incoming preset scenarios from toolbar
  useEffect(() => {
    if (presetScenarioPrompt && presetScenarioPrompt.trim().length > 0 && !isTyping && !isExpired) {
      handleSendMessage(presetScenarioPrompt);
      if (onClearPresetScenario) {
        onClearPresetScenario();
      }
    }
  }, [presetScenarioPrompt]);

  const playTone = (type: "sent" | "received") => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "sent") {
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.08);
      } else {
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1050, audioCtx.currentTime + 0.1);
      }

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // Audio autoplay restrictions
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping || isExpired) return;

    // Start timer on first message if not started
    let currentStartTime = sessionStartTime;
    if (!currentStartTime) {
      currentStartTime = Date.now();
      setSessionStartTime(currentStartTime);
    }

    const newMessageCount = messageCount + 1;
    setMessageCount(newMessageCount);

    // Save session state to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `verde_session_${profile.slug}`,
        JSON.stringify({
          startTime: currentStartTime,
          messageCount: newMessageCount,
        })
      );
    }

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    playTone("sent");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileSlug: profile.slug,
          message: text.trim(),
          history: [...messages, userMsg],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.isExpired) {
          setIsExpired(true);
        }
        throw new Error(data.error || "Fout bij communicatie met de AI.");
      }

      let bookingData: BookingConfirmation | undefined;
      if (data.bookingConfirmed && data.bookingDetails) {
        bookingData = {
          success: true,
          bookingId: data.bookingDetails.calendarEventId || `WA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          customerName: data.bookingDetails.clientName || "Klant",
          customerPhone: data.bookingDetails.clientPhone || "",
          serviceTitle: data.bookingDetails.service || "Afspraak",
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 30 * 60000).toISOString(),
          location: profile.businessName,
          isMock: false,
        };
      }

      const agentMsg: ChatMessage = {
        id: `agt_${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
        proposedSlots: data.proposedSlots?.map((s: any) => ({
          iso: s.iso,
          formatted: s.formatted,
          durationMinutes: s.durationMinutes || 30,
        })),
        bookingData,
      };

      setMessages((prev) => [...prev, agentMsg]);
      playTone("received");

      if (data.session?.isExpired) {
        setIsExpired(true);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: "system",
        content: isExpired
          ? "Deze interactieve testsessie is voltooid."
          : `Er ging even iets mis: ${err.message || "Probeer het opnieuw."}`,
        timestamp: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRequestExtension = () => {
    setExtensionRequested(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `ext_${Date.now()}`,
        role: "system",
        content: "✓ Verlengingsaanvraag ontvangen! De beheerder kan uw sessie direct verlengen vanuit het dashboard.",
        timestamp: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full w-full bg-[var(--wa-wallpaper)] select-none relative overflow-hidden">
      {/* WhatsApp iOS Top Chat Header */}
      <ChatHeader
        profile={profile}
        isTyping={isTyping}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      {/* Floating Session Countdown Bar */}
      {sessionStartTime && (
        <div className="bg-slate-900/90 backdrop-blur-md text-white text-[11px] px-3.5 py-1.5 flex items-center justify-between z-20 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-1.5">
            <Clock className={`w-3.5 h-3.5 ${remainingSeconds < 120 ? "text-red-400 animate-pulse" : "text-[#00D492]"}`} />
            <span>
              {isExpired ? (
                <span className="text-[#FF9100] font-bold">Testsessie verlopen</span>
              ) : (
                <>
                  Resterende testtijd: <strong className="font-mono text-[#2196F3]">{formatTimer(remainingSeconds)}</strong>
                </>
              )}
            </span>
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            {messageCount}/{maxMessages} berichten
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <MessageList
        messages={messages}
        isTyping={isTyping}
        onSelectSlot={(slotIso, slotFormatted) => {
          handleSendMessage(`Ik kies graag ${slotFormatted}. Mijn naam is Mark van Leeuwen, 06-12345678.`);
        }}
        onOpenBookingModal={(booking) => setSelectedBooking(booking)}
      />

      {/* Expiry Banner / Input Area */}
      {isExpired ? (
        <div className="wa-surface border-t border-[var(--wa-divider)] p-4 shrink-0 shadow-lg text-center space-y-3 z-20 animate-fade-in">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-900">
              <Lock className="w-3.5 h-3.5 text-[#2196F3]" />
              <span>Testsessie voltooid voor {profile.businessName}</span>
            </div>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Al uw geteste gesprekken en afspraken blijven hierboven bewaard zodat u deze kunt teruglezen of delen.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {!extensionRequested ? (
              <button
                onClick={handleRequestExtension}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2 rounded-xl transition-all border border-slate-300"
              >
                Vraag Verlenging Aan
              </button>
            ) : (
              <span className="bg-blue-50 text-[#0D47A1] text-xs font-semibold px-3 py-1.5 rounded-xl border border-blue-200">
                ✓ Verlenging Aangevraagd
              </span>
            )}

            <Link
              href="/admin"
              className="bg-[#2196F3] hover:bg-[#1E88E5] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1"
            >
              <span>Activeer Verde AI voor Uw Bedrijf</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
        />
      )}

      {/* Business Info Modal */}
      <BusinessInfoModal
        profile={profile}
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        onSelectService={(serviceTitle) => handleSendMessage(`Ik wil graag een afspraak inplannen voor ${serviceTitle}.`)}
      />

      {/* Calendar Invite Modal */}
      <CalendarInviteModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
};
