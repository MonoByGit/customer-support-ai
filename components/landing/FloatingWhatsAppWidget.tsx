"use client";

import React, { useState } from "react";
import { MessageSquare, X, ArrowRight, CheckCircle2 } from "lucide-react";

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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end selection:bg-[#00D492] select-none">
      {/* Popover Bubble */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white dark:bg-[#0F141C] border border-slate-200 dark:border-white/[0.1] rounded-3xl p-5 shadow-2xl animate-scale-up space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Verde AI Advies</h4>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Direct bereikbaar via WhatsApp</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Wilt u Verde AI inzetten voor uw praktijk of salon? Stuur ons direct een berichtje via WhatsApp voor een persoonlijke demo of advies.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
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
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95 transition-all group"
        title="Chat met Verde AI"
      >
        <MessageSquare className="w-7 h-7 text-white fill-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white text-[9px] font-bold flex items-center justify-center">
          1
        </span>
      </button>
    </div>
  );
};
