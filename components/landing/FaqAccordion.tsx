"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, HeartHandshake } from "lucide-react";

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Kan ik gewoon mijn huidige bedrijfsnummer behouden?",
      a: "Ja, 100%! Verde AI koppelt aan jouw bestaande vaste of mobiele telefoonnummer. Je hoeft dus geen nieuw nummer te communiceren naar je vaste klanten.",
    },
    {
      q: "Wat gebeurt er als ik zelf handmatig een afspraak in mijn agenda zet?",
      a: "Verde kijkt continu live in jouw Google Agenda. Zodra jij een afspraak, lunch of vakantie inplant, ziet de AI dat direct en wordt dat tijdslot automatisch niet meer aangeboden aan klanten op WhatsApp.",
    },
    {
      q: "Moet ik technische kennis hebben om dit in te stellen?",
      a: "Helemaal niet. Je plakt gewoon jouw website-URL in onze generator. Onze AI leest direct jouw diensten en openingstijden uit. Binnen 2 minuten staat je demo klaar.",
    },
    {
      q: "Wat als een klant een vraag stelt die te specifiek is?",
      a: "Geen zorgen. Als iemand een medisch complexe of ongebruikelijke vraag stelt, meldt de AI netjes dat je medewerker zo snel mogelijk contact opneemt en wordt er een belnotitie voor je klaargezet.",
    },
    {
      q: "Zit ik vast aan een lang contract?",
      a: "Nee, absoluut niet. Je kunt Verde AI maandelijks opzeggen of pauzeren wanneer je wilt. Wel zo eerlijk.",
    },
  ];

  return (
    <section className="max-w-3xl mx-auto space-y-6 px-4 sm:px-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-extrabold text-[#0ACF83] bg-[#0ACF83]/10 dark:bg-[#0ACF83]/20 px-3 py-1 rounded-full uppercase tracking-wider">
          Vragen & Antwoorden
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Veelgestelde vragen van ondernemers
        </h2>
      </div>

      <div className="space-y-3 pt-2">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#27272A] overflow-hidden transition-all shadow-2xs"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-[#0ACF83] dark:hover:text-[#0ACF83] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#0ACF83]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
