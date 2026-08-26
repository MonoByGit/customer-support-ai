"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Smartphone, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { QrCode } from "@/components/ui/QrCode";

const REFERENCE_SLUG = "tandartspraktijk-amsterdam";

/**
 * Haalt de drempel weg: de bezoeker test de flow op zijn eigen toestel,
 * in dezelfde app waar zijn klanten straks boeken.
 */
export const LiveQrSection: React.FC = () => {
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const target = `${origin}/live/${REFERENCE_SLUG}`;

  return (
    <section className="px-6 sm:px-10 py-20 max-w-6xl mx-auto">
      <div className="pro-card p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 bg-[#FF9100]/10 border border-[#FF9100]/25 text-[#B35F00] dark:text-[#FF9100] px-3.5 py-1.5 rounded-full text-xs font-semibold">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Test het op uw eigen telefoon</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
            Scan, chat, en zie de afspraak in de agenda verschijnen.
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
            Geen video, geen verkooppraatje. Richt uw camera op de code hiernaast en voer
            hetzelfde gesprek dat uw klanten straks voeren — inclusief tijdslotkeuze en
            bevestiging in de agenda.
          </p>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <Zap className="w-4 h-4 text-[#2196F3] shrink-0" />
              <span>Binnen 30 seconden een bevestigde afspraak</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#2196F3] shrink-0" />
              <span>Geen account, geen creditcard, geen installatie</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href={`/live/${REFERENCE_SLUG}`}
              className="inline-flex items-center gap-2 bg-[#2196F3] hover:bg-[#1E88E5] active:scale-95 text-white font-semibold px-5 py-3 rounded-lg text-sm shadow-xs transition-all"
            >
              <span>Open direct in deze browser</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-[#0D47A1] to-[#0A192F] rounded-2xl p-7 sm:p-9 flex flex-col items-center gap-4 shadow-xl border border-[#2196F3]/25">
            {origin ? (
              <QrCode value={target} size={190} color="#0A192F" />
            ) : (
              <div className="w-[206px] h-[206px] rounded-xl bg-white/10 animate-pulse" />
            )}
            <div className="text-center space-y-1">
              <div className="text-white font-bold text-sm tracking-tight">
                Scan met uw camera-app
              </div>
              <div className="text-blue-200 text-[11px]">
                Werkt op iPhone en Android, zonder app te installeren
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
