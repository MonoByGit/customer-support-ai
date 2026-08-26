"use client";

import React, { useState } from "react";
import {
  CheckCheck,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Signal,
  Wifi,
  Battery,
  Play,
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
    }, 1200);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSlot(null);
    setIsTyping(false);
  };

  return (
    <div className="relative w-full max-w-[360px] sm:max-w-[390px] mx-auto group">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-teal-500/20 rounded-[52px] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* Outer iPhone Chassis */}
      <div className="relative bg-black rounded-[46px] p-2.5 border-[8px] border-slate-800 shadow-[0_25px_70px_rgba(0,0,0,0.4)] dark:shadow-[0_25px_90px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
        {/* Screen */}
        <div className="relative w-full h-[520px] bg-[#EFEAE2] rounded-[36px] overflow-hidden flex flex-col text-[#111B21] select-none whatsapp-bg">
          {/* iOS Status Bar */}
          <div className="bg-[#075E54] text-white px-5 pt-3 pb-1 flex items-center justify-between text-[10.5px] font-semibold shrink-0 z-20">
            <span className="font-mono">09:41</span>
            <div className="w-20 h-3.5 bg-black rounded-full shadow-inner" />
            <div className="flex items-center gap-1.5 text-white/90">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white px-3.5 py-2 flex items-center justify-between shadow-xs shrink-0 z-20">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden border border-white/20 flex items-center justify-center font-bold text-xs shrink-0">
                TG
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-xs text-white truncate">
                    Tandartspraktijk De Groene Gracht
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-[#25D366] fill-[#25D366] stroke-white shrink-0" />
                </div>
                <p className="text-[10.5px] text-emerald-100/90 font-normal">
                  {isTyping ? "aan het typen..." : "Online • WhatsApp AI"}
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-emerald-100 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              title="Herstart demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Chat Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
            {/* Encryption notice */}
            <div className="text-center">
              <span className="bg-[#FFEECD] text-[#54656F] text-[10px] px-2.5 py-1 rounded-md shadow-2xs inline-block">
                🔒 End-to-end versleutelde AI demo
              </span>
            </div>

            {/* Bubble 1: Agent Welcome & Slots */}
            <div className="flex flex-col items-start w-full">
              <div className="bg-white rounded-2xl rounded-tl-xs shadow-[0_1px_0.5px_rgba(0,0,0,0.12)] max-w-[90%] overflow-hidden text-[13px] leading-relaxed">
                <div className="p-3 pb-1.5">
                  Hoi! Welkom bij Tandartspraktijk De Groene Gracht. 👋 Voor een <strong>Periodieke Controle</strong> heb ik de volgende plekken vrij:
                </div>
                <div className="text-[10px] text-slate-400 text-right px-3 pb-1.5">
                  09:41
                </div>

                {/* WhatsApp Interactive Quick Reply Buttons */}
                <div className="border-t border-slate-100 divide-y divide-slate-100 bg-slate-50/80">
                  <button
                    onClick={() => handleSelectSlot("Donderdag om 14:00 uur")}
                    disabled={step > 1}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#00A884] hover:bg-emerald-50 transition-colors flex items-center justify-between group/btn disabled:opacity-60"
                  >
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#00A884]" />
                      Donderdag 27 aug om 14:00 uur
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleSelectSlot("Vrijdag om 10:00 uur")}
                    disabled={step > 1}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#00A884] hover:bg-emerald-50 transition-colors flex items-center justify-between group/btn disabled:opacity-60"
                  >
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#00A884]" />
                      Vrijdag 28 aug om 10:00 uur
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bubble 2: User response */}
            {step >= 2 && selectedSlot && (
              <div className="flex flex-col items-end w-full animate-fade-in">
                <div className="bg-[#DCF8C6] text-[#111B21] rounded-2xl rounded-tr-xs px-3.5 py-2 shadow-[0_1px_0.5px_rgba(0,0,0,0.12)] text-[13px]">
                  <span>Ik kies graag {selectedSlot}! Mijn naam is Mark van Leeuwen (06-12345678).</span>
                  <div className="flex items-center justify-end gap-1 text-[9.5px] text-emerald-800/80 mt-0.5">
                    <span>09:42</span>
                    <CheckCheck className="w-3 h-3 text-[#53BDEB]" />
                  </div>
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start w-full animate-fade-in">
                <div className="bg-white rounded-2xl rounded-tl-xs px-3.5 py-2 shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A884] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A884] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A884] animate-bounce" />
                </div>
              </div>
            )}

            {/* Bubble 3: AI Confirmation with Calendar Card */}
            {step >= 3 && (
              <div className="flex flex-col items-start w-full animate-scale-up">
                <div className="bg-white rounded-2xl rounded-tl-xs shadow-[0_1px_0.5px_rgba(0,0,0,0.12)] max-w-[92%] overflow-hidden text-[13px]">
                  <div className="p-3 pb-1.5">
                    Super Mark! 🎉 Je afspraak staat direct bevestigd in onze agenda. Tot dan!
                  </div>

                  {/* Confirmed Calendar Card */}
                  <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] text-white p-2.5 m-2 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-[11px] pb-1 border-b border-white/20">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#25D366]" /> Afspraak Bevestigd
                      </span>
                      <span className="font-mono text-[9px] bg-white/20 px-1 py-0.2 rounded">WA-8842</span>
                    </div>
                    <div className="text-[11px] font-semibold pt-0.5">Periodieke Gebitscontrole</div>
                    <div className="text-[10px] text-emerald-100">{selectedSlot}</div>
                    <div className="mt-1 text-center bg-white text-[#075E54] text-[10px] font-bold py-1 rounded-md">
                      ✓ Toegevoegd aan Google Agenda
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="bg-[#F0F2F5] p-2 flex items-center gap-2 shrink-0 border-t border-[#E9EDEF]">
            <div className="flex-1 bg-white rounded-xl px-3 py-1.5 text-xs text-slate-400 border border-slate-200 shadow-2xs flex items-center justify-between">
              <span>{step === 1 ? "Kies hierboven een tijdstip 👆" : "Afspraak succesvol geboekt ✓"}</span>
            </div>
            <button
              onClick={handleReset}
              className="w-7 h-7 rounded-full bg-[#00A884] text-white flex items-center justify-center shadow-xs text-xs font-bold"
              title="Reset"
            >
              ↻
            </button>
          </div>

          {/* Home swipe indicator */}
          <div className="bg-[#F0F2F5] py-1 flex justify-center shrink-0">
            <div className="w-24 h-1 bg-slate-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
