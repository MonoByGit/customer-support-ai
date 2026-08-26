"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Globe,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
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
  Mail,
  MessageSquare,
  Radio,
  AlertTriangle,
  ChevronRight,
  Activity,
} from "lucide-react";
import { BusinessProfile } from "@/lib/schemas";
import {
  ClientSessionItem,
  LeadStage,
  getLeadStage,
  detectBuyingSignals,
  buildOutreachTemplates,
} from "@/lib/leads";
import { BrandLogo } from "@/components/ui/BrandLogo";

type IntegrationState = "live" | "sandbox" | "niet-gekoppeld";

interface Integration {
  id: string;
  name: string;
  state: IntegrationState;
  detail: string;
  action?: string;
}

interface LeadAlert {
  id: string;
  slug: string;
  businessName: string;
  text: string;
  tone: "hot" | "converted" | "activity";
  at: number;
}

const POLL_INTERVAL_MS = 15000;

const STAGE_FILTERS: Array<{ id: LeadStage | "alle"; label: string }> = [
  { id: "alle", label: "Alle" },
  { id: "geconverteerd", label: "Geconverteerd" },
  { id: "hot", label: "Hot leads" },
  { id: "gesprek", label: "In gesprek" },
  { id: "gereed", label: "Gereed" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "scan">("pipeline");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "scraping" | "analysing" | "saving" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [resultProfile, setResultProfile] = useState<BusinessProfile | null>(null);

  const [clientSessions, setClientSessions] = useState<ClientSessionItem[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(true);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [stageFilter, setStageFilter] = useState<LeadStage | "alle">("alle");
  const [alerts, setAlerts] = useState<LeadAlert[]>([]);
  const [lastSync, setLastSync] = useState<number | null>(null);

  const [selectedTranscript, setSelectedTranscript] = useState<ClientSessionItem | null>(null);
  const [selectedOutreach, setSelectedOutreach] = useState<ClientSessionItem | null>(null);
  const [selectedProfileEdit, setSelectedProfileEdit] = useState<BusinessProfile | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>("");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  /** messageCount per slug bij de vorige poll — basis voor realtime signalering. */
  const previousCounts = useRef<Map<string, number> | null>(null);

  const presets = [
    { name: "Tandartspraktijk Amsterdam", url: "https://tandartspraktijk-degroenegracht.nl", desc: "Mondzorg, controles & spoedconsulten" },
    { name: "Salon Elegance Amsterdam", url: "https://salon-elegance-amsterdam.nl", desc: "Knippen, balayage, styling & treatments" },
    { name: "Snelservice Loodgieter", url: "https://snelservice-loodgieter.nl", desc: "24/7 lekkages, CV-ketels & leidingherstel" },
  ];

  const pushAlerts = useCallback((incoming: ClientSessionItem[]) => {
    const counts = new Map(incoming.map((i) => [i.profile.slug, i.messageCount]));

    // Eerste ronde vult alleen de referentie: geen meldingen over historie.
    if (previousCounts.current === null) {
      previousCounts.current = counts;
      return;
    }

    const fresh: LeadAlert[] = [];
    for (const item of incoming) {
      const before = previousCounts.current.get(item.profile.slug) ?? 0;
      if (item.messageCount <= before) continue;

      const stage = getLeadStage(item);
      const signals = detectBuyingSignals(item);

      fresh.push({
        id: `${item.profile.slug}-${item.messageCount}`,
        slug: item.profile.slug,
        businessName: item.profile.businessName,
        tone:
          stage.stage === "geconverteerd" ? "converted" : stage.stage === "hot" ? "hot" : "activity",
        text:
          stage.stage === "geconverteerd"
            ? "heeft zojuist een afspraak bevestigd"
            : signals.length
            ? `stelde een koopvraag (${signals.slice(0, 2).join(", ")})`
            : `stuurde ${item.messageCount - before} nieuw bericht${item.messageCount - before === 1 ? "" : "en"}`,
        at: Date.now(),
      });
    }

    previousCounts.current = counts;
    if (fresh.length) setAlerts((prev) => [...fresh, ...prev].slice(0, 6));
  }, []);

  const fetchSessions = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoadingSessions(true);
      try {
        const res = await fetch("/api/sessions", { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.sessions) {
          setClientSessions(data.sessions);
          pushAlerts(data.sessions);
          setLastSync(Date.now());
        }
      } catch (e) {
        console.error("Kon sessies niet ophalen", e);
      } finally {
        if (!silent) setIsLoadingSessions(false);
      }
    },
    [pushAlerts]
  );

  useEffect(() => {
    fetchSessions();

    fetch("/api/status", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => d.success && setIntegrations(d.integrations))
      .catch((e) => console.error("Kon koppelstatus niet ophalen", e));
  }, [fetchSessions]);

  // Realtime bijwerken zonder de pagina te laten flikkeren.
  useEffect(() => {
    const id = setInterval(() => fetchSessions(true), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchSessions]);

  // Diepe links vanaf de landingspagina: ?url=... start de scan meteen.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefill = new URLSearchParams(window.location.search).get("url");
    if (prefill) {
      setUrl(prefill);
      setActiveTab("scan");
    }
  }, []);

  const handleStartIngest = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;

    setStatus("scraping");
    setErrorMessage("");
    setResultProfile(null);

    const analysing = setTimeout(() => setStatus("analysing"), 800);

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "De website kon niet worden geanalyseerd.");

      clearTimeout(analysing);
      setStatus("saving");
      setResultProfile(data.profile);
      setStatus("done");
      fetchSessions(true);
    } catch (err: any) {
      clearTimeout(analysing);
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Er is een onbekende fout opgetreden.");
    }
  };

  const isBusy = status === "scraping" || status === "analysing" || status === "saving";

  const handleExtend = async (slug: string) => {
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action: "extend", extraMinutes: 10, extraMessages: 10 }),
      });
      const data = await res.json();
      if (data.success) {
        flash("Sessie verlengd met 10 minuten en 10 berichten.");
        fetchSessions(true);
      }
    } catch (e) {
      console.error("Verlengen mislukt", e);
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
        previousCounts.current?.set(slug, 0);
        flash(`Sessie opnieuw gestart voor ${slug}.`);
        fetchSessions(true);
      }
    } catch (e) {
      console.error("Resetten mislukt", e);
    }
  };

  const flash = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(""), 3500);
  };

  const handleCopy = (text: string, label: string) => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
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
      if (!res.ok) throw new Error("Opslaan mislukt");

      flash("Profiel bijgewerkt.");
      setSelectedProfileEdit(null);
      fetchSessions(true);
    } catch (err: any) {
      setErrorMessage(`Opslaan mislukt: ${err.message}`);
    }
  };

  const stats = useMemo(() => {
    let converted = 0;
    let hot = 0;
    let talking = 0;
    for (const item of clientSessions) {
      const s = getLeadStage(item).stage;
      if (s === "geconverteerd") converted++;
      else if (s === "hot") hot++;
      else if (s === "gesprek") talking++;
    }
    const messages = clientSessions.reduce((acc, s) => acc + s.messageCount, 0);
    const engaged = converted + hot + talking;
    return {
      converted,
      hot,
      talking,
      messages,
      total: clientSessions.length,
      conversionRate: engaged > 0 ? Math.round((converted / engaged) * 100) : 0,
      estimatedCost: (messages * 0.0008).toFixed(3),
    };
  }, [clientSessions]);

  const sortedSessions = useMemo(() => {
    return [...clientSessions]
      .filter((item) => stageFilter === "alle" || getLeadStage(item).stage === stageFilter)
      .sort((a, b) => {
        const diff = getLeadStage(a).priority - getLeadStage(b).priority;
        if (diff !== 0) return diff;
        return (b.session.lastActive || 0) - (a.session.lastActive || 0);
      });
  }, [clientSessions, stageFilter]);

  const blockingIntegrations = integrations.filter((i) => i.state !== "live");

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#07090E] text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200/80 dark:border-white/[0.07] bg-white/90 dark:bg-[#0C0F17]/90 backdrop-blur-xl px-6 sm:px-10 py-4 sticky top-0 z-30 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3.5 shrink-0">
          <BrandLogo className="w-8 h-8 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                Verde AI Command
              </span>
              <span className="text-[10px] bg-[#2196F3]/10 text-[#2196F3] font-semibold px-2 py-0.5 rounded-md border border-[#2196F3]/20">
                DeepSeek Flash V4
              </span>
            </div>
            <span className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
              Sales, lead-intelligentie &amp; klantonboarding
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-[#2196F3] opacity-70 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-[#2196F3]" />
            </span>
            <span>
              Live · {lastSync ? new Date(lastSync).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }) : "verbinden"}
            </span>
          </div>

          <Link
            href="/live/tandartspraktijk-amsterdam"
            className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200/80 dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/[0.08] px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5"
          >
            <span className="hidden sm:inline">Referentievoorbeeld</span>
            <span className="sm:hidden">Voorbeeld</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto px-6 sm:px-10 py-8 sm:py-10 flex-1 space-y-8">
        {/* Realtime signalen */}
        {alerts.length > 0 && (
          <div className="space-y-2 animate-fade-in">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`pro-card px-4 py-3 flex items-center justify-between gap-4 text-xs ${
                  alert.tone === "converted"
                    ? "border-[#2196F3]/40"
                    : alert.tone === "hot"
                    ? "border-[#FF9100]/40"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {alert.tone === "converted" ? (
                    <CheckCircle2 className="w-4 h-4 text-[#2196F3] shrink-0" />
                  ) : alert.tone === "hot" ? (
                    <Flame className="w-4 h-4 text-[#FF9100] shrink-0" />
                  ) : (
                    <Radio className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className="truncate">
                    <strong className="text-slate-900 dark:text-white">{alert.businessName}</strong>{" "}
                    <span className="text-slate-600 dark:text-slate-400">{alert.text}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      const item = clientSessions.find((s) => s.profile.slug === alert.slug);
                      if (item) setSelectedOutreach(item);
                    }}
                    className="bg-[#2196F3] hover:bg-[#1E88E5] text-white font-semibold px-3 py-1.5 rounded-lg transition-all"
                  >
                    Volg nu op
                  </button>
                  <button
                    onClick={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
                    aria-label="Melding sluiten"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* KPI's */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          <Kpi label="Prospects" value={stats.total} sub="In portefeuille" />
          <Kpi label="Hot leads" value={stats.hot} sub="Koopsignaal afgegeven" accent="#FF9100" />
          <Kpi label="In gesprek" value={stats.talking} sub="Actief aan het testen" />
          <Kpi label="Geconverteerd" value={stats.converted} sub={`${stats.conversionRate}% van de actieven`} accent="#2196F3" />
          <Kpi label="AI-verbruik" value={`€ ${stats.estimatedCost}`} sub={`${stats.messages} berichten`} mono />
        </div>

        {/* Koppelingen */}
        <section className="pro-card p-6 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#2196F3]" />
                Actieve koppelingen
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Wat er nu daadwerkelijk live staat — en wat er nog nodig is om volledig operationeel te zijn.
              </p>
            </div>
            {blockingIntegrations.length > 0 && (
              <span className="text-[11px] font-semibold bg-[#FF9100]/10 text-[#B35F00] dark:text-[#FF9100] border border-[#FF9100]/30 px-2.5 py-1 rounded-md">
                {blockingIntegrations.length} van {integrations.length} nog niet live
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {integrations.length === 0 ? (
              <div className="col-span-full text-xs text-slate-400 py-2">Koppelstatus laden…</div>
            ) : (
              integrations.map((int) => (
                <div
                  key={int.id}
                  className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">{int.name}</span>
                    <StateChip state={int.state} />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{int.detail}</p>
                  {int.action && (
                    <p className="text-[11px] text-[#B35F00] dark:text-[#FF9100] leading-relaxed flex items-start gap-1.5 pt-1 border-t border-slate-200/70 dark:border-white/[0.06]">
                      <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>{int.action}</span>
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Tabs */}
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
          <div className="inline-flex gap-2">
            <TabButton active={activeTab === "pipeline"} onClick={() => setActiveTab("pipeline")} icon={Users}>
              Pipeline ({clientSessions.length})
            </TabButton>
            <TabButton active={activeTab === "scan"} onClick={() => setActiveTab("scan")} icon={Plus}>
              Nieuwe AI Bedrijfsscan
            </TabButton>
          </div>

          <button
            onClick={() => fetchSessions()}
            className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0F131C] hover:bg-slate-50 dark:hover:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Vernieuwen</span>
          </button>
        </div>

        {actionSuccessMsg && (
          <div className="pro-card bg-[#2196F3]/5 border-[#2196F3]/30 p-4 text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2196F3]" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg("")} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* PIPELINE */}
        {activeTab === "pipeline" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Acquisitiepipeline
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Gesorteerd op urgentie: geconverteerd en hot leads eerst, daarna wie nog stil is.
                </p>
              </div>

              <div className="inline-flex flex-wrap gap-1 bg-slate-100 dark:bg-white/[0.04] p-1 rounded-lg border border-slate-200/80 dark:border-white/[0.08]">
                {STAGE_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStageFilter(f.id)}
                    className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                      stageFilter === f.id
                        ? "bg-white dark:bg-[#0F131C] text-slate-900 dark:text-white shadow-2xs"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoadingSessions ? (
              <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#2196F3]" />
                <span>Pipeline laden…</span>
              </div>
            ) : sortedSessions.length === 0 ? (
              <div className="text-center py-16 pro-card p-8 space-y-3">
                <p className="text-xs text-slate-500">
                  {stageFilter === "alle"
                    ? "Nog geen prospects in de pipeline."
                    : "Geen prospects in deze fase."}
                </p>
                {stageFilter === "alle" ? (
                  <button
                    onClick={() => setActiveTab("scan")}
                    className="bg-[#2196F3] hover:bg-[#1E88E5] text-white font-semibold px-4 py-2 rounded-lg text-xs shadow-xs transition-all"
                  >
                    Start de eerste bedrijfsscan
                  </button>
                ) : (
                  <button
                    onClick={() => setStageFilter("alle")}
                    className="text-[#2196F3] font-semibold text-xs hover:underline"
                  >
                    Toon alle prospects
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedSessions.map((item) => {
                  const stage = getLeadStage(item);
                  const signals = detectBuyingSignals(item);

                  return (
                    <div key={item.profile.slug} className="pro-card p-6 flex flex-col justify-between gap-5">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2 text-xs pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                          <span className={`inline-flex items-center gap-1.5 font-semibold border px-2 py-1 rounded-md ${stage.chip}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stage.dot}`} />
                            {stage.label}
                          </span>
                          <span className="font-mono text-slate-500 text-[11px]">
                            {item.isExpired
                              ? "Sessie voltooid"
                              : item.hasStarted
                              ? `${item.remainingMinutes}m resterend`
                              : "Nog niet geopend"}
                          </span>
                        </div>

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
                            {stage.reason}
                          </p>
                        </div>

                        {signals.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {signals.map((s) => (
                              <span
                                key={s}
                                className="text-[10px] font-semibold bg-[#FF9100]/10 text-[#B35F00] dark:text-[#FF9100] border border-[#FF9100]/25 px-2 py-0.5 rounded-md"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

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

                      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                        <button
                          onClick={() => setSelectedOutreach(item)}
                          className="w-full bg-[#2196F3] hover:bg-[#1E88E5] text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Outreach kit openen</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={`/live/${item.profile.slug}`}
                            className="bg-white dark:bg-[#121722] hover:bg-slate-50 dark:hover:bg-white/[0.04] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <ExternalLink className="w-3 h-3 text-[#2196F3]" />
                            <span>Simulator</span>
                          </Link>

                          <Link
                            href={`/portal/${item.profile.slug}`}
                            className="bg-white dark:bg-[#121722] hover:bg-slate-50 dark:hover:bg-white/[0.04] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Layers className="w-3 h-3 text-[#2196F3]" />
                            <span>Portaal</span>
                          </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleExtend(item.profile.slug)}
                            className="bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 text-[11px] font-medium py-1.5 rounded-lg transition-all flex items-center justify-center gap-1"
                            title="Tien minuten en tien berichten toevoegen"
                          >
                            <Plus className="w-3 h-3" />
                            <span>10 min</span>
                          </button>

                          <button
                            onClick={() => handleReset(item.profile.slug)}
                            className="bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 text-[11px] font-medium py-1.5 rounded-lg transition-all flex items-center justify-center gap-1"
                            title="Sessie opnieuw starten"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                          </button>

                          <button
                            onClick={() => setSelectedTranscript(item)}
                            disabled={item.session.messages.length === 0}
                            className="bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 text-[11px] font-medium py-1.5 rounded-lg transition-all flex items-center justify-center gap-1"
                            title="Gesprek bekijken"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Gesprek</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SCAN */}
        {activeTab === "scan" && (
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto py-2">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Directe AI Bedrijfsscan
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                Voer een website-URL in. DeepSeek Flash leest diensten, tarieven, openingstijden en
                tone of voice uit en zet binnen tien seconden een werkende assistent klaar.
              </p>
            </div>

            <div className="pro-card p-6 sm:p-8 space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStartIngest(url);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="scan-url" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Website van het bedrijf
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="scan-url"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://tandartspraktijk.nl"
                        disabled={isBusy}
                        className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-mono outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/20 transition-all disabled:opacity-60"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!url.trim() || isBusy}
                      className="bg-[#2196F3] hover:bg-[#1E88E5] text-white disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0"
                    >
                      {isBusy ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>
                            {status === "scraping" ? "Website uitlezen…" : status === "analysing" ? "AI analyseert…" : "Opslaan…"}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>Start bedrijfsscan</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-2">
                <span className="text-xs text-slate-500 font-semibold block">Voorbeeldbedrijven:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isBusy}
                      onClick={() => {
                        setUrl(preset.url);
                        handleStartIngest(preset.url);
                      }}
                      className="text-left bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.06] p-3.5 rounded-lg transition-all text-xs space-y-0.5 disabled:opacity-50"
                    >
                      <div className="font-semibold text-slate-900 dark:text-white truncate">{preset.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {status === "error" && (
                <div className="bg-[#FF9100]/5 border border-[#FF9100]/30 rounded-xl p-4 text-xs space-y-1 animate-fade-in">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <AlertTriangle className="w-4 h-4 text-[#FF9100]" />
                    <span>Scan mislukt</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{errorMessage}</p>
                </div>
              )}

              {status === "done" && resultProfile && (
                <div className="bg-[#2196F3]/5 border border-[#2196F3]/30 rounded-xl p-5 text-xs space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#2196F3]" />
                    <span>
                      Assistent gereed voor {resultProfile.businessName} — {resultProfile.services.length} diensten herkend
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/live/${resultProfile.slug}`}
                      className="bg-[#2196F3] hover:bg-[#1E88E5] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                    >
                      <span>Open de simulator</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </Link>
                    <button
                      onClick={() => {
                        setActiveTab("pipeline");
                        setStageFilter("alle");
                      }}
                      className="bg-white dark:bg-[#0F131C] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 px-4 py-2 rounded-lg text-xs font-semibold"
                    >
                      Naar de pipeline
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {selectedOutreach && (
        <OutreachModal
          item={selectedOutreach}
          onClose={() => setSelectedOutreach(null)}
          onCopy={handleCopy}
          copiedText={copiedText}
        />
      )}

      {selectedProfileEdit && (
        <Modal title={`Bewerk: ${selectedProfileEdit.businessName}`} subtitle="Pas gegevens en instructies aan voor DeepSeek Flash." onClose={() => setSelectedProfileEdit(null)}>
          <form onSubmit={handleSaveProfileEdit} className="p-6 overflow-y-auto space-y-4 text-xs">
            <Field label="Bedrijfsnaam">
              <input
                type="text"
                value={selectedProfileEdit.businessName}
                onChange={(e) => setSelectedProfileEdit({ ...selectedProfileEdit, businessName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-[#2196F3]"
              />
            </Field>

            <Field label="Tagline">
              <input
                type="text"
                value={selectedProfileEdit.tagline || ""}
                onChange={(e) => setSelectedProfileEdit({ ...selectedProfileEdit, tagline: e.target.value })}
                className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-[#2196F3]"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Telefoon">
                <input
                  type="text"
                  value={selectedProfileEdit.phone || ""}
                  onChange={(e) => setSelectedProfileEdit({ ...selectedProfileEdit, phone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-[#2196F3]"
                />
              </Field>

              <Field label="Openingstijden">
                <input
                  type="text"
                  value={selectedProfileEdit.openingHours || ""}
                  onChange={(e) => setSelectedProfileEdit({ ...selectedProfileEdit, openingHours: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-[#2196F3]"
                />
              </Field>
            </div>

            <Field label="Tone of voice">
              <select
                value={selectedProfileEdit.toneOfVoice}
                onChange={(e) => setSelectedProfileEdit({ ...selectedProfileEdit, toneOfVoice: e.target.value })}
                className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-[#2196F3]"
              >
                <option value="Warm, empathisch, professioneel en behulpzaam">Warm, empathisch &amp; professioneel</option>
                <option value="Zakelijk, beleefd met U/Uw aanspreekvorm">Formeel (U / Uw)</option>
                <option value="Vlotte, informele en vriendelijke sfeer (Je/Jij)">Informeel (Je / Jij)</option>
              </select>
            </Field>

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
                className="bg-[#2196F3] hover:bg-[#1E88E5] text-white font-semibold px-5 py-2 rounded-lg shadow-xs transition-all"
              >
                Opslaan
              </button>
            </div>
          </form>
        </Modal>
      )}

      {selectedTranscript && (
        <Modal
          title={`Gesprek: ${selectedTranscript.profile.businessName}`}
          subtitle={`${selectedTranscript.session.messages.length} berichten uitgewisseld`}
          onClose={() => setSelectedTranscript(null)}
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-3 whatsapp-bg text-xs">
            {selectedTranscript.session.messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-xs ${
                    m.sender === "user"
                      ? "bg-[#DCF8C6] text-[#111B21] rounded-tr-xs"
                      : "bg-white text-slate-900 rounded-tl-xs shadow-2xs"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  <div className="text-[9.5px] text-slate-400 text-right mt-1">{m.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      <footer className="border-t border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0C0F17] py-6 px-6 sm:px-10 text-center text-xs text-slate-500">
        Verde AI Command · DeepSeek Flash V4 · Google Agenda · Meta WhatsApp Cloud API
      </footer>
    </div>
  );
}

/* ---------------------------------------------------------------- helpers */

function Kpi({
  label,
  value,
  sub,
  accent,
  mono,
}: {
  label: string;
  value: number | string;
  sub: string;
  accent?: string;
  mono?: boolean;
}) {
  return (
    <div className="pro-card p-5 space-y-1.5">
      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {label}
      </div>
      <div
        className={`text-2xl sm:text-3xl font-bold tracking-tight font-mono ${
          accent ? "" : "text-slate-900 dark:text-white"
        } ${mono ? "text-slate-900 dark:text-white" : ""}`}
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{sub}</div>
    </div>
  );
}

function StateChip({ state }: { state: IntegrationState }) {
  const map: Record<IntegrationState, { label: string; cls: string }> = {
    live: { label: "Live", cls: "bg-[#2196F3]/10 text-[#1565C0] dark:text-[#64B5F6] border-[#2196F3]/30" },
    sandbox: { label: "Sandbox", cls: "bg-[#FF9100]/10 text-[#B35F00] dark:text-[#FF9100] border-[#FF9100]/30" },
    "niet-gekoppeld": { label: "Niet gekoppeld", cls: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-400/30" },
  };
  const s = map[state];
  return (
    <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-md shrink-0 ${s.cls}`}>
      {s.label}
    </span>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
        active
          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{children}</span>
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="font-semibold text-slate-700 dark:text-slate-300 block">{label}</label>
      {children}
    </div>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
  wide,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`pro-card rounded-2xl w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up`}
      >
        <div className="p-5 border-b border-slate-100 dark:border-white/[0.08] flex items-start justify-between gap-4 shrink-0">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{title}</h3>
            {subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-400 shrink-0"
            aria-label="Sluiten"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function OutreachModal({
  item,
  onClose,
  onCopy,
  copiedText,
}: {
  item: ClientSessionItem;
  onClose: () => void;
  onCopy: (text: string, label: string) => void;
  copiedText: string | null;
}) {
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const templates = useMemo(() => buildOutreachTemplates(item, origin), [item, origin]);
  const visible = templates.filter((t) => t.channel === channel);
  const stage = getLeadStage(item);

  return (
    <Modal
      wide
      title={`Outreach: ${item.profile.businessName}`}
      subtitle={`${stage.label} · ${stage.reason}`}
      onClose={onClose}
    >
      <div className="px-5 pt-4 shrink-0">
        <div className="inline-flex gap-1 bg-slate-100 dark:bg-white/[0.04] p-1 rounded-lg border border-slate-200/80 dark:border-white/[0.08]">
          {(["whatsapp", "email"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setChannel(c)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                channel === c
                  ? "bg-white dark:bg-[#0F131C] text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {c === "whatsapp" ? <MessageSquare className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
              <span>{c === "whatsapp" ? "WhatsApp" : "E-mail"}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 overflow-y-auto space-y-4 text-xs">
        {visible.map((t) => {
          const full = t.subject ? `Onderwerp: ${t.subject}\n\n${t.body}` : t.body;
          return (
            <div key={t.id} className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">{t.name}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.hint}</span>
                </div>
                <button
                  onClick={() => onCopy(full, t.id)}
                  className="bg-[#2196F3]/10 hover:bg-[#2196F3]/20 text-[#2196F3] border border-[#2196F3]/30 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all shrink-0"
                >
                  {copiedText === t.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === t.id ? "Gekopieerd" : "Kopieer"}</span>
                </button>
              </div>

              {t.subject && (
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Onderwerp: <span className="text-slate-800 dark:text-slate-200">{t.subject}</span>
                </div>
              )}

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-lg border border-slate-200/80 dark:border-white/[0.08] text-[11px] leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                {t.body}
              </div>
            </div>
          );
        })}

        <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-white/[0.06]">
          Verde AI verstuurt niets automatisch namens u. Kopieer de tekst en verstuur hem zelf,
          zodat u volledige controle houdt over toon en timing.
        </p>
      </div>
    </Modal>
  );
}
