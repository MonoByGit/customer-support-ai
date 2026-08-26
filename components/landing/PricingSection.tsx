"use client";

import React, { useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: "Starter",
      description: "Voor zelfstandige praktijken, salons en kleine bedrijven.",
      priceMonthly: 79,
      priceAnnual: 65,
      features: [
        "1 WhatsApp Business Nummer",
        "Tot 300 AI afspraken per maand",
        "Realtime Google Calendar synchronisatie",
        "Website Chat Widget & wa.me link",
        "Nederlands & Engels taalherkenning",
        "Standaard kantoortijden support",
      ],
      popular: false,
      cta: "Start met Starter",
    },
    {
      name: "Professional",
      description: "Voor drukke tandartsen, klinieken en groeiende salons.",
      priceMonthly: 149,
      priceAnnual: 119,
      features: [
        "Alles in Starter, plus:",
        "Onbeperkt aantal AI gesprekken & boekingen",
        "WhatsApp Interactive Buttons & Quick Replies",
        "2-Way agenda sync (voorkomt dubbele boekingen)",
        "Aangepaste Tone-of-Voice & praktijkrichtlijnen",
        "Spraakbericht herkenning (Voice Notes)",
        "Prioriteit WhatsApp & Telefoon Support",
      ],
      popular: true,
      cta: "Kies Professional",
    },
    {
      name: "Multi-Locatie / Keten",
      description: "Voor praktijken met meerdere behandelaars of locaties.",
      priceMonthly: 299,
      priceAnnual: 239,
      features: [
        "Alles in Professional, plus:",
        "Tot 5 verschillende agenda's of behandelaars",
        "Slimme behandelaar & vestiging routing",
        "Meta Cloud API Webhook & CRM koppeling",
        "Eigen dedicated Account Manager",
        "Maatwerk SLA & onboarding service",
      ],
      popular: false,
      cta: "Neem Contact Op",
    },
  ];

  return (
    <section className="space-y-10 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Transparante Tarieven
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Verdien je investering terug met 1 extra afspraak
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Geen verborgen kosten, geen opstarttarieven. Maandelijks opzegbaar.
        </p>

        {/* Toggle */}
        <div className="inline-flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-xs pt-1">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !isAnnual
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Maandelijks
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isAnnual
                ? "bg-[#00D492] text-slate-950 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <span>Jaarlijks</span>
            <span className="text-[10px] bg-slate-950/20 text-slate-950 px-1.5 py-0.2 rounded font-mono font-bold">
              2 MND GRATIS
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {tiers.map((tier, idx) => {
          const price = isAnnual ? tier.priceAnnual : tier.priceMonthly;

          return (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                tier.popular
                  ? "bg-white dark:bg-[#0d141e] border-2 border-emerald-500 shadow-xl dark:shadow-2xl dark:shadow-emerald-950/40 md:-translate-y-2"
                  : "bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-white/[0.08] shadow-md dark:shadow-xl"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00D492] text-slate-950 px-3 py-1 rounded-full text-[10.5px] font-extrabold tracking-wider uppercase shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Meest Gekozen</span>
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
                    {isAnnual ? "Jaarlijks gefactureerd" : "Maandelijks flexibel opzegbaar"}
                  </div>
                </div>

                {/* Features List */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-2.5">
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-[#00D492] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href="/admin"
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    tier.popular
                      ? "bg-[#00D492] hover:bg-[#00be82] active:scale-95 text-slate-950 shadow-md"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-white/[0.08]"
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
