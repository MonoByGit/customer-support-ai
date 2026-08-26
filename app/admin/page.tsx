"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Globe,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Bot,
  ExternalLink,
  ShieldCheck,
  Building2,
  Search,
} from "lucide-react";
import { BusinessProfile } from "@/lib/schemas";

export default function AdminPage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "scraping" | "gemini" | "saving" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [resultProfile, setResultProfile] = useState<BusinessProfile | null>(null);

  const presets = [
    {
      name: "Tandartspraktijk Amsterdam",
      url: "https://tandartspraktijk-degroenegracht.nl",
      desc: "Mondzorg, controles & spoedconsulten",
    },
    {
      name: "Hair & Beauty Lounge",
      url: "https://salon-elegance-amsterdam.nl",
      desc: "Knippen, stylen, kleuren & behandelingen",
    },
    {
      name: "Loodgietersbedrijf & Installatietechniek",
      url: "https://snelservice-loodgieter.nl",
      desc: "Lekkages, cv-ketels & spoedreparaties",
    },
    {
      name: "Fysiotherapie & Revalidatie",
      url: "https://fysio-gezond-amsterdam.nl",
      desc: "Intakes, rugtherapie & sportblessures",
    },
  ];

  const handleStartIngest = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;

    setStatus("scraping");
    setErrorMessage("");
    setResultProfile(null);

    try {
      // Simulate stepper progress
      setTimeout(() => setStatus("gemini"), 800);

      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Fout bij het ophalen en analyseren van de website.");
      }

      setStatus("saving");
      setTimeout(() => {
        setResultProfile(data.profile);
        setStatus("done");
      }, 600);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Er is een onbekende fout opgetreden.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b141a] text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#111b21]/80 backdrop-blur-md px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00A884] to-[#075E54] flex items-center justify-center shadow-md">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                WhatsApp AI Engine
              </span>
              <span className="block text-[10px] text-gray-400 font-medium">
                Admin Onboarding & Generator
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/demo/tandarts-demo"
            className="text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Tandarts Demo</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 flex-1">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Instant Ingest & Demo Generator
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Genereer een WhatsApp AI Afspraken Assistent
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Plak een willekeurige bedrijfswebsite. Ons systeem schraapt de diensten, prijzen en openingstijden, en creëert binnen 3 seconden een werkende WhatsApp agenda-bot.
          </p>
        </div>

        {/* Generator Card */}
        <div className="bg-[#111b21] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleStartIngest(url);
            }}
            className="space-y-4"
          >
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Website URL van het bedrijf
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Globe className="w-5 h-5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://jouwbedrijf.nl of domein.com"
                  disabled={status === "scraping" || status === "gemini" || status === "saving"}
                  className="w-full bg-[#202c33] border border-gray-700/80 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-gray-500 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={!url.trim() || status === "scraping" || status === "gemini" || status === "saving"}
                className="bg-[#00A884] hover:bg-[#069677] active:scale-95 disabled:opacity-50 text-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all shrink-0"
              >
                {status === "scraping" || status === "gemini" || status === "saving" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyseren...</span>
                  </>
                ) : (
                  <>
                    <span>Genereer Demo Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Presets */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <span className="text-xs text-gray-400 font-medium block mb-2.5">
              Of probeer direct een van deze branches:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUrl(preset.url);
                    handleStartIngest(preset.url);
                  }}
                  className="text-left bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/40 p-3 rounded-xl transition-all group flex items-start justify-between"
                >
                  <div>
                    <div className="font-semibold text-xs text-gray-200 group-hover:text-emerald-400 transition-colors">
                      {preset.name}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{preset.desc}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all mt-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Live Progress Stepper */}
          {status !== "idle" && (
            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                Live Ingestie Voortgang
              </div>

              <div className="space-y-2 text-xs">
                <div
                  className={`flex items-center gap-2.5 p-2 rounded-lg ${
                    status === "scraping"
                      ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                      : status === "gemini" || status === "saving" || status === "done"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {status === "gemini" || status === "saving" || status === "done" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : status === "scraping" ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-600 shrink-0" />
                  )}
                  <span>1. Website HTML ophalen & boilerplates strippen met Cheerio</span>
                </div>

                <div
                  className={`flex items-center gap-2.5 p-2 rounded-lg ${
                    status === "gemini"
                      ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                      : status === "saving" || status === "done"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {status === "saving" || status === "done" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : status === "gemini" ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-600 shrink-0" />
                  )}
                  <span>2. Gemini Flash AI extractie van diensten, tarieven & openingstijden</span>
                </div>

                <div
                  className={`flex items-center gap-2.5 p-2 rounded-lg ${
                    status === "saving"
                      ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                      : status === "done"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {status === "done" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : status === "saving" ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-600 shrink-0" />
                  )}
                  <span>3. WhatsApp Agent & Google Calendar tools gereedzetten</span>
                </div>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {status === "done" && resultProfile && (
            <div className="mt-6 bg-gradient-to-br from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 rounded-xl p-5 text-white animate-fade-in space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      WhatsApp Assistent Klaar voor {resultProfile.businessName}!
                    </h3>
                    <p className="text-xs text-emerald-300">
                      {resultProfile.services.length} diensten gevonden • Direct interactief testbaar
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={`/demo/${resultProfile.slug}`}
                  className="flex-1 bg-[#00A884] hover:bg-[#069677] text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp Demo ({resultProfile.slug})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    const fullUrl = `${window.location.origin}/demo/${resultProfile.slug}`;
                    navigator.clipboard.writeText(fullUrl);
                    alert("Demo URL gekopieerd: " + fullUrl);
                  }}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Kopieer Link</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === "error" && (
            <div className="mt-6 bg-red-950/50 border border-red-500/50 rounded-xl p-4 text-red-200 text-xs">
              <span className="font-bold">Fout: </span>
              {errorMessage}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#111b21] py-4 px-6 text-center text-xs text-gray-500">
        WhatsApp AI Appointment Booking Engine • Geschikt voor Railway Deployment
      </footer>
    </div>
  );
}
