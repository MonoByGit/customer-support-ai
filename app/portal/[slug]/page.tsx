"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Code,
  Globe,
  Smartphone,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  Printer,
  Sparkles,
  QrCode,
  Lock,
} from "lucide-react";
import { BusinessProfile } from "@/lib/schemas";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function ClientPortalPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<"wordpress" | "wix" | "webflow" | "custom">("wordpress");

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/profiles?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setProfile(data.profile);
        }
      })
      .catch((e) => console.error("Error fetching profile", e))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const handleCopy = (text: string, section: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090D11] flex items-center justify-center text-xs text-slate-500 font-mono">
        Klantportaal laden...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090D11] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Implementatieportaal Niet Gevonden</h2>
        <p className="text-xs text-slate-500 max-w-md">
          Er is geen geregistreerd bedrijfsprofiel gevonden voor '{slug}'. Neem contact op met uw accountmanager.
        </p>
        <Link href="/" className="bg-[#00D492] text-slate-950 px-4 py-2 rounded-xl text-xs font-bold">
          Terug naar Home
        </Link>
      </div>
    );
  }

  const appHost = typeof window !== "undefined" ? window.location.origin : "https://verde-ai.up.railway.app";
  const widgetScriptCode = `<script src="${appHost}/widget.js" data-slug="${profile.slug}"></script>`;
  const waDirectUrl = `https://wa.me/31612345678?text=${encodeURIComponent(`Goedendag, ik wil graag een afspraak maken bij ${profile.businessName}.`)}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D11] text-slate-900 dark:text-[#F1F5F9] flex flex-col justify-between selection:bg-[#00D492] selection:text-black transition-colors">
      {/* Top Header */}
      <header className="border-b border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#090D11]/80 backdrop-blur-xl px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D492] to-[#075E54] flex items-center justify-center shadow-sm">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                {profile.businessName}
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                Professional Pakket • Actief
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Verde WhatsApp AI Implementatie & Onboarding Portaal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href={`/demo/${profile.slug}`}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
            <span>Open WhatsApp Demo</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 space-y-8">
        
        {/* Welcome Banner */}
        <div className="premium-card rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-emerald-500/[0.04] to-transparent border border-emerald-500/20">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Welkom bij Verde AI
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Klant Implementatie & Handoff Pakket
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Uw WhatsApp AI boekingsengine voor <strong>{profile.businessName}</strong> is geconfigureerd met al uw behandelingen, prijzen en richtlijnen. Volg de onderstaande 3 stappen om live te gaan.
            </p>
          </div>
        </div>

        {/* 3 Step Implementation Grid */}
        <div className="space-y-6">
          
          {/* STEP 1: WEBSITE WIDGET EMBED */}
          <div className="premium-card rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-xs">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Plaats de Zwevende WhatsApp Widget op uw Website
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kopieer onderstaande code en plak deze direct voor de sluitende <code>&lt;/body&gt;</code> tag van uw website.
                  </p>
                </div>
              </div>

              {/* Platform Switcher */}
              <div className="hidden sm:flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
                {(["wordpress", "wix", "webflow", "custom"] as const).map((plat) => (
                  <button
                    key={plat}
                    onClick={() => setActivePlatform(plat)}
                    className={`px-3 py-1 rounded-lg capitalize font-semibold transition-all ${
                      activePlatform === plat
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Box */}
            <div className="relative">
              <div className="p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 flex items-center justify-between">
                <code>{widgetScriptCode}</code>
                <button
                  onClick={() => handleCopy(widgetScriptCode, "widget")}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shrink-0 ml-4"
                >
                  {copiedSection === "widget" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === "widget" ? "Gekopieerd!" : "Kopieer Snippet"}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/[0.06] text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Hoe te installeren op {activePlatform.toUpperCase()}:</span>
              </div>
              <p>
                {activePlatform === "wordpress" && "Ga in WordPress naar Weergave → Thema-editor → footer.php (of gebruik de plugin 'Insert Headers and Footers') en plak de snippet."}
                {activePlatform === "wix" && "Ga in uw Wix Dashboard naar Instellingen → Aangepaste code (Custom Code) → Voeg code toe aan Hoofdtekst - Einde (Body - End)."}
                {activePlatform === "webflow" && "Ga in Webflow naar Project Settings → Custom Code → Footer Code en plak de snippet."}
                {activePlatform === "custom" && "Plak het script direct voor de sluitende </body> tag in uw HTML."}
              </p>
            </div>
          </div>

          {/* STEP 2: GOOGLE CALENDAR SYNC */}
          <div className="premium-card rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                2
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Koppel uw Google Agenda (Voorkomt Dubbele Boekingen)
                </h3>
                <p className="text-xs text-slate-500">
                  Verde AI controleert realtime uw beschikbaarheid en plaatst afspraken direct in uw agenda.
                </p>
              </div>
            </div>

            <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4 space-y-3 text-xs">
              <div className="font-semibold text-blue-900 dark:text-blue-300">
                Stappenplan voor Google Agenda:
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700 dark:text-slate-300">
                <li>Open <strong>calendar.google.com</strong> en klik op de drie puntjes naast uw praktijkagenda.</li>
                <li>Kies <em>'Instellingen en delen'</em> → <em>'Delen met specifieke personen'</em>.</li>
                <li>
                  Voeg het Verde AI serviceaccount toe:
                  <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded font-mono text-[11px] ml-1 mt-1 text-slate-900 dark:text-white">
                    <span>verde-bot@verde-ai-engine.iam.gserviceaccount.com</span>
                    <button
                      onClick={() => handleCopy("verde-bot@verde-ai-engine.iam.gserviceaccount.com", "service-email")}
                      className="text-blue-600 hover:underline text-[10px]"
                    >
                      {copiedSection === "service-email" ? "✓" : "Kopieer"}
                    </button>
                  </div>
                </li>
                <li>Geef de rechten: <strong>'Wijzigingen aanbrengen in afspraken'</strong>.</li>
              </ol>
            </div>
          </div>

          {/* STEP 3: BALIE & WACHTRUIMTE QR-CODE */}
          <div className="premium-card rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                3
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Balie & Wachtruimte QR-Code (“Scan & Boek direct via WhatsApp”)
                </h3>
                <p className="text-xs text-slate-500">
                  Print deze QR-code voor op de balie of stuur de directe link naar patiënten/klanten.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] space-y-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                  Directe WhatsApp Boekingslink
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={waDirectUrl}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2 font-mono text-[11px]"
                  />
                  <button
                    onClick={() => handleCopy(waDirectUrl, "wa-url")}
                    className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 px-3 py-2 rounded-xl font-bold"
                  >
                    {copiedSection === "wa-url" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Balie Display Poster</span>
                  <span className="text-[11px] text-slate-500">Printklare A5/A4 balie-instructie</span>
                </div>
                <button
                  onClick={() => alert(`Printklaar bestand voor ${profile.businessName} wordt gegenereerd!`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Balie Poster</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#090D11] py-6 px-6 text-center text-xs text-slate-500">
        Verde WhatsApp AI Implementatie Portaal • Geautoriseerde Handoff Kit voor {profile.businessName}
      </footer>
    </div>
  );
}
