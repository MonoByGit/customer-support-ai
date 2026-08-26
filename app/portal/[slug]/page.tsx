"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Check,
  Globe,
  Smartphone,
  Printer,
  Sparkles,
  Circle,
  MessageSquare,
  CalendarDays,
  Rocket,
} from "lucide-react";
import { BusinessProfile } from "@/lib/schemas";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { QrCode } from "@/components/ui/QrCode";

type Platform = "wordpress" | "wix" | "webflow" | "custom";

const PLATFORM_INSTRUCTIONS: Record<Platform, string> = {
  wordpress:
    "Ga naar Weergave → Thema-editor → footer.php, of installeer de plugin 'Insert Headers and Footers' en plak de snippet in het veld 'Scripts in Footer'.",
  wix: "Ga in uw Wix-dashboard naar Instellingen → Aangepaste code → Code toevoegen, en kies plaatsing 'Hoofdtekst – Einde'.",
  webflow: "Ga in Webflow naar Project Settings → Custom Code → Footer Code en plak de snippet daar.",
  custom: "Plak het script direct vóór de sluitende </body> tag in uw HTML-template.",
};

const STORAGE_PREFIX = "verde_onboarding_";

export default function ClientPortalPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<Platform>("wordpress");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [origin, setOrigin] = useState<string>("");
  const [serviceAccount, setServiceAccount] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((d) => d.success && setServiceAccount(d.calendarServiceAccount))
      .catch(() => setServiceAccount(null));
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/profiles?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) setProfile(data.profile);
      })
      .catch((e) => console.error("Kon profiel niet ophalen", e))
      .finally(() => setIsLoading(false));
  }, [slug]);

  // Voortgang overleeft een refresh; puur lokaal, er gaat niets naar de server.
  useEffect(() => {
    if (!slug || typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + slug);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* corrupte of geblokkeerde opslag: gewoon leeg beginnen */
    }
  }, [slug]);

  const toggleStep = (id: string) => {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_PREFIX + slug, JSON.stringify(next));
        }
      } catch {
        /* opslag niet beschikbaar: voortgang blijft alleen deze sessie staan */
      }
      return next;
    });
  };

  const handleCopy = (text: string, section: string) => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const widgetScriptCode = useMemo(
    () => (profile ? `<script src="${origin}/widget.js" data-slug="${profile.slug}" defer></script>` : ""),
    [profile, origin]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#07090E] flex items-center justify-center text-xs text-slate-500 font-mono">
        Klantportaal laden…
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#07090E] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Implementatieportaal niet gevonden
        </h2>
        <p className="text-xs text-slate-500 max-w-md leading-relaxed">
          Er staat geen bedrijfsprofiel geregistreerd onder &lsquo;{slug}&rsquo;. Neem contact op met
          uw accountmanager of start een nieuwe bedrijfsscan.
        </p>
        <Link
          href="/"
          className="bg-[#2196F3] hover:bg-[#1E88E5] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all"
        >
          Terug naar Verde AI
        </Link>
      </div>
    );
  }

  const simulatorUrl = `${origin}/live/${profile.slug}`;
  const cleanPhone = (profile.phone || "+31612345678").replace(/[^0-9]/g, "");
  const waDirectUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Goedendag, ik wil graag een afspraak maken bij ${profile.businessName}.`
  )}`;

  const steps = [
    { id: "widget", label: "Widget op de website geplaatst" },
    { id: "calendar", label: "Google Agenda gedeeld met Verde AI" },
    { id: "qr", label: "QR-code geprint voor balie of wachtruimte" },
    { id: "test", label: "Zelf een testafspraak gemaakt" },
  ];
  const completed = steps.filter((s) => done[s.id]).length;
  const progressPct = Math.round((completed / steps.length) * 100);
  const isLive = completed === steps.length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#07090E] text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200/80 dark:border-white/[0.07] bg-white/90 dark:bg-[#0C0F17]/90 backdrop-blur-xl px-6 sm:px-10 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <BrandLogo className="w-8 h-8 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                {profile.businessName}
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-[#2196F3]/10 text-[#2196F3] font-semibold px-2 py-0.5 rounded-md border border-[#2196F3]/20 shrink-0">
                Professional · Actief
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Verde AI implementatie &amp; onboarding
            </span>
          </div>
        </div>

        <Link
          href={`/live/${profile.slug}`}
          className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#2196F3]" />
          <span className="hidden sm:inline">Open simulator</span>
          <span className="sm:hidden">Simulator</span>
        </Link>
      </header>

      <main className="max-w-5xl w-full mx-auto px-6 sm:px-10 py-8 sm:py-10 flex-1 space-y-8">
        {/* Voortgang */}
        <div className="pro-card p-6 sm:p-8 space-y-5 bg-gradient-to-br from-[#2196F3]/[0.04] to-transparent border-[#2196F3]/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <span className="text-xs font-bold text-[#2196F3] uppercase tracking-wider">
                {isLive ? "U staat live" : "Nog even en u staat live"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isLive
                  ? `${profile.businessName} boekt nu autonoom af`
                  : "Drie stappen tot uw eerste automatische afspraak"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Uw assistent is al geconfigureerd met {profile.services.length} diensten, uw tarieven
                en uw tone of voice. Wat hieronder staat kost samen ongeveer twee minuten.
              </p>
            </div>

            <div className="shrink-0 sm:text-right">
              <div className="text-3xl font-bold font-mono text-[#2196F3]">{progressPct}%</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {completed} van {steps.length} afgerond
              </div>
            </div>
          </div>

          <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2196F3] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleStep(s.id)}
                className={`flex items-center gap-2.5 text-xs font-medium text-left px-3 py-2.5 rounded-lg border transition-all ${
                  done[s.id]
                    ? "bg-[#2196F3]/[0.07] border-[#2196F3]/30 text-slate-900 dark:text-white"
                    : "bg-white/60 dark:bg-white/[0.03] border-slate-200/80 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20"
                }`}
              >
                {done[s.id] ? (
                  <CheckCircle2 className="w-4 h-4 text-[#2196F3] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
                <span className={done[s.id] ? "line-through decoration-slate-400/60" : ""}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* STAP 1: widget */}
        <Section
          number={1}
          icon={Globe}
          title="Plaats de WhatsApp-knop op uw website"
          subtitle="Eén regel code, vlak voor de sluitende </body> tag. Werkt op elk platform."
        >
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-white/[0.04] p-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs w-fit">
            {(Object.keys(PLATFORM_INSTRUCTIONS) as Platform[]).map((plat) => (
              <button
                key={plat}
                onClick={() => setActivePlatform(plat)}
                className={`px-3 py-1.5 rounded-md capitalize font-semibold transition-all ${
                  activePlatform === plat
                    ? "bg-white dark:bg-[#0F131C] text-slate-900 dark:text-white shadow-2xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {plat === "custom" ? "Eigen site" : plat}
              </button>
            ))}
          </div>

          <div className="p-4 bg-[#0A192F] rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <code className="text-[#64B5F6] break-all">{widgetScriptCode}</code>
            <button
              onClick={() => handleCopy(widgetScriptCode, "widget")}
              className="bg-[#2196F3] hover:bg-[#1E88E5] text-white font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 shadow-xs"
            >
              {copiedSection === "widget" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === "widget" ? "Gekopieerd" : "Kopieer snippet"}</span>
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-white/[0.03] p-4 rounded-xl border border-slate-200/80 dark:border-white/[0.06] text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2196F3]" />
              <span>Installatie op {activePlatform === "custom" ? "een eigen site" : activePlatform}</span>
            </div>
            <p className="leading-relaxed">{PLATFORM_INSTRUCTIONS[activePlatform]}</p>
          </div>
        </Section>

        {/* STAP 2: agenda */}
        <Section
          number={2}
          icon={CalendarDays}
          title="Koppel uw Google Agenda"
          subtitle="Zo ziet Verde AI uw echte beschikbaarheid en ontstaan er nooit dubbele boekingen."
        >
          <ol className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <WizardStep n="1">
              Open <strong>calendar.google.com</strong> en klik op de drie puntjes naast uw praktijkagenda.
            </WizardStep>
            <WizardStep n="2">
              Kies <em>Instellingen en delen</em> → <em>Delen met specifieke personen of groepen</em>.
            </WizardStep>
            <WizardStep n="3">
              <div className="space-y-2">
                <span>Voeg het Verde AI-serviceaccount toe:</span>
                {serviceAccount ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      readOnly
                      value={serviceAccount}
                      aria-label="Verde AI serviceaccount"
                      className="flex-1 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 font-mono text-[11px] text-slate-900 dark:text-white outline-none"
                    />
                    <button
                      onClick={() => handleCopy(serviceAccount, "service-email")}
                      className="bg-[#2196F3] hover:bg-[#1E88E5] text-white font-semibold px-3 py-2 rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition-all shrink-0 shadow-xs"
                    >
                      {copiedSection === "service-email" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSection === "service-email" ? "Gekopieerd" : "Kopieer"}</span>
                    </button>
                  </div>
                ) : (
                  <p className="bg-[#FF9100]/[0.07] border border-[#FF9100]/30 rounded-lg px-3 py-2.5 text-[11px] text-[#B35F00] dark:text-[#FF9100] leading-relaxed">
                    Het serviceaccount is nog niet geconfigureerd. Zodra de agendakoppeling
                    is ingesteld verschijnt hier het adres dat u moet uitnodigen.
                  </p>
                )}
              </div>
            </WizardStep>
            <WizardStep n="4">
              Geef de rechten <strong>&lsquo;Wijzigingen aanbrengen in afspraken&rsquo;</strong> en sla op.
            </WizardStep>
          </ol>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/[0.06] pt-3">
            Zolang de agenda nog niet gedeeld is, werkt de assistent op een sandbox-agenda met
            realistische tijdsloten. Er wordt dan niets in uw echte agenda geschreven.
          </p>
        </Section>

        {/* STAP 3: QR */}
        <Section
          number={3}
          icon={Smartphone}
          title="Balie- en wachtruimte QR-code"
          subtitle="Laat wachtende klanten hun volgende afspraak zelf inplannen, zonder uw balie te belasten."
        >
          <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-6 items-center">
            <div className="flex justify-center">
              {origin ? (
                <QrCode value={waDirectUrl} size={150} label="Scan om via WhatsApp te boeken" />
              ) : (
                <div className="w-[166px] h-[166px] rounded-xl bg-slate-100 dark:bg-white/[0.04] animate-pulse" />
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <span className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#2196F3]" />
                  Directe WhatsApp-boekingslink
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={waDirectUrl}
                    aria-label="Directe WhatsApp boekingslink"
                    className="flex-1 min-w-0 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 font-mono text-[11px] text-slate-700 dark:text-slate-300 outline-none"
                  />
                  <button
                    onClick={() => handleCopy(waDirectUrl, "wa-url")}
                    className="bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 px-3 py-2 rounded-lg transition-all shrink-0"
                    aria-label="Kopieer boekingslink"
                  >
                    {copiedSection === "wa-url" ? (
                      <Check className="w-3.5 h-3.5 text-[#2196F3]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/portal/${profile.slug}/poster`}
                  className="bg-[#2196F3] hover:bg-[#1E88E5] text-white font-semibold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Open printklare balieposter</span>
                </Link>

                <a
                  href={simulatorUrl}
                  className="bg-white dark:bg-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.1] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] font-semibold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 transition-all"
                >
                  <Rocket className="w-3.5 h-3.5 text-[#2196F3]" />
                  <span>Zelf testen</span>
                </a>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <footer className="border-t border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0C0F17] py-6 px-6 text-center text-xs text-slate-500">
        Verde AI implementatieportaal · geautoriseerde handoff voor {profile.businessName}
      </footer>
    </div>
  );
}

function Section({
  number,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  number: number;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pro-card p-6 sm:p-8 space-y-5">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-lg bg-[#2196F3] text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
          {number}
        </div>
        <div className="space-y-0.5">
          <h2 className="font-bold text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Icon className="w-4 h-4 text-[#2196F3] shrink-0" />
            {title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function WizardStep({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
        {n}
      </span>
      <div className="flex-1 leading-relaxed">{children}</div>
    </li>
  );
}
