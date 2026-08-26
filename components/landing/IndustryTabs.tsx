"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
} from "lucide-react";

export const IndustryTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const industries = [
    {
      id: "tandarts",
      title: "Tandartspraktijken",
      slug: "tandarts-demo",
      badge: "Mondzorg & Klinieken",
      headline: "Optimale rust aan de balie en maximale bezettingsgraad",
      description:
        "Patiënten plannen zelfstandig controles en reguliere behandelingen in via WhatsApp. Acute spoedklachten worden direct herkend en geprioriteerd.",
      benefits: [
        "Tot 70% minder inkomende telefoontjes tijdens consulten",
        "Automatische WhatsApp afspraakbevestigingen en herinneringen",
        "Rechtstreekse 2-way synchronisatie met Google Calendar",
      ],
      sampleQuestion: "Goedemiddag, ik wil graag een periodieke controle inplannen voor volgende week.",
      sampleAnswer: "Goedemiddag! Wij hebben dinsdag om 09:30 uur of donderdag om 14:00 uur ruimte. Welk tijdstip schikt u het beste?",
    },
    {
      id: "salon",
      title: "Kapsalons & Beauty",
      slug: "salon-elegance",
      badge: "Haar- & Schoonheidsklinieken",
      headline: "Volgeboekte stoelen zonder onderbreking van uw werk",
      description:
        "Klanten oriënteren zich vaak 's avonds op behandelingen. Verde AI beantwoordt tariefvragen en vult automatisch de openstaande plekken in uw agenda.",
      benefits: [
        "Converteert websitebezoekers buiten openingstijden",
        "Duidelijke selectie van specialistische behandelingen",
        "Geen onderbrekingen van lopende afspraken",
      ],
      sampleQuestion: "Wat is het tarief voor een balayage en kan ik zaterdag terecht?",
      sampleAnswer: "Een balayage is beschikbaar vanaf €145 inclusief styling. Zaterdag hebben wij om 11:00 uur of 14:30 uur plek. Zullen wij dit vastleggen?",
    },
    {
      id: "loodgieter",
      title: "Installatiebedrijven & Loodgieters",
      slug: "snelservice-loodgieter",
      badge: "Techniek & Spoedservice",
      headline: "Directe intake van spoedklussen tijdens werkzaamheden",
      description:
        "Wanneer monteurs op locatie bezig zijn, vangt Verde AI acute storingen en onderhoudsverzoeken direct op via WhatsApp inclusief adres en urgentie.",
      benefits: [
        "Gestructureerde intake van storingsadres, foto's en type klus",
        "Geen verlies van spoedaanvragen aan concurrenten",
        "Monteursplanning direct gekoppeld aan de agenda",
      ],
      sampleQuestion: "Help, ik heb met spoed een loodgieter nodig voor een lekkage in Amsterdam!",
      sampleAnswer: "Vervelend! Onze monteur kan binnen 45 minuten ter plaatse zijn. Wat is uw straatnaam en huisnummer?",
    },
  ];

  const current = industries[activeTab];

  return (
    <section className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Branches & Toepassingen
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          Afgestemd op uw specifieke afspraakstructuur
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Of het nu gaat om consulten, behandelingen of storingsdiensten: Verde AI hanteert direct het juiste protocol.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-xs gap-1 overflow-x-auto max-w-full">
          {industries.map((ind, idx) => (
            <button
              key={ind.id}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === idx
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {ind.title}
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="rounded-3xl p-6 sm:p-10 premium-card grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 uppercase">
              {current.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight pt-1">
              {current.headline}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {current.description}
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
            {current.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{b}</span>
              </div>
            ))}
          </div>

          <div className="pt-3">
            <Link
              href={`/demo/${current.slug}`}
              className="inline-flex items-center gap-2 bg-[#00D492] hover:bg-[#00be82] active:scale-95 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-sm transition-all"
            >
              <span>Bekijk {current.title} Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* WhatsApp Preview Box */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] space-y-3">
          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-white/[0.06]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Voorbeeld WhatsApp Gespreksverloop</span>
          </div>

          <div className="flex justify-end">
            <div className="bg-[#DCF8C6] text-[#111B21] rounded-2xl rounded-tr-xs px-3.5 py-2 text-xs max-w-[85%] shadow-2xs">
              {current.sampleQuestion}
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-xs max-w-[88%] shadow-2xs border border-slate-200 dark:border-white/[0.06] space-y-2">
              <p>{current.sampleAnswer}</p>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>Gesynchroniseerd met Google Agenda</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
