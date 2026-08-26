"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { BusinessProfile } from "@/lib/schemas";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { QrCode } from "@/components/ui/QrCode";

/**
 * Printklare A5/A4 balieposter. Alles buiten `.print-sheet` valt weg bij printen,
 * zodat het vel er op papier uitziet zoals het op het scherm staat.
 */
export default function PosterPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/profiles?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => d.success && setProfile(d.profile))
      .catch((e) => console.error("Kon profiel niet ophalen", e))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-slate-500 font-mono">
        Poster voorbereiden…
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Geen bedrijfsprofiel gevonden voor &lsquo;{slug}&rsquo;.
        </p>
        <Link href="/" className="text-[#2196F3] text-xs font-semibold hover:underline">
          Terug naar Verde AI
        </Link>
      </div>
    );
  }

  const cleanPhone = (profile.phone || "+31612345678").replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Goedendag, ik wil graag een afspraak maken bij ${profile.businessName}.`
  )}`;

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#07090E] py-8 px-4 sm:px-6">
      {/* Bedieningsbalk — verdwijnt bij printen */}
      <div className="no-print max-w-[210mm] mx-auto mb-6 flex items-center justify-between gap-4">
        <Link
          href={`/portal/${profile.slug}`}
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Terug naar het portaal</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="bg-[#2196F3] hover:bg-[#1E88E5] active:scale-95 text-white font-semibold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-xs transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Printen of opslaan als PDF</span>
        </button>
      </div>

      {/* Het vel zelf */}
      <div className="print-sheet max-w-[210mm] mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-br from-[#0D47A1] to-[#0A192F] text-white px-10 py-8 flex items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200">
              {profile.businessName}
            </div>
            <div className="text-3xl font-bold tracking-tight leading-tight">
              Plan uw volgende afspraak
              <br />
              direct via WhatsApp
            </div>
          </div>
          <BrandLogo className="w-14 h-14 shrink-0" />
        </div>

        <div className="px-10 py-10 flex flex-col items-center gap-7 text-center">
          <QrCode value={waUrl} size={260} color="#0A192F" />

          <div className="space-y-2 max-w-md">
            <div className="text-2xl font-bold text-[#0A192F] tracking-tight">
              Scan met uw camera
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Richt de camera van uw telefoon op de code hierboven. WhatsApp opent vanzelf en onze
              assistent helpt u binnen een halve minuut aan een bevestigde afspraak — ook &rsquo;s
              avonds en in het weekend.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full pt-2 border-t border-slate-200">
            {[
              { n: "1", t: "Scan de code" },
              { n: "2", t: "Kies uw tijdstip" },
              { n: "3", t: "Klaar, u krijgt bevestiging" },
            ].map((s) => (
              <div key={s.n} className="space-y-1.5 pt-5">
                <div className="w-8 h-8 rounded-full bg-[#2196F3] text-white font-bold text-sm flex items-center justify-center mx-auto">
                  {s.n}
                </div>
                <div className="text-xs font-semibold text-slate-700 leading-snug">{s.t}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-10 py-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>
            {profile.address || profile.businessName}
            {profile.phone ? ` · ${profile.phone}` : ""}
          </span>
          <span className="font-semibold">Mogelijk gemaakt door Verde AI</span>
        </div>
      </div>

      <p className="no-print max-w-[210mm] mx-auto mt-5 text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
        Tip: kies in het printvenster papierformaat A4 of A5 en zet achtergrondafbeeldingen aan,
        zodat de blauwe kop meegeprint wordt.
      </p>
    </div>
  );
}
