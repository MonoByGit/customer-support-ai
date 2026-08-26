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
  Code2,
  Layers,
  Zap,
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
      badge: "Dental",
    },
    {
      name: "Salon Elegance Amsterdam",
      url: "https://salon-elegance-amsterdam.nl",
      desc: "Knippen, balayage, styling & treatments",
      badge: "Salon",
    },
    {
      name: "Snelservice Loodgieter & Installatie",
      url: "https://snelservice-loodgieter.nl",
      desc: "24/7 lekkages, CV-ketels & leidingherstel",
      badge: "Trades",
    },
    {
      name: "Fysiotherapie & Revalidatie",
      url: "https://fysio-cura-amsterdam.nl",
      desc: "Intakes, rugtherapie & sportblessures",
      badge: "General",
    },
  ];

  const handleStartIngest = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;

    setStatus("scraping");
    setErrorMessage("");
    setResultProfile(null);

    try {
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
    <div className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col justify-between selection:bg-[#00D492] selection:text-black">
      {/* Top Header */}
      <header className="border-b border-white/[0.08] bg-[#0b1017]/80 backdrop-blur-xl px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D492] to-[#075E54] flex items-center justify-center shadow-lg shadow-emerald-950">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              Verde AI Engine
            </span>
            <span className="block text-[10px] text-emerald-400 font-mono">
              Onboarding & Web Ingest Wizard
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/demo/tandarts-demo"
            className="text-xs text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 font-medium"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Tandarts Demo</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 flex-1 space-y-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Instant Ingest & Demo Generator
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Genereer een WhatsApp AI Assistent
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Plak een bedrijfswebsite. Ons systeem schraapt direct de diensten, prijzen en openingstijden, en maakt binnen enkele seconden een klikbare WhatsApp demo gereed.
          </p>
        </div>

        {/* Generator Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleStartIngest(url);
            }}
            className="space-y-4"
          >
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Website URL van het bedrijf
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Globe className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://tandartspraktijk.nl of salon.nl"
                  disabled={status === "scraping" || status === "gemini" || status === "saving"}
                  className="w-full bg-[#111827] border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-500 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={!url.trim() || status === "scraping" || status === "gemini" || status === "saving"}
                className="bg-[#00D492] hover:bg-[#00be82] active:scale-95 disabled:opacity-50 text-slate-950 px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
              >
                {status === "scraping" || status === "gemini" || status === "saving" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Analyseren...</span>
                  </>
                ) : (
                  <>
                    <span>Genereer Demo</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Presets */}
          <div className="pt-5 border-t border-white/[0.06] space-y-3">
            <span className="text-xs text-slate-400 font-semibold block">
              Of kies direct een van deze voorbeeldbranches:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setUrl(preset.url);
                    handleStartIngest(preset.url);
                  }}
                  className="text-left bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-emerald-500/40 p-3.5 rounded-2xl transition-all group flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors">
                        {preset.name}
                      </span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded font-mono uppercase">
                        {preset.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{preset.desc}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all mt-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Live Progress Stepper */}
          {status !== "idle" && (
            <div className="pt-6 border-t border-white/[0.08] space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                Live Ingestie Voortgang
              </div>

              <div className="space-y-2 text-xs">
                <div
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-colors ${
                    status === "scraping"
                      ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                      : status === "gemini" || status === "saving" || status === "done"
                      ? "text-slate-400 bg-white/[0.02]"
                      : "text-slate-500"
                  }`}
                >
                  {status === "gemini" || status === "saving" || status === "done" ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00D492] shrink-0" />
                  ) : status === "scraping" ? (
                    <Loader2 className="w-4 h-4 text-[#00D492] animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                  )}
                  <span>1. Website HTML ophalen & boilerplates strippen met Cheerio</span>
                </div>

                <div
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-colors ${
                    status === "gemini"
                      ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                      : status === "saving" || status === "done"
                      ? "text-slate-400 bg-white/[0.02]"
                      : "text-slate-500"
                  }`}
                >
                  {status === "saving" || status === "done" ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00D492] shrink-0" />
                  ) : status === "gemini" ? (
                    <Loader2 className="w-4 h-4 text-[#00D492] animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                  )}
                  <span>2. Gemini Flash AI extractie van diensten, tarieven & openingstijden</span>
                </div>

                <div
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-colors ${
                    status === "saving"
                      ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                      : status === "done"
                      ? "text-slate-400 bg-white/[0.02]"
                      : "text-slate-500"
                  }`}
                >
                  {status === "done" ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00D492] shrink-0" />
                  ) : status === "saving" ? (
                    <Loader2 className="w-4 h-4 text-[#00D492] animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                  )}
                  <span>3. WhatsApp Agent & Google Calendar tools gereedzetten</span>
                </div>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {status === "done" && resultProfile && (
            <div className="bg-gradient-to-br from-emerald-950/70 to-teal-950/70 border border-emerald-500/40 rounded-2xl p-6 text-white animate-fade-in space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00D492] text-slate-950 flex items-center justify-center font-bold text-lg">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      WhatsApp Assistent Gereed voor {resultProfile.businessName}!
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
                  className="flex-1 bg-[#00D492] hover:bg-[#00be82] text-slate-950 py-3.5 px-5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-slate-950" />
                  <span>Open WhatsApp Demo ({resultProfile.slug})</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    const fullUrl = `${window.location.origin}/demo/${resultProfile.slug}`;
                    navigator.clipboard.writeText(fullUrl);
                    alert("Demo URL gekopieerd: " + fullUrl);
                  }}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 py-3.5 px-5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Kopieer Link</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === "error" && (
            <div className="bg-red-950/50 border border-red-500/50 rounded-xl p-4 text-red-200 text-xs">
              <span className="font-bold">Fout: </span>
              {errorMessage}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#06090e] py-6 px-6 text-center text-xs text-slate-500">
        Verde WhatsApp AI Appointment Booking Engine
      </footer>
    </div>
  );
}
