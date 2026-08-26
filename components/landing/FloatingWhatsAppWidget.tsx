"use client";

import React, { useState } from "react";
import { MessageSquare, X, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface FloatingWhatsAppWidgetProps {
  agencyPhone?: string; // e.g. "31612345678"
}

export const FloatingWhatsAppWidget: React.FC<FloatingWhatsAppWidgetProps> = ({
  agencyPhone = "31612345678",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMessage = encodeURIComponent(
    "Hoi! Ik heb interesse in de Verde WhatsApp AI Boekingsengine voor mijn bedrijf. Kunnen we even overleggen?"
  );

  const whatsappUrl = `https://wa.me/${agencyPhone}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-24 md:bottom-6 right-5 md:right-6 z-50 flex flex-col items-end select-none">
      {/* Popover Bubble */}
      {isOpen && (
        <div className="mb-3 w-[min(20rem,calc(100vw-2.5rem))] bg-white dark:bg-[#0F131C] border border-slate-200/80 dark:border-white/[0.08] rounded-xl p-5 shadow-2xl animate-scale-up space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <BrandLogo className="w-8 h-8 shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Verde AI Advies</h4>
                <div className="flex items-center gap-1 text-[10px] text-[#2196F3] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2196F3] animate-ping" />
                  <span>Direct bereikbaar via WhatsApp</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Wilt u Verde AI inzetten voor uw praktijk of salon? Stuur ons direct een bericht via WhatsApp — u krijgt binnen een werkdag antwoord van een mens.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#2196F3] hover:bg-[#1E88E5] text-white font-semibold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat via WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-[#2196F3] hover:bg-[#1E88E5] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(33,150,243,0.4)] hover:scale-105 active:scale-95 transition-all"
        title="Chat met Verde AI"
        aria-label="Open het WhatsApp adviesvenster van Verde AI"
      >
        <BrandLogo className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF9100] border-2 border-white text-[9px] font-bold flex items-center justify-center text-white">
          1
        </span>
      </button>
    </div>
  );
};
