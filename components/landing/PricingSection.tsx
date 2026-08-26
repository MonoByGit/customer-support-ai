"use client";

import React, { useState } from "react";
import { Check, Sparkles, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: "Starter",
      description: "Voor zelfstandige ondernemers, kleine salons en praktijken.",
      priceMonthly: 69,
      priceAnnual: 55,
      features: [
        "1 WhatsApp Business Nummer",
        "Tot 250 afspraken per maand",
        "Google Agenda realtime synchronisatie",
        "Zwevende WhatsApp Widget op je site",
        "Eigen wa.me boekingslink voor Instagram",
        "Nederlandstalige ondersteuning",
      ],
      popular: false,
      cta: "Probeer Starter Gratis",
      tagColor: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
    },
    {
      name: "Professional",
      description: "Voor drukke tandartsen, salons en groeiende bedrijven.",
      priceMonthly: 129,
      priceAnnual: 99,
      features: [
        "Alles in Starter, plus:",
        "Onbeperkt aantal afspraken & chats",
        "WhatsApp Interactive Buttons (1-klik keuze)",
        "Automatische herinneringen (0% no-shows)",
        "Spraakberichten (Voice Notes) begrijpen",
        "Aanpasbare Tone-of-Voice & beleid",
        "Prioriteit WhatsApp ondersteuning",
      ],
      popular: true,
      cta: "Kies Professional",
      tagColor: "bg-[#0ACF83] text-slate-950",
    },
    {
      name: "Team & Keten",
      description: "Voor bedrijven met meerdere vestigingen of behandelaren.",
      priceMonthly: 249,
      priceAnnual: 199,
      features: [
        "Alles in Professional, plus:",
        "Tot 5 verschillende behandelaren of stoelen",
        "Slimme agenda-routing per medewerker",
        "Eigen dedicated accountmanager",
        "Koppeling met CRM en administratie",
        "Persoonlijke telefonische onboarding",
      ],
      popular: false,
      cta: "Neem Contact Op",
      tagColor: "bg-[#A259FF] text-white",
    },
  ];

  return (
    <section className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold text-[#0ACF83] bg-[#0ACF83]/10 dark:bg-[#0ACF83]/20 px-3 py-1 rounded-full uppercase tracking-wider">
          Eerlijke Tarieven
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Geen verrassingen, maandelijks opzegbaar
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Met slechts 1 extra geboekte afspraak per maand heeft het systeem zichzelf al terugverdiend.
        </p>

        {/* Playful Annual/Monthly Switcher */}
        <div className="pt-2">
          <div className="inline-flex items-center bg-slate-100 dark:bg-[#27272A] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !isAnnual
                  ? "bg-white dark:bg-[#18181B] text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Maandelijks
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isAnnual
                  ? "bg-[#0ACF83] text-slate-950 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <span>Jaarlijks</span>
              <span className="text-[10px] bg-slate-950/20 text-slate-950 px-1.5 py-0.5 rounded-md font-mono font-extrabold">
                -20% KORTING
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
        {tiers.map((tier, idx) => {
          const price = isAnnual ? tier.priceAnnual : tier.priceMonthly;

          return (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative figma-card ${
                tier.popular
                  ? "border-2 border-[#0ACF83] shadow-xl md:-translate-y-2 dark:bg-[#222225]"
                  : "hover:border-slate-300 dark:hover:border-white/20"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0ACF83] text-slate-950 px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Favoriet bij ondernemers</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
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
                    {isAnnual ? "Jaarlijks gefactureerd (2 maanden gratis)" : "Maandelijks flexibel opzegbaar"}
                  </div>
                </div>

                {/* Features */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2.5">
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-[#0ACF83]/15 text-[#0ACF83] flex items-center justify-center shrink-0 mt-0.5 font-bold">
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
                  className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    tier.popular
                      ? "bg-[#0ACF83] hover:bg-[#00be82] active:scale-95 text-slate-950 shadow-md"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-[#323236] dark:hover:bg-[#3f3f46] text-slate-900 dark:text-white"
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
