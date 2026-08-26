"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Calculator } from "lucide-react";
import Link from "next/link";

export const RoiCalculator: React.FC = () => {
  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(1500);
  const [avgTicketValue, setAvgTicketValue] = useState<number>(85);

  // Conservative calculation: ~2.8% conversion boost via WhatsApp
  const extraAppointments = Math.round(monthlyVisitors * 0.028);
  const extraMonthlyRevenue = extraAppointments * avgTicketValue;
  const extraAnnualRevenue = extraMonthlyRevenue * 12;

  return (
    <div className="w-full max-w-4xl mx-auto pro-card p-6 sm:p-10 space-y-8">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2196F3] bg-[#2196F3]/10 px-3 py-1 rounded-full uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5" />
          <span>Rendementsberekening</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Bereken uw potentiële omzetgroei
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Meer dan 40% van de websitebezoekers oriënteert zich buiten kantoortijden. Verde AI zet deze bezoekers 24/7 om in afspraken.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
        {/* Sliders */}
        <div className="space-y-6 bg-slate-50 dark:bg-white/[0.03] p-6 rounded-xl border border-slate-200/80 dark:border-white/[0.08]">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Websitebezoekers per maand</span>
              <span className="text-[#2196F3] font-mono font-bold text-sm">
                {monthlyVisitors.toLocaleString("nl-NL")}
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="10000"
              step="100"
              value={monthlyVisitors}
              onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
              className="w-full accent-[#2196F3] cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400">
              <span>200</span>
              <span>5.000</span>
              <span>10.000+</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Gemiddelde behandel- of orderwaarde</span>
              <span className="text-[#2196F3] font-mono font-bold text-sm">
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
              className="w-full accent-[#2196F3] cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] text-slate-400">
              <span>€30 (Controle)</span>
              <span>€150 (Behandeling)</span>
              <span>€500 (Project)</span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-gradient-to-br from-[#0D47A1] to-[#0A192F] border border-[#2196F3]/30 text-white rounded-xl p-6 sm:p-7 space-y-4 shadow-lg">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-200">
              Geschatte extra omzet
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#FF9100] pt-1">
              + € {extraMonthlyRevenue.toLocaleString("nl-NL")}
              <span className="text-xs text-blue-100 font-normal font-sans"> / maand</span>
            </div>
            <div className="text-xs text-slate-200 pt-1">
              Circa <strong className="text-white">€ {extraAnnualRevenue.toLocaleString("nl-NL")} per jaar</strong> aan additionele afspraken.
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-xs space-y-2 text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2196F3] shrink-0" />
              <span>Circa <strong>+{extraAppointments} extra afspraken</strong> per maand</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2196F3] shrink-0" />
              <span>Geen extra belasting voor receptie of balie</span>
            </div>
          </div>

          <Link
            href="/admin"
            className="w-full bg-[#2196F3] hover:bg-[#1E88E5] active:scale-95 text-white py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs mt-2"
          >
            <span>Genereer direct voor uw onderneming</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
