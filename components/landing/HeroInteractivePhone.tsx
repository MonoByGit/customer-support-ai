"use client";

import React, { useState } from "react";
import {
  CheckCheck,
  Calendar,
  Clock,
  ChevronRight,
  CheckCircle2,
  Signal,
  Wifi,
  Battery,
  RotateCcw,
} from "lucide-react";

export const HeroInteractivePhone: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSelectSlot = (slotText: string) => {
    setSelectedSlot(slotText);
    setStep(2);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setStep(3);
    }, 1100);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSlot(null);
    setIsTyping(false);
  };

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[355px] mx-auto py-2">
      {/* Subtle Blue Glow Backdrop */}
      <div className="absolute -inset-1 bg-gradient-to-b from-[#2196F3]/20 to-[#0D47A1]/10 rounded-[56px] blur-2xl opacity-60 -z-10" />

      {/* =========================================================================
          AUTHENTIC IPHONE 16 PRO SMARTPHONE CHASSIS (19.5:9 RATIO)
          ========================================================================= */}
      <div className="relative bg-[#1A1A1A] rounded-[52px] p-2.5 border-[4px] border-[#333333] shadow-[0_25px_70px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex flex-col">
        {/* Screen Bezel */}
        <div className="relative w-full h-[620px] sm:h-[650px] bg-[var(--wa-wallpaper)] rounded-[44px] overflow-hidden flex flex-col text-[var(--wa-text)] select-none whatsapp-bg">
          
          {/* iOS Status Bar + Dynamic Island */}
          <div className="bg-[#0A192F] text-white px-5 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold shrink-0 z-20">
            <span className="font-mono">09:41</span>
            
            {/* Dynamic Island */}
            <div className="w-24 h-4.5 bg-black rounded-full shadow-inner flex items-center justify-end px-2 gap-1">
              <div className="w-2 h-2 rounded-full bg-[#1A1A1A]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#2196F3]/80" />
            </div>

            <div className="flex items-center gap-1 text-white/90">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* WhatsApp Chat Header */}
          <div className="bg-[#0D47A1] text-white px-3.5 py-2.5 flex items-center justify-between shadow-xs shrink-0 z-20">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2196F3] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                TG
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-white truncate">
                    Tandartspraktijk De Groene Gracht
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2196F3] fill-[#2196F3] stroke-white shrink-0" />
                </div>
                <p className="text-[10.5px] text-blue-100 font-normal">
                  {isTyping ? "aan het typen..." : "Online • WhatsApp AI"}
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-blue-100 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              title="Herstart gesprek"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Chat Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
            {/* Encryption notice */}
            <div className="text-center pt-1">
              <span className="bg-[#FFEECD] text-[#54656F] text-[10px] px-3 py-1 rounded-md shadow-2xs inline-block font-medium">
                🔒 End-to-end versleuteld
              </span>
            </div>

            {/* Bubble 1: AI Welcome & Interactive Buttons */}
            <div className="flex flex-col items-start w-full">
              <div className="wa-bubble-in rounded-2xl rounded-tl-xs shadow-[0_1px_1px_rgba(0,0,0,0.1)] max-w-[92%] overflow-hidden text-[13px] leading-relaxed">
                <div className="p-3 pb-1.5">
                  Goedendag! Welkom bij Tandartspraktijk De Groene Gracht. 👋 Voor een <strong>Periodieke Gebitscontrole</strong> hebben wij de volgende plekken vrij:
                </div>
                <div className="text-[10px] text-slate-400 text-right px-3 pb-1.5">
                  09:41
                </div>

                {/* WhatsApp Interactive Quick Reply Buttons */}
                <div className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/90">
                  <button
                    onClick={() => handleSelectSlot("Donderdag 27 aug om 14:00 uur")}
                    disabled={step > 1}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-[#2196F3] hover:bg-blue-50 active:bg-blue-100 transition-colors flex items-center justify-between group/btn disabled:opacity-60"
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#2196F3]" />
                      Donderdag 27 aug om 14:00 uur
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#2196F3] group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleSelectSlot("Vrijdag 28 aug om 10:00 uur")}
                    disabled={step > 1}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-[#2196F3] hover:bg-blue-50 active:bg-blue-100 transition-colors flex items-center justify-between group/btn disabled:opacity-60"
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#2196F3]" />
                      Vrijdag 28 aug om 10:00 uur
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#2196F3] group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bubble 2: User response */}
            {step >= 2 && selectedSlot && (
              <div className="flex flex-col items-end w-full animate-fade-in">
                <div className="bg-[var(--wa-bubble-out)] text-[var(--wa-text)] rounded-2xl rounded-tr-xs px-3.5 py-2 shadow-[0_1px_1px_rgba(0,0,0,0.1)] text-[13px] max-w-[88%]">
                  <span>Ik kies graag {selectedSlot}! Mijn naam is Mark van Leeuwen (06-12345678).</span>
                  <div className="flex items-center justify-end gap-1 text-[9.5px] text-slate-500 mt-0.5">
                    <span>09:42</span>
                    <CheckCheck className="w-3 h-3 text-[#2196F3]" />
                  </div>
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start w-full animate-fade-in">
                <div className="wa-bubble-in rounded-2xl rounded-tl-xs px-3.5 py-2.5 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2196F3] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-[#2196F3] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-[#2196F3] animate-bounce" />
                </div>
              </div>
            )}

            {/* Bubble 3: AI Confirmation with Calendar Card */}
            {step >= 3 && (
              <div className="flex flex-col items-start w-full animate-scale-up">
                <div className="wa-bubble-in rounded-2xl rounded-tl-xs shadow-[0_1px_1px_rgba(0,0,0,0.1)] max-w-[92%] overflow-hidden text-[13px]">
                  <div className="p-3 pb-1.5">
                    Uitstekend de heer Van Leeuwen! Uw afspraak staat direct bevestigd in onze praktijkagenda. Tot dan!
                  </div>

                  {/* Confirmed Calendar Card */}
                  <div className="bg-gradient-to-br from-[#0D47A1] to-[#1565C0] text-white p-3 m-2.5 rounded-xl text-xs space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between font-bold text-[11px] pb-1 border-b border-white/20">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#FF9100]" /> Afspraak Bevestigd
                      </span>
                      <span className="font-mono text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold">WA-8842</span>
                    </div>
                    <div className="text-[12px] font-bold pt-0.5">Periodieke Gebitscontrole</div>
                    <div className="text-[11px] text-blue-100">{selectedSlot}</div>
                    <div className="mt-1.5 text-center bg-white text-[#0D47A1] text-[10.5px] font-bold py-1.5 rounded-lg shadow-2xs">
                      ✓ Gesynchroniseerd met Google Agenda
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Interactive Bar */}
          <div className="bg-[var(--wa-panel)] p-2.5 flex items-center gap-2 shrink-0 border-t border-[var(--wa-divider)]">
            <div className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-slate-400 border border-slate-200 shadow-2xs flex items-center justify-between">
              <span>{step === 1 ? "Selecteer een tijdslot hierboven" : "Afspraak succesvol ingepland ✓"}</span>
            </div>
            <button
              onClick={handleReset}
              className="w-8 h-8 rounded-full bg-[#2196F3] text-white flex items-center justify-center shadow-xs text-xs font-bold hover:bg-[#1E88E5] active:scale-95 transition-all"
              title="Herstart simulatie"
            >
              ↻
            </button>
          </div>

          {/* iOS Bottom Swipe Indicator */}
          <div className="bg-[var(--wa-panel)] pb-2 flex justify-center shrink-0">
            <div className="w-28 h-1 bg-slate-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
