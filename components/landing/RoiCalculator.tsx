"use client";

import React, { useState } from "react";
import { TrendingUp, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const RoiCalculator: React.FC = () => {
  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(1500);
  const [avgTicketValue, setAvgTicketValue] = useState<number>(85);

  // Conservative conversion boost: 2.8% extra appointments booked via WhatsApp instead of bounced visitors
  const extraAppointments = Math.round(monthlyVisitors * 0.028);
  const extraMonthlyRevenue = extraAppointments * avgTicketValue;
  const extraAnnualRevenue = extraMonthlyRevenue * 12;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#0d141e] border border-slate-200 dark:border-white/[0.08] shadow-xl dark:shadow-2xl space-y-8 transition-colors">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Interactieve ROI Berekening</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Hoeveel omzet laat jij nu liggen op je website?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Meer dan 40% van je potentiële klanten bezoekt je site 's avonds of in het weekend en haakt af op statische contactformulieren.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
        {/* Sliders Area */}
        <div className="space-y-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-white/[0.06]">
          {/* Slider 1 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Websitebezoekers per maand</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                {monthlyVisitors.toLocaleString("nl-NL")} bezoekers
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="10000"
              step="100"
              value={monthlyVisitors}
              onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
              className="w-full accent-[#00D492] cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-600 dark:text-slate-400">
              <span>200</span>
              <span>5.000</span>
              <span>10.000+</span>
            </div>
          </div>

          {/* Slider 2 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Gemiddelde behandel- of orderwaarde</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                € {avgTicketValue}
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="500"
              step="5"
              value={avgTicketValue}
              onChange={(e) => setAvgTicketValue(Number(e.target.value))}
              className="w-full accent-[#00D492] cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-600 dark:text-slate-400">
              <span>€30 (Controle/Knippen)</span>
              <span>€250 (Kliniek)</span>
              <span>€500 (Installatie)</span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-gradient-to-br from-emerald-950/90 to-teal-950/90 dark:from-[#06241b] dark:to-[#041a14] border border-emerald-500/30 rounded-2xl p-6 sm:p-7 text-white space-y-4 shadow-lg shadow-emerald-950/20">
          <div className="space-y-1">
            <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
              Geschatte Extra Omzet
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#00D492] font-mono">
              + € {extraMonthlyRevenue.toLocaleString("nl-NL")}
              <span className="text-xs text-emerald-200 font-normal"> / maand</span>
            </div>
            <div className="text-xs text-emerald-100/90 pt-1">
              Dat is circa <strong className="text-white">€ {extraAnnualRevenue.toLocaleString("nl-NL")} per jaar</strong> aan extra geboekte afspraken!
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-500/20 text-xs space-y-1.5 text-emerald-100/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D492]" />
              <span>Circa <strong>+{extraAppointments} extra afspraken</strong> per maand</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D492]" />
              <span>0 extra werk voor balie of receptie</span>
            </div>
          </div>

          <Link
            href="/admin"
            className="w-full bg-[#00D492] hover:bg-[#00be82] active:scale-95 text-slate-950 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md mt-2"
          >
            <span>Activeer Verde AI voor Jouw Praktijk</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
