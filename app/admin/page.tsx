"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Calendar,
  MessageSquare,
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

      setActionSuccessMsg(`Profiel bijgewerkt.`);
      setTimeout(() => setActionSuccessMsg(""), 3500);
      setSelectedProfileEdit(null);
      fetchSessions();
    } catch (err: any) {
      alert("Fout bij opslaan: " + err.message);
    }
  };

  // Subtle Apple-style status indicator
  const getLeadStatus = (item: ClientSessionItem) => {
    const hasBooking = item.session.messages.some((m) => m.isBookingCard);
    if (hasBooking || item.messageCount >= 4) {
      return { label: "Hot Lead", dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400" };
    }
    if (item.hasStarted && item.messageCount > 0) {
      return { label: "In Gesprek", dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-400" };
    }
    return { label: "Gereed", dot: "bg-slate-400 dark:bg-slate-500", text: "text-slate-500 dark:text-slate-400" };
  };

  const totalMessagesAllSessions = clientSessions.reduce((acc, s) => acc + s.messageCount, 0);
  const estimatedCost = (totalMessagesAllSessions * 0.0008).toFixed(3);

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col justify-between selection:bg-[#0071E3] selection:text-white transition-colors">
      {/* Apple Top Navigation Bar */}
      <header className="border-b border-black/[0.06] dark:border-white/[0.08] bg-white/80 dark:bg-[#161618]/80 backdrop-blur-2xl px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#1D1D1F] dark:bg-white text-white dark:text-black flex items-center justify-center font-medium shadow-xs">
            <MessageSquare className="w-4 h-4 fill-current" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-[#1D1D1F] dark:text-white">
              Verde AI Studio
            </span>
            <span className="block text-[11px] text-[#86868B] dark:text-[#86868B]">
              Sales & Lead Intelligence
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/demo/tandarts-demo"
            className="text-xs font-medium text-[#1D1D1F] dark:text-white bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5"
          >
            <span>Tandarts Demo</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#86868B]" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 space-y-8">
        
        {/* Apple Clean Stat Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="apple-card p-5 rounded-2xl space-y-1">
            <div className="text-[11px] font-medium text-[#86868B] uppercase tracking-wider">Prospects</div>
            <div className="text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">
              {clientSessions.length}
            </div>
            <div className="text-[11px] text-[#86868B]">Gegenereerde demo's</div>
          </div>

          <div className="apple-card p-5 rounded-2xl space-y-1">
            <div className="text-[11px] font-medium text-[#86868B] uppercase tracking-wider">Actieve Leads</div>
            <div className="text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">
              {clientSessions.filter((s) => s.messageCount >= 1).length}
            </div>
            <div className="text-[11px] text-[#86868B]">In gesprek of geboekt</div>
          </div>

          <div className="apple-card p-5 rounded-2xl space-y-1">
            <div className="text-[11px] font-medium text-[#86868B] uppercase tracking-wider">AI Berichten</div>
            <div className="text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">
              {totalMessagesAllSessions}
            </div>
            <div className="text-[11px] text-[#86868B]">Totaal verwerkt</div>
          </div>

          <div className="apple-card p-5 rounded-2xl space-y-1">
            <div className="text-[11px] font-medium text-[#86868B] uppercase tracking-wider">Geschatte Kosten</div>
            <div className="text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white font-mono">
              € {estimatedCost}
            </div>
            <div className="text-[11px] text-[#86868B]">DeepSeek & Gemini API</div>
          </div>
        </div>

        {/* Apple Segmented Control */}
        <div className="flex justify-center">
          <div className="inline-flex bg-black/[0.05] dark:bg-white/[0.08] p-1 rounded-full border border-black/[0.04] dark:border-white/[0.04]">
            <button
              onClick={() => setActiveTab("sessions")}
              className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "sessions"
                  ? "bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-white shadow-xs"
                  : "text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white"
              }`}
            >
              Klantdemo's ({clientSessions.length})
            </button>

            <button
              onClick={() => setActiveTab("generator")}
              className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "generator"
                  ? "bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-white shadow-xs"
                  : "text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white"
              }`}
            >
              Nieuwe Demo Aanmaken
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {actionSuccessMsg && (
          <div className="apple-card bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 text-xs font-medium text-emerald-900 dark:text-emerald-200 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg("")} className="text-[#86868B] hover:text-black dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: CLIENT SESSIONS LIST
            ========================================================================= */}
        {activeTab === "sessions" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">
                  Prospects & Demo Beheer
                </h2>
                <p className="text-xs text-[#86868B]">
                  Overzicht van actieve klantproeven, direct te delen outreach links en handoff pakketten.
                </p>
              </div>

              <button
                onClick={fetchSessions}
                className="text-xs font-medium text-[#1D1D1F] dark:text-white bg-white dark:bg-[#161618] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#86868B]" />
                <span>Vernieuwen</span>
              </button>
            </div>

            {/* Grid */}
            {isLoadingSessions ? (
              <div className="py-12 text-center text-xs text-[#86868B] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#1D1D1F] dark:text-white" />
                <span>Laden...</span>
              </div>
            ) : clientSessions.length === 0 ? (
              <div className="text-center py-12 apple-card rounded-2xl p-8 space-y-3">
                <p className="text-xs text-[#86868B]">Nog geen demo's aangemaakt.</p>
                <button
                  onClick={() => setActiveTab("generator")}
                  className="bg-[#1D1D1F] dark:bg-white text-white dark:text-black font-medium px-4 py-2 rounded-xl text-xs"
                >
                  Maak eerste demo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {clientSessions.map((item, idx) => {
                  const leadStatus = getLeadStatus(item);

                  return (
                    <div
                      key={idx}
                      className="apple-card rounded-2xl p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Top indicators */}
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className={`w-2 h-2 rounded-full ${leadStatus.dot}`} />
                            <span className={leadStatus.text}>{leadStatus.label}</span>
                          </div>

                          <span className="font-mono text-[#86868B]">
                            {item.isExpired ? (
                              "Sessie voltooid"
                            ) : item.hasStarted ? (
                              `${item.remainingMinutes}m resterend`
                            ) : (
                              "10m beschikbaar"
                            )}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm text-[#1D1D1F] dark:text-white tracking-tight">
                              {item.profile.businessName}
                            </h3>
                            <button
                              onClick={() => setSelectedProfileEdit(item.profile)}
                              className="text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white p-1 transition-colors"
                              title="Profiel bewerken"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-[#86868B] line-clamp-1 mt-0.5">
                            {item.profile.tagline || item.profile.address || item.profile.businessName}
                          </p>
                        </div>

                        {/* Subtle metrics bar */}
                        <div className="bg-black/[0.03] dark:bg-white/[0.04] p-2.5 rounded-xl grid grid-cols-2 gap-2 text-center text-xs">
                          <div>
                            <div className="font-semibold text-[#1D1D1F] dark:text-white">
                              {item.messageCount} / {item.maxMessages}
                            </div>
                            <div className="text-[10px] text-[#86868B]">Berichten</div>
                          </div>
                          <div>
                            <div className="font-semibold text-[#1D1D1F] dark:text-white">
                              {item.profile.services.length}
                            </div>
                            <div className="text-[10px] text-[#86868B]">Diensten</div>
                          </div>
                        </div>
                      </div>

                      {/* Clean unified action buttons */}
                      <div className="space-y-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
                        {/* Secondary Button Row: Outreach & Portal */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedOutreach(item)}
                            className="bg-white dark:bg-[#1C1C1E] hover:bg-black/[0.03] dark:hover:bg-white/[0.06] text-[#1D1D1F] dark:text-white border border-black/[0.08] dark:border-white/[0.1] text-xs font-medium py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                          >
                            <Send className="w-3 h-3 text-[#86868B]" />
                            <span>Outreach Kit</span>
                          </button>

                          <Link
                            href={`/portal/${item.profile.slug}`}
                            className="bg-white dark:bg-[#1C1C1E] hover:bg-black/[0.03] dark:hover:bg-white/[0.06] text-[#1D1D1F] dark:text-white border border-black/[0.08] dark:border-white/[0.1] text-xs font-medium py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                          >
                            <Layers className="w-3 h-3 text-[#86868B]" />
                            <span>Klant Portaal</span>
                          </Link>
                        </div>

                        {/* Secondary Controls: Timer adjustments */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleExtend(item.profile.slug)}
                            className="bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] text-[#1D1D1F] dark:text-white text-xs font-medium py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1"
                            title="Voeg 10 minuten toe"
                          >
                            <Plus className="w-3 h-3 text-[#86868B]" />
                            <span>+10 Min</span>
                          </button>

                          <button
                            onClick={() => handleReset(item.profile.slug)}
                            className="bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] text-[#1D1D1F] dark:text-white text-xs font-medium py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1"
                            title="Reset sessie"
                          >
                            <RotateCcw className="w-3 h-3 text-[#86868B]" />
                            <span>Reset</span>
                          </button>
                        </div>

                        {/* Primary Action Button: Open Demo */}
                        <div className="flex gap-2 pt-1">
                          {item.session.messages && item.session.messages.length > 0 && (
                            <button
                              onClick={() => setSelectedTranscript(item)}
                              className="bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] text-[#1D1D1F] dark:text-white text-xs font-medium px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-1"
                              title="Bekijk transcript"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#86868B]" />
                            </button>
                          )}

                          <Link
                            href={`/demo/${item.profile.slug}`}
                            className="flex-1 bg-[#1D1D1F] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 text-xs font-medium py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <span>Open Demo</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
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
          <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">
                Genereer een Nieuwe Demo
              </h2>
              <p className="text-[#86868B] text-xs">
                Voer een website URL in om binnen enkele seconden een gepersonaliseerde WhatsApp AI demo te bouwen.
              </p>
            </div>

            <div className="apple-card rounded-2xl p-6 sm:p-8 space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStartIngest(url);
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#1D1D1F] dark:text-white">
                    Website URL
                  </label>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="flex-1 relative">
                      <Globe className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://tandartspraktijk.nl"
                        disabled={status === "scraping" || status === "gemini" || status === "saving"}
                        className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-[#1D1D1F] dark:text-white placeholder:text-[#86868B] text-xs outline-none focus:border-black dark:focus:border-white transition-all font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!url.trim() || status === "scraping" || status === "gemini" || status === "saving"}
                      className="bg-[#1D1D1F] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 disabled:opacity-50 px-5 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0"
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
              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2">
                <span className="text-[11px] text-[#86868B] font-medium block">Snelle voorbeelden:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setUrl(preset.url);
                        handleStartIngest(preset.url);
                      }}
                      className="text-left bg-black/[0.02] hover:bg-black/[0.05] dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.06] p-3 rounded-xl transition-all text-xs"
                    >
                      <div className="font-medium text-[#1D1D1F] dark:text-white truncate">{preset.name}</div>
                      <div className="text-[10px] text-[#86868B] truncate">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Success */}
              {status === "done" && resultProfile && (
                <div className="apple-card bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 font-medium text-emerald-900 dark:text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Demo gereed voor {resultProfile.businessName}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/demo/${resultProfile.slug}`}
                      className="bg-[#1D1D1F] text-white dark:bg-white dark:text-black px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Open Demo</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </Link>
                    <button
                      onClick={() => setActiveTab("sessions")}
                      className="bg-white dark:bg-[#161618] text-[#1D1D1F] dark:text-white border border-black/[0.08] dark:border-white/[0.1] px-4 py-2 rounded-xl text-xs font-medium"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="apple-card rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-[#1D1D1F] dark:text-white">
                  Outreach: {selectedOutreach.profile.businessName}
                </h3>
                <span className="text-xs text-[#86868B]">
                  Gepersonaliseerde outreach tekst om met 1 klik te versturen.
                </span>
              </div>
              <button
                onClick={() => setSelectedOutreach(null)}
                className="p-1.5 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.1] text-[#86868B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#1D1D1F] dark:text-white">
                    WhatsApp Bericht
                  </span>
                  <button
                    onClick={() => {
                      const text = `Goedendag! Ik zag dat veel potentiële klanten buiten kantoortijden op uw website (${selectedOutreach.profile.websiteUrl || selectedOutreach.profile.businessName}) kijken en afhaken op formulieren.\n\nIk heb alvast een interactief WhatsApp AI prototype klaargezet voor ${selectedOutreach.profile.businessName} met uw eigen behandelingen en Google Agenda koppeling. U kunt het hier vrijblijvend testen:\n\n${typeof window !== "undefined" ? window.location.origin : ""}/demo/${selectedOutreach.profile.slug}\n\nWat vindt u van dit concept voor uw praktijk?`;
                      handleCopy(text, "whatsapp");
                    }}
                    className="bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] text-[#1D1D1F] dark:text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-all"
                  >
                    {copiedText === "whatsapp" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === "whatsapp" ? "Gekopieerd!" : "Kopieer"}</span>
                  </button>
                </div>
                <div className="p-3.5 bg-black/[0.02] dark:bg-white/[0.03] rounded-xl border border-black/[0.06] dark:border-white/[0.08] font-mono text-[11px] leading-relaxed text-[#1D1D1F] dark:text-[#F5F5F7] whitespace-pre-wrap">
                  {`Goedendag! Ik zag dat veel potentiële klanten buiten kantoortijden op uw website (${selectedOutreach.profile.websiteUrl || selectedOutreach.profile.businessName}) kijken en afhaken op formulieren.\n\nIk heb alvast een interactief WhatsApp AI prototype klaargezet voor ${selectedOutreach.profile.businessName} met uw eigen behandelingen en Google Agenda koppeling. U kunt het hier vrijblijvend testen:\n\n${typeof window !== "undefined" ? window.location.origin : ""}/demo/${selectedOutreach.profile.slug}\n\nWat vindt u van dit concept voor uw praktijk?`}
                </div>
              </div>
            </div>

            <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/[0.08] flex justify-end">
              <button
                onClick={() => setSelectedOutreach(null)}
                className="bg-black/[0.05] dark:bg-white/[0.08] text-[#1D1D1F] dark:text-white text-xs font-medium px-4 py-2 rounded-xl"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="apple-card rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-[#1D1D1F] dark:text-white">
                  Bewerk: {selectedProfileEdit.businessName}
                </h3>
                <span className="text-xs text-[#86868B]">
                  Pas gegevens en instructies aan voor de AI.
                </span>
              </div>
              <button
                onClick={() => setSelectedProfileEdit(null)}
                className="p-1.5 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.1] text-[#86868B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfileEdit} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-[#1D1D1F] dark:text-white">Bedrijfsnaam</label>
                <input
                  type="text"
                  value={selectedProfileEdit.businessName}
                  onChange={(e) =>
                    setSelectedProfileEdit({ ...selectedProfileEdit, businessName: e.target.value })
                  }
                  className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-xl p-2.5 text-[#1D1D1F] dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#1D1D1F] dark:text-white">Tagline</label>
                <input
                  type="text"
                  value={selectedProfileEdit.tagline || ""}
                  onChange={(e) =>
                    setSelectedProfileEdit({ ...selectedProfileEdit, tagline: e.target.value })
                  }
                  className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-xl p-2.5 text-[#1D1D1F] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-[#1D1D1F] dark:text-white">Telefoon</label>
                  <input
                    type="text"
                    value={selectedProfileEdit.phone || ""}
                    onChange={(e) =>
                      setSelectedProfileEdit({ ...selectedProfileEdit, phone: e.target.value })
                    }
                    className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-xl p-2.5 text-[#1D1D1F] dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#1D1D1F] dark:text-white">Openingstijden</label>
                  <input
                    type="text"
                    value={selectedProfileEdit.openingHours || ""}
                    onChange={(e) =>
                      setSelectedProfileEdit({ ...selectedProfileEdit, openingHours: e.target.value })
                    }
                    className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-xl p-2.5 text-[#1D1D1F] dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#1D1D1F] dark:text-white">Tone of Voice</label>
                <select
                  value={selectedProfileEdit.toneOfVoice}
                  onChange={(e) =>
                    setSelectedProfileEdit({ ...selectedProfileEdit, toneOfVoice: e.target.value })
                  }
                  className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.1] rounded-xl p-2.5 text-[#1D1D1F] dark:text-white"
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

              <div className="pt-4 flex justify-end gap-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setSelectedProfileEdit(null)}
                  className="bg-black/[0.04] dark:bg-white/[0.08] text-[#1D1D1F] dark:text-white px-4 py-2 rounded-xl font-medium"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="bg-[#1D1D1F] hover:bg-black text-white dark:bg-white dark:text-black font-medium px-5 py-2 rounded-xl shadow-xs"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="apple-card rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-[#1D1D1F] dark:text-white">
                  Transcript: {selectedTranscript.profile.businessName}
                </h3>
                <span className="text-[11px] text-[#86868B]">
                  {selectedTranscript.session.messages.length} berichten
                </span>
              </div>
              <button
                onClick={() => setSelectedTranscript(null)}
                className="p-1.5 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.1] text-[#86868B]"
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

            <div className="p-3 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/[0.08] flex justify-end">
              <button
                onClick={() => setSelectedTranscript(null)}
                className="bg-black/[0.05] dark:bg-white/[0.08] text-[#1D1D1F] dark:text-white text-xs font-medium px-4 py-2 rounded-xl"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] py-5 px-6 text-center text-xs text-[#86868B]">
        Verde AI Studio • Apple Human Interface Guidelines Design
      </footer>
    </div>
  );
}
