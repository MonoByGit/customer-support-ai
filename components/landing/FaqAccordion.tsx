"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Behoud ik mijn huidige zakelijke telefoonnummer?",
      a: "Ja, 100%. De Verde AI Engine koppelt direct via de officiële Meta WhatsApp Cloud API aan uw bestaande vaste of mobiele telefoonnummer. U hoeft geen nieuw nummer aan te vragen.",
    },
    {
      q: "Hoe voorkomt het systeem dubbele boekingen in Google Agenda?",
      a: "Verde AI controleert realtime de beschikbaarheid in uw Google Agenda via de officiële Service Account API. Zodra een tijdslot bezet is (door een handmatige invoer of andere afspraak), wordt dit direct uitgesloten voor nieuwe WhatsApp boekingen.",
    },
    {
      q: "Wat gebeurt er bij complexe of medisch-inhoudelijke vragen?",
      a: "De AI handelt strikt binnen de kaders van uw goedgekeurde bedrijfsprofiel. Bij specifieke, gevoelige of medische vragen stelt de AI voor om een terugbelnotitie aan te maken en informeert het uw balie of behandelaar.",
    },
    {
      q: "Hoe snel kan Verde AI actief zijn op onze website?",
      a: "Binnen enkele minuten. U voert uw website-URL in, onze scraper leest uw diensten en openingstijden uit, en u kunt direct de kant-en-klare WhatsApp widget of wa.me link toevoegen.",
    },
    {
      q: "Hoe zit het met privacy en AVG (GDPR) wetgeving?",
      a: "Het systeem voldoet volledig aan de Europese privacywetgeving (AVG/GDPR). Gegevens worden versleuteld verwerkt en uitsluitend gebruikt voor het vastleggen van de afspraak in uw agenda.",
    },
  ];

  return (
    <section className="max-w-3xl mx-auto space-y-6 px-4 sm:px-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Veelgestelde Vragen
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Antwoorden op veelgestelde vragen
        </h2>
      </div>

      <div className="space-y-3 pt-2">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0F141C] overflow-hidden transition-all shadow-2xs"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-emerald-500" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/[0.04] pt-3 animate-fade-in">
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
