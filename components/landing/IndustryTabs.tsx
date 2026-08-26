"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const IndustryTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const industries = [
    {
      id: "tandarts",
      title: "Tandartspraktijken",
      slug: "tandarts-demo",
      badge: "Mondzorg & Klinieken",
      headline: "Geen telefoontjes meer aannemen tijdens behandelingen",
      description:
        "Laat patiënten zelfstandig controles, gebitsreinigingen en intakes inplannen via WhatsApp. Acute spoedklachten worden direct herkend en met voorrang ingeroosterd.",
      benefits: [
        "Tot 70% minder inkomende telefoontjes aan de balie",
        "Automatische herinneringen via WhatsApp verminderen no-shows tot 0%",
        "Direct gekoppeld aan de praktijk Google Calendar",
      ],
      sampleQuestion: "Hoi! Ik heb last van een kies en wil graag morgen een afspraak.",
      sampleAnswer: "Vervelend van de pijn! Ik heb morgen om 10:00 uur of 14:00 uur plek voor een spoedcontrole. Welke past?",
    },
    {
      id: "salon",
      title: "Kapsalons & Beauty",
      slug: "salon-elegance",
      badge: "Haar, Schoonheid & Nails",
      headline: "Volgeboekte stoelen zonder je werk te onderbreken",
      description:
        "Klanten willen 's avonds op de bank hun knip- of kleurafspraak regelen. Verde beantwoordt vragen over tarieven en vult automatisch de lege gaatjes in je agenda.",
      benefits: [
        "Vangt afspraken af buiten openingstijden (meer dan 45% van alle boekingen)",
        "Duidelijke selectie van dames-, heren- of kleurbehandelingen",
        "Mogelijkheid tot direct doorverwijzen naar stylingadvies",
      ],
      sampleQuestion: "Wat kost een balayage en kan ik zaterdag terecht?",
      sampleAnswer: "Een balayage is vanaf €145 inclusief styling. Zaterdag heb ik om 11:00 uur of 14:30 uur plek! Zullen we boeken?",
    },
    {
      id: "loodgieter",
      title: "Loodgieters & Bouw",
      slug: "snelservice-loodgieter",
      badge: "Installatietechniek & Spoed",
      headline: "24/7 spoedklussen direct ingepland terwijl jij aan het werk bent",
      description:
        "Als je onder een cv-ketel ligt kun je de telefoon niet opnemen. Verde vangt acute waterlekkages en onderhoudsverzoeken direct op en verzamelt naam, adres en probleemomschrijving.",
      benefits: [
        "Directe intake van storingslocatie, fotos en urgentie",
        "Monteursroosters direct up-to-date in Google Calendar",
        "Geen gemiste spoedklussen aan concurrenten",
      ],
      sampleQuestion: "Help, ik heb een acute lekkage in Utrecht!",
      sampleAnswer: "Vervelend! We kunnen binnen 45 minuten ter plaatse zijn. Wat is je adres en telefoonnummer?",
    },
  ];

  const current = industries[activeTab];

  return (
    <section className="max-w-6xl mx-auto space-y-10 px-4 sm:px-6">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Gespecialiseerd per Branche
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Exact afgestemd op jouw type afspraken
        </h2>
      </div>

      {/* Tabs Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-xs gap-1 overflow-x-auto max-w-full">
          {industries.map((ind, idx) => (
            <button
              key={ind.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === idx
                  ? "bg-[#00D492] text-slate-950 shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]"
              }`}
            >
              {ind.title}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Box */}
      <div className="rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#0d141e] border border-slate-200 dark:border-white/[0.08] shadow-xl dark:shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
        {/* Left column info */}
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/25 uppercase">
              {current.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
              {current.headline}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {current.description}
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
            {current.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#00D492] shrink-0 mt-0.5" />
                <span>{b}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              href={`/demo/${current.slug}`}
              className="inline-flex items-center gap-2 bg-[#00D492] hover:bg-[#00be82] active:scale-95 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all"
            >
              <span>Test Live {current.title} Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right column simulated WhatsApp card */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-3 shadow-inner">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-white/[0.06]">
            <Sparkles className="w-3.5 h-3.5 text-[#00D492]" />
            <span>Voorbeeld WhatsApp Gespreksflow</span>
          </div>

          {/* User message */}
          <div className="flex justify-end">
            <div className="bg-[#DCF8C6] text-[#111B21] rounded-2xl rounded-tr-xs px-3.5 py-2 text-xs max-w-[85%] shadow-2xs">
              {current.sampleQuestion}
            </div>
          </div>

          {/* AI response */}
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-xs max-w-[88%] shadow-2xs border border-slate-200/60 dark:border-white/[0.06] space-y-2">
              <p>{current.sampleAnswer}</p>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Geïntegreerd met Google Calendar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
