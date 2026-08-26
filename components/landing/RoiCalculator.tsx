"use client";

import React, { useState } from "react";
import { TrendingUp, ArrowRight, Sparkles, CheckCircle2, Calculator, Coins } from "lucide-react";
import Link from "next/link";

export const RoiCalculator: React.FC = () => {
  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(1200);
  const [avgTicketValue, setAvgTicketValue] = useState<number>(75);

  // Conservative calculation: ~2.8% of website visitors book an appointment via WhatsApp
  const extraAppointments = Math.round(monthlyVisitors * 0.028);
  const extraMonthlyRevenue = extraAppointments * avgTicketValue;
  const extraAnnualRevenue = extraMonthlyRevenue * 12;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-10 figma-card space-y-8 relative overflow-hidden">
      {/* Playful Figma Corner Badge */}
      <div className="absolute top-4 right-4 bg-[#FFC700] text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-xs transform rotate-2 hidden sm:flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Reken direct uit!</span>
      </div>

      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0ACF83] bg-[#0ACF83]/10 dark:bg-[#0ACF83]/20 px-3 py-1 rounded-full uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5" />
          <span>Eenvoudige Berekening</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Hoeveel afspraken mis jij nu na sluitingstijd?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Veel klanten appen liever snel 's avonds vanaf de bank. Bereken wat Verde AI jou maandelijks oplevert.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
        {/* Sliders Area */}
        <div className="space-y-6 bg-slate-50 dark:bg-[#1E1E1E] p-6 rounded-2xl border border-slate-200 dark:border-white/10">
          {/* Slider 1 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span>Websitebezoekers per maand</span>
              <span className="bg-[#18A0FB]/10 text-[#18A0FB] dark:bg-[#18A0FB]/20 font-bold px-2 py-0.5 rounded-lg text-xs font-mono">
                {monthlyVisitors.toLocaleString("nl-NL")} bezoekers
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="8000"
              step="100"
              value={monthlyVisitors}
              onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
              className="w-full accent-[#0ACF83] cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400 dark:text-slate-500">
              <span>200 (Kleine salon)</span>
              <span>2.500 (Praktijk)</span>
              <span>8.000+ (Drukke kliniek)</span>
            </div>
          </div>

          {/* Slider 2 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span>Gemiddelde prijs per behandeling / afspraak</span>
              <span className="bg-[#A259FF]/10 text-[#A259FF] dark:bg-[#A259FF]/20 font-bold px-2 py-0.5 rounded-lg text-xs font-mono">
                € {avgTicketValue}
              </span>
            </div>
            <input
              type="range"
              min="25"
              max="400"
              step="5"
              value={avgTicketValue}
              onChange={(e) => setAvgTicketValue(Number(e.target.value))}
              className="w-full accent-[#A259FF] cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400 dark:text-slate-500">
              <span>€30 (Knippen)</span>
              <span>€75 (Controle / Fysio)</span>
              <span>€250+ (Spoedklussen)</span>
            </div>
          </div>
        </div>

        {/* Results Card (Figma Style Vibrant Gradient Box) */}
        <div className="bg-gradient-to-br from-[#0ACF83] to-[#075E54] text-white rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-100 bg-black/20 px-2.5 py-0.5 rounded-full inline-block">
              Extra omzet voor jouw zaak
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white pt-1">
              + € {extraMonthlyRevenue.toLocaleString("nl-NL")}
              <span className="text-xs text-emerald-100 font-normal font-sans"> / maand</span>
            </div>
            <div className="text-xs text-emerald-100/90 pt-1">
              Dat is ongeveer <strong>€ {extraAnnualRevenue.toLocaleString("nl-NL")} per jaar</strong> aan extra geboekte afspraken!
            </div>
          </div>

          <div className="pt-3 border-t border-white/20 text-xs space-y-2 text-emerald-50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              <span>Circa <strong>+{extraAppointments} extra afspraken</strong> per maand</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              <span>100% automatisch ingepland in je agenda</span>
            </div>
          </div>

          <Link
            href="/admin"
            className="w-full bg-slate-950 hover:bg-black active:scale-95 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md mt-2"
          >
            <span>Start nu gratis voor jouw bedrijf</span>
            <ArrowRight className="w-4 h-4 text-[#0ACF83]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
