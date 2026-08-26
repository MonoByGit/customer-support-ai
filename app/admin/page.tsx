"use client";

import React, { useState, useEffect } from "react";
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
  RotateCcw,
  Clock,
  Plus,
  Users,
  Check,
  Eye,
  Shield,
  Layers,
  X,
  Send,
  Copy,
  Edit3,
  Flame,
  QrCode,
  DollarSign,
  Cpu,
  Mail,
} from "lucide-react";
import { BusinessProfile } from "@/lib/schemas";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

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
  const [activeTab, setActiveTab] = useState<"generator" | "sessions">("sessions");
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
        setActionSuccessMsg(`Sessie voor ${slug} verlengd met +10 minuten en +10 berichten!`);
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
        setActionSuccessMsg(`Sessie voor ${slug} is gereset! Klant kan opnieuw 10 minuten testen.`);
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

      setActionSuccessMsg(`Bedrijfsprofiel voor ${selectedProfileEdit.businessName} bijgewerkt!`);
      setTimeout(() => setActionSuccessMsg(""), 3500);
      setSelectedProfileEdit(null);
      fetchSessions();
    } catch (err: any) {
      alert("Fout bij opslaan: " + err.message);
    }
  };

  // Lead Heat Score calculation
  const getLeadStatus = (item: ClientSessionItem) => {
    const hasBooking = item.session.messages.some((m) => m.isBookingCard);
    if (hasBooking || item.messageCount >= 4) {
      return { label: "🔥 Hot Lead (Afspraak geboekt)", color: "bg-red-500/10 text-red-600 border-red-500/20" };
    }
    if (item.hasStarted && item.messageCount > 0) {
      return { label: "🟡 Warm (In gesprek)", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    }
    return { label: "❄️ Nog Niet Geopend", color: "bg-slate-100 dark:bg-white/10 text-slate-500 border-slate-200" };
  };

  const totalMessagesAllSessions = clientSessions.reduce((acc, s) => acc + s.messageCount, 0);
  const estimatedCost = (totalMessagesAllSessions * 0.0008).toFixed(3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D11] text-slate-900 dark:text-[#F1F5F9] flex flex-col justify-between selection:bg-[#00D492] selection:text-black transition-colors">
      {/* Top Header */}
      <header className="border-b border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#090D11]/80 backdrop-blur-xl px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D492] to-[#075E54] flex items-center justify-center shadow-sm">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
              Verde AI Sales & Beheerdersportaal
            </span>
            <span className="block text-[10.5px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
              DeepSeek & Gemini Engine • Lead Intelligence
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/demo/tandarts-demo"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            <span>Open Tandarts Demo</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 space-y-8">
        
        {/* Top Intelligence Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="premium-card p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                {clientSessions.length}
              </div>
              <div className="text-[11px] text-slate-400">Prospect Demos</div>
            </div>
          </div>

          <div className="premium-card p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                {clientSessions.filter((s) => s.messageCount >= 3).length}
              </div>
              <div className="text-[11px] text-slate-400">Hot & Warme Leads</div>
            </div>
          </div>

          <div className="premium-card p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                {totalMessagesAllSessions}
              </div>
              <div className="text-[11px] text-slate-400">AI Berichten Totaal</div>
            </div>
          </div>

          <div className="premium-card p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#00D492] flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#00D492] font-mono">
                € {estimatedCost}
              </div>
              <div className="text-[11px] text-slate-400">Geschatte API Kosten</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-xs">
            <button
              onClick={() => setActiveTab("sessions")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "sessions"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Users className="w-4 h-4 text-emerald-500" />
              <span>Klant Demos & Lead Intelligence ({clientSessions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("generator")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "generator"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>Nieuwe Klant Scrapen & Aanmaken</span>
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {actionSuccessMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-500/40 rounded-2xl p-4 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between animate-fade-in shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D492]" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg("")} className="text-emerald-500 hover:text-emerald-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: CLIENT SESSIONS & SALES MANAGEMENT DASHBOARD
            ========================================================================= */}
        {activeTab === "sessions" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Prospect Demos & Acquisitie Beheer
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Bekijk live koopsignalen, verleng timers en kopieer 1-klik gepersonaliseerde WhatsApp outreach berichten.
                </p>
              </div>

              <button
                onClick={fetchSessions}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Vernieuwen</span>
              </button>
            </div>

            {/* Grid */}
            {isLoadingSessions ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                <span>Prospects laden...</span>
              </div>
            ) : clientSessions.length === 0 ? (
              <div className="text-center py-12 premium-card rounded-3xl p-8 space-y-3">
                <p className="text-sm text-slate-500">Nog geen klantprofielen aangemaakt.</p>
                <button
                  onClick={() => setActiveTab("generator")}
                  className="bg-[#00D492] text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
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
                      className="premium-card rounded-3xl p-6 flex flex-col justify-between space-y-5 hover:border-slate-300 dark:hover:border-white/20 transition-all"
                    >
                      <div className="space-y-3">
                        {/* Top indicators */}
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${leadStatus.color}`}>
                            {leadStatus.label}
                          </span>

                          {item.isExpired ? (
                            <span className="text-[10.5px] bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">
                              Verlopen
                            </span>
                          ) : item.hasStarted ? (
                            <span className="text-[10.5px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              {item.remainingMinutes}m
                            </span>
                          ) : (
                            <span className="text-[10.5px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded-full font-semibold">
                              Klaar
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">
                              {item.profile.businessName}
                            </h3>
                            <button
                              onClick={() => setSelectedProfileEdit(item.profile)}
                              className="text-slate-400 hover:text-emerald-500 p-1"
                              title="Bewerk diensten & richtlijnen"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                            {item.profile.tagline || item.profile.address || item.profile.businessName}
                          </p>
                        </div>

                        {/* Metrics bar */}
                        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-white/[0.06] grid grid-cols-2 gap-2 text-center text-xs">
                          <div>
                            <div className="font-mono font-bold text-slate-900 dark:text-white">
                              {item.messageCount} / {item.maxMessages}
                            </div>
                            <div className="text-[10px] text-slate-400">Berichten</div>
                          </div>
                          <div>
                            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {item.profile.services.length}
                            </div>
                            <div className="text-[10px] text-slate-400">Diensten</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                        {/* Outreach Toolkit Button */}
                        <button
                          onClick={() => setSelectedOutreach(item)}
                          className="w-full bg-[#18A0FB]/10 hover:bg-[#18A0FB]/20 text-[#18A0FB] border border-[#18A0FB]/30 text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>1-Klik Outreach Toolkit</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleExtend(item.profile.slug)}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 dark:border-white/[0.08] transition-all flex items-center justify-center gap-1"
                            title="Voeg 10 minuten en 10 berichten toe"
                          >
                            <Plus className="w-3 h-3 text-emerald-500" />
                            <span>+10 Min</span>
                          </button>

                          <button
                            onClick={() => handleReset(item.profile.slug)}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 dark:border-white/[0.08] transition-all flex items-center justify-center gap-1"
                            title="Reset de timer en berichten"
                          >
                            <RotateCcw className="w-3 h-3 text-slate-500" />
                            <span>Reset</span>
                          </button>
                        </div>

                        <div className="flex gap-2">
                          {item.session.messages && item.session.messages.length > 0 && (
                            <button
                              onClick={() => setSelectedTranscript(item)}
                              className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-1 border border-slate-200 dark:border-white/[0.08]"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              <span>Transcript ({item.session.messages.length})</span>
                            </button>
                          )}

                          <Link
                            href={`/demo/${item.profile.slug}`}
                            className="flex-1 bg-[#00D492] hover:bg-[#00be82] active:scale-95 text-slate-950 text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs"
                          >
                            <span>Open Demo</span>
                            <ExternalLink className="w-3.5 h-3.5" />
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
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Website Naar WhatsApp Demo
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Genereer een Nieuwe Klantdemo
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Plak een website URL. Onze scraper leest de diensten en tarieven uit en maakt automatisch een afgeschermde 10-minuten demo gereed.
              </p>
            </div>

            <div className="premium-card rounded-3xl p-6 sm:p-8 space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStartIngest(url);
                }}
                className="space-y-4"
              >
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Website URL van het bedrijf
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://tandartspraktijk.nl of salon.nl"
                      disabled={status === "scraping" || status === "gemini" || status === "saving"}
                      className="w-full bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!url.trim() || status === "scraping" || status === "gemini" || status === "saving"}
                    className="bg-[#00D492] hover:bg-[#00be82] active:scale-95 disabled:opacity-50 text-slate-950 px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
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

              {/* Presets */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-2">
                <span className="text-xs text-slate-500 font-semibold block">Voorbeeldbranches:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setUrl(preset.url);
                        handleStartIngest(preset.url);
                      }}
                      className="text-left bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.06] p-3 rounded-xl transition-all text-xs"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">{preset.name}</div>
                      <div className="text-[10px] text-slate-400">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Success */}
              {status === "done" && resultProfile && (
                <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-500/40 rounded-2xl p-5 text-emerald-950 dark:text-white animate-fade-in space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Demo gereed voor {resultProfile.businessName}!</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/demo/${resultProfile.slug}`}
                      className="bg-[#00D492] text-slate-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <span>Open Klantdemo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setActiveTab("sessions")}
                      className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold"
                    >
                      Bekijk in Sessiebeheer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* =========================================================================
          MODAL 1: 1-CLICK OUTREACH TOOLKIT (WhatsApp, LinkedIn, Email)
          ========================================================================= */}
      {selectedOutreach && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F141C] border border-slate-200 dark:border-white/[0.08] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-500" />
                  <span>Outreach Toolkit voor {selectedOutreach.profile.businessName}</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Gepersonaliseerde berichten om met 1 klik te kopiëren en te versturen.
                </span>
              </div>
              <button
                onClick={() => setSelectedOutreach(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Option A: WhatsApp Cold Outreach */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    WhatsApp Bericht (Hoogste Open Rate ~98%)
                  </span>
                  <button
                    onClick={() => {
                      const text = `Goedendag! Ik zag dat veel potentiële klanten buiten kantoortijden op uw website (${selectedOutreach.profile.websiteUrl || selectedOutreach.profile.businessName}) kijken en afhaken op formulieren.\n\nIk heb alvast een interactief WhatsApp AI prototype klaargezet voor ${selectedOutreach.profile.businessName} met uw eigen behandelingen en Google Agenda koppeling. U kunt het hier 10 minuten vrijblijvend testen:\n\n${typeof window !== "undefined" ? window.location.origin : ""}/demo/${selectedOutreach.profile.slug}\n\nWat vindt u van dit concept voor uw praktijk?`;
                      handleCopy(text, "whatsapp");
                    }}
                    className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all"
                  >
                    {copiedText === "whatsapp" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === "whatsapp" ? "Gekopieerd!" : "Kopieer WhatsApp Tekst"}</span>
                  </button>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {`Goedendag! Ik zag dat veel potentiële klanten buiten kantoortijden op uw website (${selectedOutreach.profile.websiteUrl || selectedOutreach.profile.businessName}) kijken en afhaken op formulieren.\n\nIk heb alvast een interactief WhatsApp AI prototype klaargezet voor ${selectedOutreach.profile.businessName} met uw eigen behandelingen en Google Agenda koppeling. U kunt het hier 10 minuten vrijblijvend testen:\n\n${typeof window !== "undefined" ? window.location.origin : ""}/demo/${selectedOutreach.profile.slug}\n\nWat vindt u van dit concept voor uw praktijk?`}
                </div>
              </div>

              {/* Option B: Direct Demo Link */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                    Directe Demo Link
                  </span>
                  <button
                    onClick={() => {
                      const link = `${typeof window !== "undefined" ? window.location.origin : ""}/demo/${selectedOutreach.profile.slug}`;
                      handleCopy(link, "link");
                    }}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1"
                  >
                    {copiedText === "link" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === "link" ? "Gekopieerd!" : "Kopieer Link"}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/demo/${selectedOutreach.profile.slug}`}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 font-mono text-[11px] text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-white/[0.08] flex justify-end">
              <button
                onClick={() => setSelectedOutreach(null)}
                className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: IN-DASHBOARD PROFILE & TONE OF VOICE EDITOR
          ========================================================================= */}
      {selectedProfileEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F141C] border border-slate-200 dark:border-white/[0.08] rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-500" />
                  <span>Bewerk Bedrijfsprofiel: {selectedProfileEdit.businessName}</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Pas diensten, prijzen of openingstijden direct aan voor de AI.
                </span>
              </div>
              <button
                onClick={() => setSelectedProfileEdit(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfileEdit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Bedrijfsnaam</label>
                <input
                  type="text"
                  value={selectedProfileEdit.businessName}
                  onChange={(e) =>
                    setSelectedProfileEdit({ ...selectedProfileEdit, businessName: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Tagline / Omschrijving</label>
                <input
                  type="text"
                  value={selectedProfileEdit.tagline || ""}
                  onChange={(e) =>
                    setSelectedProfileEdit({ ...selectedProfileEdit, tagline: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Telefoonnummer</label>
                  <input
                    type="text"
                    value={selectedProfileEdit.phone || ""}
                    onChange={(e) =>
                      setSelectedProfileEdit({ ...selectedProfileEdit, phone: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Openingstijden</label>
                  <input
                    type="text"
                    value={selectedProfileEdit.openingHours || ""}
                    onChange={(e) =>
                      setSelectedProfileEdit({ ...selectedProfileEdit, openingHours: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Tone of Voice Instructie</label>
                <select
                  value={selectedProfileEdit.toneOfVoice}
                  onChange={(e) =>
                    setSelectedProfileEdit({ ...selectedProfileEdit, toneOfVoice: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="Warm, empathisch, professioneel en behulpzaam">
                    Warm, empathisch & professioneel (Aanbevolen)
                  </option>
                  <option value="Zakelijk, beleefd met U/Uw aanspreekvorm">
                    Formeel (U / Uw vorm)
                  </option>
                  <option value="Vlotte, informele en vriendelijke sfeer (Je/Jij)">
                    Informeel & Vriendelijk (Je / Jij vorm)
                  </option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedProfileEdit(null)}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-xl font-semibold"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="bg-[#00D492] hover:bg-[#00be82] text-slate-950 font-bold px-5 py-2 rounded-xl shadow-xs"
                >
                  Wijzigingen Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: CHAT TRANSCRIPT VIEWER
          ========================================================================= */}
      {selectedTranscript && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F141C] border border-slate-200 dark:border-white/[0.08] rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Chat Transcript: {selectedTranscript.profile.businessName}
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  {selectedTranscript.session.messages.length} berichten gewisseld
                </span>
              </div>
              <button
                onClick={() => setSelectedTranscript(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500"
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
                    className={`max-w-[85%] p-3 rounded-2xl text-xs ${
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

            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-white/[0.08] flex justify-end">
              <button
                onClick={() => setSelectedTranscript(null)}
                className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#090D11] py-6 px-6 text-center text-xs text-slate-500">
        Verde WhatsApp AI Appointment Booking Engine • Sales & Beheerdersportaal
      </footer>
    </div>
  );
}
