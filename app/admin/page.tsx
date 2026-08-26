"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Calendar,
  ExternalLink,
  RotateCcw,
  Clock,
  Plus,
  Users,
  Check,
  Eye,
  Layers,
  X,
  Send,
  Copy,
  Edit3,
  Flame,
  DollarSign,
  Cpu,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { BusinessProfile } from "@/lib/schemas";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface ClientSessionItem {
  profile: BusinessProfile;
  session: {
    slug: string;
    businessName: string;
    startTime: number | null;
    maxDurationMinutes: number;
    messageCount: number;
    maxMessages: number;
    isExpired: boolean;
    messages: Array<{
      id: string;
      sender: "user" | "agent" | "system";
      text: string;
      timestamp: string;
      isBookingCard?: boolean;
    }>;
  };
  remainingMinutes: number;
  hasStarted: boolean;
  messageCount: number;
  maxMessages: number;
  isExpired: boolean;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"sessions" | "generator">("sessions");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "scraping" | "gemini" | "saving" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [resultProfile, setResultProfile] = useState<BusinessProfile | null>(null);

  // Sessions state
  const [clientSessions, setClientSessions] = useState<ClientSessionItem[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(true);
  const [selectedTranscript, setSelectedTranscript] = useState<ClientSessionItem | null>(null);
  const [selectedOutreach, setSelectedOutreach] = useState<ClientSessionItem | null>(null);
  const [selectedProfileEdit, setSelectedProfileEdit] = useState<BusinessProfile | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>("");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const presets = [
    {
      name: "Tandartspraktijk Amsterdam",
      url: "https://tandartspraktijk-degroenegracht.nl",
      desc: "Mondzorg, controles & spoedconsulten",
    },
    {
      name: "Salon Elegance Amsterdam",
      url: "https://salon-elegance-amsterdam.nl",
      desc: "Knippen, balayage, styling & treatments",
    },
    {
      name: "Snelservice Loodgieter",
      url: "https://snelservice-loodgieter.nl",
      desc: "24/7 lekkages, CV-ketels & leidingherstel",
    },
  ];

  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const res = await fetch("/api/sessions");
      const data = await res.json();
      if (data.success && data.sessions) {
        setClientSessions(data.sessions);
      }
    } catch (e) {
      console.error("Error fetching sessions", e);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

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
        fetchSessions();
      }, 600);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Er is een onbekende fout opgetreden.");
    }
  };

  const handleExtend = async (slug: string) => {
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action: "extend", extraMinutes: 10, extraMessages: 10 }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMsg(`Sessie verlengd met +10 minuten en +10 berichten.`);
        setTimeout(() => setActionSuccessMsg(""), 3500);
        fetchSessions();
      }
    } catch (e) {
      console.error("Error extending session", e);
    }
  };

  const handleReset = async (slug: string) => {
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action: "reset" }),
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== "undefined") {
          localStorage.removeItem(`verde_session_${slug}`);
          localStorage.removeItem(`verde_chat_${slug}`);
        }
        setActionSuccessMsg(`Sessie gereset voor ${slug}.`);
        setTimeout(() => setActionSuccessMsg(""), 3500);
        fetchSessions();
      }
    } catch (e) {
      console.error("Error resetting session", e);
    }
  };

  const handleCopy = (text: string, label: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2500);
    }
  };

  const handleSaveProfileEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileEdit) return;

    try {
      const res = await fetch("/api/profiles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProfileEdit),
      });

      if (!res.ok) throw new Error("Fout bij opslaan");

      setActionSuccessMsg(`Profiel succesvol bijgewerkt.`);
      setTimeout(() => setActionSuccessMsg(""), 3500);
      setSelectedProfileEdit(null);
      fetchSessions();
    } catch (err: any) {
      alert("Fout bij opslaan: " + err.message);
    }
  };

  // Status indicator
  const getLeadStatus = (item: ClientSessionItem) => {
    const hasBooking = item.session.messages.some((m) => m.isBookingCard);
    if (hasBooking || item.messageCount >= 4) {
      return { label: "Hot Lead", dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400" };
    }
    if (item.hasStarted && item.messageCount > 0) {
      return { label: "In Gesprek", dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-400" };
    }
    return { label: "Gereed", dot: "bg-slate-400", text: "text-slate-500 dark:text-slate-400" };
  };

  const totalMessagesAllSessions = clientSessions.reduce((acc, s) => acc + s.messageCount, 0);
  const estimatedCost = (totalMessagesAllSessions * 0.0008).toFixed(3);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#07090E] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-[#2196F3] selection:text-white transition-colors">
      {/* Top Precision Bar */}
      <header className="border-b border-slate-200/80 dark:border-white/[0.07] bg-white/90 dark:bg-[#0C0F17]/90 backdrop-blur-xl px-6 sm:px-10 py-4 sticky top-0 z-30 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3.5 group">
          <BrandLogo className="w-8 h-8 shrink-0 drop-shadow-xs" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                Verde AI Studio
              </span>
              <span className="text-[10px] bg-[#2196F3]/10 text-[#2196F3] font-semibold px-2 py-0.5 rounded-md border border-[#2196F3]/20">
                DeepSeek Flash V4
              </span>
            </div>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">
              Sales, Lead Intelligence & Onboarding Portaal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/demo/tandarts-demo"
            className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200/80 dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/[0.08] px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5"
          >
            <span>Tandarts Demo</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </header>

      {/* Main Container - Spacious & Breathable */}
      <main className="max-w-7xl w-full mx-auto px-6 sm:px-10 py-10 flex-1 space-y-10">
        
        {/* KPI Intelligence Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="pro-card p-6 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Prospect Demo's
            </div>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {clientSessions.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Klaar voor acquisitie
            </div>
          </div>

          <div className="pro-card p-6 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Actieve Leads
            </div>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {clientSessions.filter((s) => s.messageCount >= 1).length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              In gesprek of geboekt
            </div>
          </div>

          <div className="pro-card p-6 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              AI Berichten
            </div>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {totalMessagesAllSessions}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Totaal verwerkt
            </div>
          </div>

          <div className="pro-card p-6 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Geschatte Kosten
            </div>
            <div className="text-3xl font-bold tracking-tight text-[#2196F3] font-mono">
              € {estimatedCost}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              DeepSeek Flash API
            </div>
          </div>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="flex justify-start border-b border-slate-200 dark:border-white/[0.08] pb-4">
          <div className="inline-flex gap-2">
            <button
              onClick={() => setActiveTab("sessions")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "sessions"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Prospect Demo's ({clientSessions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("generator")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "generator"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Nieuwe Klant Scrapen</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {actionSuccessMsg && (
          <div className="pro-card bg-[#2196F3]/5 border border-[#2196F3]/30 p-4 text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2196F3]" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg("")} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: PROSPECT DEMOS LIST (Spacious & Clean Layout)
            ========================================================================= */}
        {activeTab === "sessions" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Prospect Demo's & Acquisitie Beheer
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Overzicht van actieve klantproeven, 1-klik WhatsApp outreach teksten en handoff implementatiekits.
                </p>
              </div>

              <button
                onClick={fetchSessions}
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0F131C] hover:bg-slate-50 dark:hover:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Vernieuwen</span>
              </button>
            </div>

            {/* Cards Grid */}
            {isLoadingSessions ? (
              <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#2196F3]" />
                <span>Laden...</span>
              </div>
            ) : clientSessions.length === 0 ? (
              <div className="text-center py-16 pro-card p-8 space-y-3">
                <p className="text-xs text-slate-500">Nog geen klantdemo's aangemaakt.</p>
                <button
                  onClick={() => setActiveTab("generator")}
                  className="bg-[#2196F3] text-white font-semibold px-4 py-2 rounded-lg text-xs"
                >
                  Maak eerste demo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clientSessions.map((item, idx) => {
                  const leadStatus = getLeadStatus(item);

                  return (
                    <div
                      key={idx}
                      className="pro-card p-6 flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-4">
                        {/* Status bar */}
                        <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                          <div className="flex items-center gap-1.5 font-semibold">
                            <span className={`w-2 h-2 rounded-full ${leadStatus.dot}`} />
                            <span className={leadStatus.text}>{leadStatus.label}</span>
                          </div>

                          <span className="font-mono text-slate-500 text-[11px]">
                            {item.isExpired ? (
                              "Sessie voltooid"
                            ) : item.hasStarted ? (
                              `${item.remainingMinutes}m resterend`
                            ) : (
                              "10m beschikbaar"
                            )}
                          </span>
                        </div>

                        {/* Title & info */}
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                              {item.profile.businessName}
                            </h3>
                            <button
                              onClick={() => setSelectedProfileEdit(item.profile)}
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 transition-colors shrink-0"
                              title="Profiel bewerken"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                            {item.profile.tagline || item.profile.address || item.profile.businessName}
                          </p>
                        </div>

                        {/* Metrics bar */}
                        <div className="bg-slate-50 dark:bg-white/[0.03] p-3 rounded-lg border border-slate-100 dark:border-white/[0.04] grid grid-cols-2 gap-3 text-center text-xs">
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white font-mono">
                              {item.messageCount} / {item.maxMessages}
                            </div>
                            <div className="text-[10px] text-slate-400">Berichten</div>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white font-mono">
                              {item.profile.services.length}
                            </div>
                            <div className="text-[10px] text-slate-400">Diensten</div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                        {/* Row 1: Outreach & Portal */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedOutreach(item)}
                            className="bg-white dark:bg-[#121722] hover:bg-slate-50 dark:hover:bg-white/[0.04] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Send className="w-3 h-3 text-[#2196F3]" />
                            <span>Outreach Kit</span>
                          </button>

                          <Link
                            href={`/portal/${item.profile.slug}`}
                            className="bg-white dark:bg-[#121722] hover:bg-slate-50 dark:hover:bg-white/[0.04] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Layers className="w-3 h-3 text-[#2196F3]" />
                            <span>Klant Portaal</span>
                          </Link>
                        </div>

                        {/* Row 2: Timer controls */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleExtend(item.profile.slug)}
                            className="bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 text-xs font-medium py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1"
                            title="Voeg 10 minuten toe"
                          >
                            <Plus className="w-3 h-3" />
                            <span>+10 Min</span>
                          </button>

                          <button
                            onClick={() => handleReset(item.profile.slug)}
                            className="bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 text-xs font-medium py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1"
                            title="Reset sessie"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                          </button>
                        </div>

                        {/* Row 3: Open Demo CTA */}
                        <div className="flex gap-2 pt-1">
                          {item.session.messages && item.session.messages.length > 0 && (
                            <button
                              onClick={() => setSelectedTranscript(item)}
                              className="bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-2.5 rounded-lg transition-all flex items-center justify-center"
                              title="Bekijk transcript"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <Link
                            href={`/demo/${item.profile.slug}`}
                            className="flex-1 bg-[#2196F3] hover:bg-[#1E88E5] text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <span>Open Demo</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: FAST INGESTION WIZARD
            ========================================================================= */}
        {activeTab === "generator" && (
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto py-4">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Genereer een Nieuwe Demo
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Voer een website URL in. DeepSeek Flash leest de diensten en prijzen uit en maakt direct een afgeschermde demo gereed.
              </p>
            </div>

            <div className="pro-card p-8 space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStartIngest(url);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Website URL van het bedrijf
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://tandartspraktijk.nl of salon.nl"
                        disabled={status === "scraping" || status === "gemini" || status === "saving"}
                        className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-mono outline-none focus:border-[#2196F3] transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!url.trim() || status === "scraping" || status === "gemini" || status === "saving"}
                      className="bg-[#2196F3] hover:bg-[#1E88E5] text-white disabled:opacity-50 px-6 py-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0"
                    >
                      {status === "scraping" || status === "gemini" || status === "saving" ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Analyseren...</span>
                        </>
                      ) : (
                        <>
                          <span>Genereer Demo</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Presets */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-2">
                <span className="text-xs text-slate-500 font-semibold block">Snelle voorbeelden:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setUrl(preset.url);
                        handleStartIngest(preset.url);
                      }}
                      className="text-left bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.06] p-3.5 rounded-lg transition-all text-xs space-y-0.5"
                    >
                      <div className="font-semibold text-slate-900 dark:text-white truncate">{preset.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Success */}
              {status === "done" && resultProfile && (
                <div className="pro-card bg-[#2196F3]/5 border border-[#2196F3]/30 p-5 rounded-xl text-xs space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#2196F3]" />
                    <span>Demo gereed voor {resultProfile.businessName}!</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/demo/${resultProfile.slug}`}
                      className="bg-[#2196F3] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Open Klantdemo</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </Link>
                    <button
                      onClick={() => setActiveTab("sessions")}
                      className="bg-white dark:bg-[#0F131C] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 px-4 py-2 rounded-lg text-xs font-semibold"
                    >
                      Bekijk in Overzicht
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* =========================================================================
          MODAL 1: OUTREACH TOOLKIT
          ========================================================================= */}
      {selectedOutreach && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="pro-card rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Outreach: {selectedOutreach.profile.businessName}
                </h3>
                <span className="text-xs text-slate-500">
                  Gepersonaliseerde outreach tekst om met 1 klik te kopiëren.
                </span>
              </div>
              <button
                onClick={() => setSelectedOutreach(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    WhatsApp Bericht (Hoogste Respons)
                  </span>
                  <button
                    onClick={() => {
                      const text = `Goedendag! Ik zag dat veel potentiële klanten buiten kantoortijden op uw website (${selectedOutreach.profile.websiteUrl || selectedOutreach.profile.businessName}) kijken en afhaken op formulieren.\n\nIk heb alvast een interactief WhatsApp AI prototype klaargezet voor ${selectedOutreach.profile.businessName} met uw eigen behandelingen en Google Agenda koppeling. U kunt het hier vrijblijvend testen:\n\n${typeof window !== "undefined" ? window.location.origin : ""}/demo/${selectedOutreach.profile.slug}\n\nWat vindt u van dit concept voor uw praktijk?`;
                      handleCopy(text, "whatsapp");
                    }}
                    className="bg-[#2196F3]/10 hover:bg-[#2196F3]/20 text-[#2196F3] border border-[#2196F3]/30 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all"
                  >
                    {copiedText === "whatsapp" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === "whatsapp" ? "Gekopieerd!" : "Kopieer"}</span>
                  </button>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-lg border border-slate-200/80 dark:border-white/[0.08] font-mono text-[11px] leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  {`Goedendag! Ik zag dat veel potentiële klanten buiten kantoortijden op uw website (${selectedOutreach.profile.websiteUrl || selectedOutreach.profile.businessName}) kijken en afhaken op formulieren.\n\nIk heb alvast een interactief WhatsApp AI prototype klaargezet voor ${selectedOutreach.profile.businessName} met uw eigen behandelingen en Google Agenda koppeling. U kunt het hier vrijblijvend testen:\n\n${typeof window !== "undefined" ? window.location.origin : ""}/demo/${selectedOutreach.profile.slug}\n\nWat vindt u van dit concept voor uw praktijk?`}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.08] flex justify-end">
              <button
                onClick={() => setSelectedOutreach(null)}
                className="bg-slate-200 dark:bg-white/[0.08] text-slate-800 dark:text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: IN-DASHBOARD PROFILE EDITOR
          ========================================================================= */}
      {selectedProfileEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="pro-card rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Bewerk: {selectedProfileEdit.businessName}
                </h3>
                <span className="text-xs text-slate-500">
                  Pas gegevens en instructies aan voor DeepSeek Flash.
                </span>
              </div>
              <button
                onClick={() => setSelectedProfileEdit(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfileEdit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Bedrijfsnaam</label>
                <input
                  type="text"
                  value={selectedProfileEdit.businessName}
                  onChange={(e) =>
                    setSelectedProfileEdit({ ...selectedProfileEdit, businessName: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-lg p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Tagline</label>
                <input
                  type="text"
                  value={selectedProfileEdit.tagline || ""}
                  onChange={(e) =>
                    setSelectedProfileEdit({ ...selectedProfileEdit, tagline: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-lg p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Telefoon</label>
                  <input
                    type="text"
                    value={selectedProfileEdit.phone || ""}
                    onChange={(e) =>
                      setSelectedProfileEdit({ ...selectedProfileEdit, phone: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-lg p-2.5 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Openingstijden</label>
                  <input
                    type="text"
                    value={selectedProfileEdit.openingHours || ""}
                    onChange={(e) =>
                      setSelectedProfileEdit({ ...selectedProfileEdit, openingHours: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-lg p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Tone of Voice</label>
                <select
                  value={selectedProfileEdit.toneOfVoice}
                  onChange={(e) =>
                    setSelectedProfileEdit({ ...selectedProfileEdit, toneOfVoice: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-lg p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="Warm, empathisch, professioneel en behulpzaam">
                    Warm, empathisch & professioneel
                  </option>
                  <option value="Zakelijk, beleefd met U/Uw aanspreekvorm">
                    Formeel (U / Uw)
                  </option>
                  <option value="Vlotte, informele en vriendelijke sfeer (Je/Jij)">
                    Informeel (Je / Jij)
                  </option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setSelectedProfileEdit(null)}
                  className="bg-slate-100 dark:bg-white/[0.08] text-slate-800 dark:text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="bg-[#2196F3] hover:bg-[#1E88E5] text-white font-semibold px-5 py-2 rounded-lg shadow-xs"
                >
                  Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: CHAT TRANSCRIPT
          ========================================================================= */}
      {selectedTranscript && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="pro-card rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Transcript: {selectedTranscript.profile.businessName}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedTranscript.session.messages.length} berichten gewisseld
                </span>
              </div>
              <button
                onClick={() => setSelectedTranscript(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EFEAE2] whatsapp-bg text-xs">
              {selectedTranscript.session.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl text-xs ${
                      m.sender === "user"
                        ? "bg-[#DCF8C6] text-[#111B21] rounded-tr-xs"
                        : "bg-white text-slate-900 rounded-tl-xs shadow-2xs"
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                    <div className="text-[9.5px] text-slate-400 text-right mt-1">
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.08] flex justify-end">
              <button
                onClick={() => setSelectedTranscript(null)}
                className="bg-slate-200 dark:bg-white/[0.08] text-slate-800 dark:text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0C0F17] py-6 px-6 sm:px-10 text-center text-xs text-slate-500">
        Verde AI Studio • DeepSeek Flash V4 Architecture
      </footer>
    </div>
  );
}
