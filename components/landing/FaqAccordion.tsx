"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Behoud ik mijn eigen huidige WhatsApp Business nummer?",
      a: "Ja, 100%. De Verde AI Engine koppelt direct via de officiële Meta WhatsApp Cloud API aan jouw bestaande vaste of mobiele bedrijfsnummer. Je hoeft geen nieuw nummer aan te schaffen en je behoudt al je bestaande chatgeschiedenis.",
    },
    {
      q: "Hoe voorkomt het systeem dubbele boekingen in mijn Google Agenda?",
      a: "Onze engine voert realtime een 2-way query uit op je Google Agenda met de Service Account API. Zodra een tijdslot bezet is (door een handmatige invoer, vakantie of andere afspraak), wordt dit slot direct geblokkeerd voor WhatsApp boekingen.",
    },
    {
      q: "Wat gebeurt er als een klant een vraag stelt die de AI niet weet?",
      a: "De AI blijft altijd professioneel binnen de kaders van jouw bedrijfsprofiel en richtlijnen. Als een vraag te specifiek of medisch complex is, stelt de AI voor om een terugbelnotitie te maken of schakelt het door naar een menselijke medewerker.",
    },
    {
      q: "Hoe lang duurt het voordat het systeem live staat op mijn website?",
      a: "Binnen 2 minuten. Plak je website URL in onze generator, bekijk het geëxtraheerde profiel in de live demo, en plak het meegeleverde iFrame of de wa.me link op je website.",
    },
    {
      q: "Kan ik behandelingen, prijzen en openingstijden later eenvoudig aanpassen?",
      a: "Jazeker. Via het beheerpaneel pas je met één klik tarieven, openingstijden of speciale feestdagroosters aan. De AI past direct haar antwoorden aan.",
    },
  ];

  return (
    <section className="max-w-3xl mx-auto space-y-8 px-4 sm:px-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Veelgestelde Vragen
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Alles wat je moet weten over Verde WhatsApp AI
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0d141e] overflow-hidden transition-all shadow-2xs"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-emerald-500" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/[0.04] pt-3 animate-fade-in">
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
