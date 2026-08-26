"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  Scissors,
  Smile,
  Wrench,
  Activity,
} from "lucide-react";

export const IndustryTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const industries = [
    {
      id: "tandarts",
      title: "Tandartspraktijk",
      emoji: "🦷",
      slug: "tandarts-demo",
      badgeColor: "bg-[#18A0FB]/15 text-[#18A0FB] border-[#18A0FB]/30",
      accentColor: "#18A0FB",
      headline: "Rust aan de balie en altijd gevulde stoelen",
      description:
        "Patiënten plannen zelfstandig controles en behandelingen in via WhatsApp. Spoedpijnklachten worden direct herkend en met voorrang ingeroosterd.",
      benefits: [
        "Tot 70% minder storende telefoontjes tijdens behandelingen",
        "Automatische WhatsApp herinneringen voorkomen no-shows",
        "Direct gekoppeld aan de praktijk Google Calendar",
      ],
      sampleQuestion: "Hoi! Ik wil graag volgende week een controle inplannen.",
      sampleAnswer: "Gezellig! Ik heb dinsdag om 09:30 uur of donderdag om 14:00 uur plek. Welke tijd past jou?",
    },
    {
      id: "salon",
      title: "Kapsalon & Beauty",
      emoji: "✂️",
      slug: "salon-elegance",
      badgeColor: "bg-[#A259FF]/15 text-[#A259FF] border-[#A259FF]/30",
      accentColor: "#A259FF",
      headline: "Nooit meer een knipbeurt missen terwijl je bezig bent",
      description:
        "Klanten bedenken vaak 's avonds dat ze geknipt of geverfd willen worden. Verde AI beantwoordt vragen over prijzen en boekt direct de lege plekken in.",
      benefits: [
        "Vangt afspraken af na sluitingstijd (meer dan 45% van alle boekingen)",
        "Directe keuze tussen dames-, heren- of kleurbehandelingen",
        "Klanten hoeven je niet te bellen tijdens het knippen",
      ],
      sampleQuestion: "Wat kost een balayage en kan ik zaterdag terecht?",
      sampleAnswer: "Een balayage is vanaf €145 incl. styling! Zaterdag heb ik om 11:00 uur of 14:30 uur plek. Zullen we boeken?",
    },
    {
      id: "loodgieter",
      title: "Loodgieter & Installatie",
      emoji: "🔧",
      slug: "snelservice-loodgieter",
      badgeColor: "bg-[#F24E1E]/15 text-[#F24E1E] border-[#F24E1E]/30",
      accentColor: "#F24E1E",
      headline: "Spoedklussen binnenhalen terwijl jij onder een ketel ligt",
      description:
        "Als je handen vol gereedschap zitten kun je niet opnemen. Verde vangt acute lekkages direct op en vraagt netjes naar adres, foto's en gewenst tijdstip.",
      benefits: [
        "Direct adres, foto's en urgentie verzamelen via WhatsApp",
        "Geen klussen meer verliezen aan de concurrent",
        "Monteursplanning direct gesynchroniseerd in de agenda",
      ],
      sampleQuestion: "Help, ik heb met spoed een loodgieter nodig voor een lekkage!",
      sampleAnswer: "Vervelend! We kunnen binnen 45 minuten ter plaatse zijn. Wat is je adres en huisnummer?",
    },
  ];

  const current = industries[activeTab];

  return (
    <section className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-[#0ACF83] bg-[#0ACF83]/10 dark:bg-[#0ACF83]/20 px-3 py-1 rounded-full uppercase tracking-wider">
          Ideaal voor Lokale Ondernemers
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Voor elke branche direct klaar voor gebruik
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Of je nu een salon, praktijk of klusbedrijf runt: Verde begrijpt jouw type afspraken direct.
        </p>
      </div>

      {/* Figma Pill Tab Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-100 dark:bg-[#27272A] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs gap-1.5 overflow-x-auto max-w-full">
          {industries.map((ind, idx) => (
            <button
              key={ind.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === idx
                  ? "bg-white dark:bg-[#18181B] text-slate-900 dark:text-white shadow-md border border-slate-200 dark:border-white/15 scale-105"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="text-base">{ind.emoji}</span>
              <span>{ind.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Showcase Card */}
      <div className="rounded-3xl p-6 sm:p-10 figma-card grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
        {/* Left column info */}
        <div className="space-y-5">
          <div className="space-y-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase ${current.badgeColor}`}>
              {current.emoji} {current.title}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
              {current.headline}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {current.description}
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/10">
            {current.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#0ACF83] shrink-0 mt-0.5" />
                <span>{b}</span>
              </div>
            ))}
          </div>

          <div className="pt-3">
            <Link
              href={`/demo/${current.slug}`}
              className="inline-flex items-center gap-2 bg-[#0ACF83] hover:bg-[#00be82] active:scale-95 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all"
            >
              <span>Test de {current.title} Demo Live</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right column simulated WhatsApp card */}
        <div className="bg-slate-50 dark:bg-[#18181B] p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#0ACF83]" />
            <span>Zo ziet het eruit voor jouw klant</span>
          </div>

          {/* User message */}
          <div className="flex justify-end">
            <div className="bg-[#DCF8C6] text-[#111B21] rounded-2xl rounded-tr-xs px-3.5 py-2 text-xs max-w-[85%] shadow-2xs font-normal">
              {current.sampleQuestion}
            </div>
          </div>

          {/* AI response */}
          <div className="flex justify-start">
            <div className="bg-white dark:bg-[#27272A] text-slate-900 dark:text-white rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-xs max-w-[88%] shadow-2xs border border-slate-200 dark:border-white/10 space-y-2">
              <p>{current.sampleAnswer}</p>
              <div className="bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-lg border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0ACF83]" />
                <span>Google Agenda direct bijgewerkt ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
