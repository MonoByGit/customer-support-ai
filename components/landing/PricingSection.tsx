"use client";

import React, { useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: "Starter",
      description: "Voor zelfstandige praktijken en kleinschalige dienstverleners.",
      priceMonthly: 79,
      priceAnnual: 65,
      features: [
        "1 WhatsApp Business Nummer",
        "Tot 300 AI afspraken per maand",
        "Realtime Google Agenda synchronisatie",
        "Zwevende WhatsApp Widget voor uw website",
        "wa.me directe boekingslink",
        "Nederlandstalige support",
      ],
      popular: false,
      cta: "Start met Starter",
    },
    {
      name: "Professional",
      description: "Voor drukke praktijken, klinieken en groeiende bedrijven.",
      priceMonthly: 149,
      priceAnnual: 119,
      features: [
        "Alles in Starter, plus:",
        "Onbeperkt aantal AI gesprekken & boekingen",
        "WhatsApp Interactive Buttons (1-klik keuze)",
        "2-Way agendacontrole (voorkomt dubbele boekingen)",
        "Aanpasbare Tone-of-Voice & bedrijfsspecifieke richtlijnen",
        "Ondersteuning voor spraakberichten (Voice Notes)",
        "Prioriteit WhatsApp & telefonische ondersteuning",
      ],
      popular: true,
      cta: "Kies Professional",
    },
    {
      name: "Multi-Locatie / Keten",
      description: "Voor organisaties met meerdere vestigingen of behandelaren.",
      priceMonthly: 299,
      priceAnnual: 239,
      features: [
        "Alles in Professional, plus:",
        "Tot 5 verschillende agenda's of behandelaren",
        "Intelligente agenda-routing per medewerker/locatie",
        "Meta Cloud API Webhooks & CRM integraties",
        "Dedicated Account Manager",
        "Persoonlijke onboarding & SLA garantie",
      ],
      popular: false,
      cta: "Neem Contact Op",
    },
  ];

  return (
    <section className="space-y-8 max-w-6xl mx-auto px-6 sm:px-10">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#2196F3] uppercase tracking-wider">
          Tarieven
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          Transparante investering per maand
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Geen verborgen kosten. Flexibel maandelijks opzegbaar.
        </p>

        {/* Switcher */}
        <div className="pt-2">
          <div className="inline-flex items-center bg-slate-100 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !isAnnual
                  ? "bg-white dark:bg-[#0F131C] text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Maandelijks
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isAnnual
                  ? "bg-[#2196F3] text-white shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <span>Jaarlijks</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-md font-mono font-bold">
                2 MND GRATIS
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
        {tiers.map((tier, idx) => {
          const price = isAnnual ? tier.priceAnnual : tier.priceMonthly;

          return (
            <div
              key={idx}
              className={`pro-card p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                tier.popular
                  ? "border-2 border-[#2196F3] shadow-lg md:-translate-y-2"
                  : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF9100] text-white px-3 py-0.5 rounded-full text-[10.5px] font-bold tracking-wider uppercase shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Meest Gekozen</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                      € {price}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">/ maand</span>
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {isAnnual ? "Jaarlijks gefactureerd" : "Maandelijks flexibel opzegbaar"}
                  </div>
                </div>

                {/* Features */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-2.5">
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-[#2196F3]/15 text-[#2196F3] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/admin"
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    tier.popular
                      ? "bg-[#2196F3] hover:bg-[#1E88E5] text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/[0.08]"
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
