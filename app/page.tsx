import React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Calendar,
  Sparkles,
  Bot,
  Zap,
  CheckCircle2,
  ArrowRight,
  Globe,
  Smartphone,
  ShieldCheck,
  Cpu,
  Clock,
  ChevronRight,
  TrendingUp,
  XCircle,
  ExternalLink,
  Layers,
  Code2,
} from "lucide-react";
import { getAllProfiles } from "@/lib/storage";

export default function LandingPage() {
  const profiles = getAllProfiles();

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 selection:bg-[#00D492] selection:text-black overflow-x-hidden">
      {/* Top Ambient Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Navigation */}
      <nav className="border-b border-white/[0.08] bg-[#06090e]/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D492] to-[#075E54] flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Verde AI Engine
              </span>
              <span className="block text-[10px] text-emerald-400/90 font-mono tracking-wider">
                WHATSAPP BOEKINGSPLATFORM
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-4 py-2 rounded-xl transition-all font-semibold"
            >
              Admin Generator
            </Link>
            <Link
              href="/demo/tandarts-demo"
              className="bg-[#00D492] hover:bg-[#00be82] text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <span>Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 sm:pt-24 pb-20 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Meta WhatsApp Cloud API & Gemini Flash Kernel</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Zet websitebezoekers om in{" "}
            <span className="text-gradient-emerald">
              bevestigde afspraken
            </span>{" "}
            via WhatsApp.
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-normal">
            Geen statische contactformulieren of gemiste telefoontjes meer. Laat een hyperintelligente AI receptionist 24/7 afspraken inplannen direct in je Google Agenda.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/demo/tandarts-demo"
            className="bg-[#00D492] hover:bg-[#00be82] active:scale-95 text-slate-950 px-7 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-all"
          >
            <Smartphone className="w-4 h-4 text-slate-950" />
            <span>Open WhatsApp Demo (Tandarts)</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </Link>

          <Link
            href="/admin"
            className="bg-slate-900/80 hover:bg-slate-800 text-white border border-white/[0.12] hover:border-emerald-500/40 px-7 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-md"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Genereer voor Jouw Website</span>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto pt-8 text-left">
          <div className="glass-panel rounded-2xl p-4.5 border border-white/[0.08] hover:border-emerald-500/30 transition-all">
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">100%</div>
            <div className="text-xs font-semibold text-white mt-0.5">Authentiek WhatsApp</div>
            <div className="text-[11px] text-slate-400 mt-1">Interactive buttons & flows</div>
          </div>

          <div className="glass-panel rounded-2xl p-4.5 border border-white/[0.08] hover:border-emerald-500/30 transition-all">
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">24/7</div>
            <div className="text-xs font-semibold text-white mt-0.5">Autonome Receptionist</div>
            <div className="text-[11px] text-slate-400 mt-1">Directe slot proposals</div>
          </div>

          <div className="glass-panel rounded-2xl p-4.5 border border-white/[0.08] hover:border-emerald-500/30 transition-all">
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">Google Cal</div>
            <div className="text-xs font-semibold text-white mt-0.5">Realtime Synchronisatie</div>
            <div className="text-[11px] text-slate-400 mt-1">Service Account & sandbox</div>
          </div>

          <div className="glass-panel rounded-2xl p-4.5 border border-white/[0.08] hover:border-emerald-500/30 transition-all">
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">&lt; 3 sec</div>
            <div className="text-xs font-semibold text-white mt-0.5">AI Website Scraping</div>
            <div className="text-[11px] text-slate-400 mt-1">Plak URL & klaar</div>
          </div>
        </div>
      </section>

      {/* Target Audience & Industry Demos */}
      <section className="px-6 py-16 border-t border-white/[0.08] bg-[#080d14]/70">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Branche-specifieke Oplossingen
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Gebouwd voor dienstverleners met agenda's
              </h2>
              <p className="text-slate-400 text-sm max-w-xl">
                Ervaar hoe de WhatsApp AI Engine werkt voor verschillende branches. Kies een profiel om direct de WhatsApp demo te openen:
              </p>
            </div>

            <Link
              href="/admin"
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>+ Nieuwe Website Ingesten</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {profiles.map((p) => (
              <Link
                key={p.slug}
                href={`/demo/${p.slug}`}
                className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-mono font-bold bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                      {p.industry}
                    </span>
                    <span className="text-xs text-slate-500">{p.services.length} behandelingen</span>
                  </div>

                  <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                    {p.businessName}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {p.tagline || "Klik om het interactieve WhatsApp gesprek te starten."}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Open WhatsApp Simulator</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: Traditional Form vs WhatsApp AI Engine */}
      <section className="px-6 py-20 border-t border-white/[0.08] max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Waarom WhatsApp AI Wint
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Stop het verlies van 40% van je websitebezoekers
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Klanten haten formulieren en hebben geen zin om te bellen tijdens werktijd. WhatsApp is de vertrouwde plek waar beslissingen worden genomen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Form Card */}
          <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center gap-2.5 text-red-400 font-bold text-sm">
              <XCircle className="w-5 h-5 text-red-400" />
              <span>Traditioneel Contactformulier</span>
            </div>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Klant vult formulier in en moet 24 uur wachten op een e-mail.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>E-mails belanden in de spamfolder of worden over het hoofd gezien.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Eindeloos heen-en-weer mailen om een geschikt tijdstip te vinden.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Hoge no-show ratio door gebrek aan herinneringen.</span>
              </li>
            </ul>
          </div>

          {/* WhatsApp AI Engine Card */}
          <div className="bg-emerald-950/30 border border-emerald-500/35 rounded-2xl p-6 space-y-4 text-xs relative overflow-hidden shadow-xl shadow-emerald-950/30">
            <div className="flex items-center gap-2.5 text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#00D492]" />
              <span>Verde WhatsApp AI Boekingsengine</span>
            </div>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-[#00D492] font-bold">✓</span>
                <span>Klant start met 1 klik direct in WhatsApp (98% open rate).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00D492] font-bold">✓</span>
                <span>AI controleert realtime de Google Agenda en stelt direct 2 tijdslots voor.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00D492] font-bold">✓</span>
                <span>Afspraak staat binnen 45 seconden bevestigd in beide agenda's.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00D492] font-bold">✓</span>
                <span>Automatische .ics en Google Calendar bevestigingen.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Real Meta Cloud API Technical Architecture */}
      <section className="px-6 py-16 border-t border-white/[0.08] bg-[#070b10]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              PRODUCTIE ARCHITECTUUR
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Hoe het werkt met de officiële Meta WhatsApp Cloud API
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              Deze applicatie is 100% voorbereid op directe live koppeling met een officieel WhatsApp Business nummer via Meta Webhooks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="glass-panel p-4 rounded-xl border border-white/[0.08] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                1
              </div>
              <div className="font-bold text-white">Klant stuurt WhatsApp</div>
              <p className="text-slate-400 text-[11px]">
                Klant stuurt bericht of klikt op een advertentie/wa.me link op de website.
              </p>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-white/[0.08] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                2
              </div>
              <div className="font-bold text-white">Meta Webhook Dispatch</div>
              <p className="text-slate-400 text-[11px]">
                Meta stuurt payload naar <code className="text-emerald-300">/api/webhook</code> met verificatie handshake.
              </p>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-white/[0.08] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                3
              </div>
              <div className="font-bold text-white">Gemini Flash & Tools</div>
              <p className="text-slate-400 text-[11px]">
                Gemini roept autonoom <code className="text-emerald-300">check_availability</code> of <code className="text-emerald-300">confirm_booking</code> aan.
              </p>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-white/[0.08] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                4
              </div>
              <div className="font-bold text-white">Google Agenda Sync</div>
              <p className="text-slate-400 text-[11px]">
                Afspraak staat in de agenda van het bedrijf en de klant ontvangt interactieve buttons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#06090e] py-8 px-6 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-400 font-semibold">
          <MessageSquare className="w-4 h-4 text-[#00D492]" />
          <span>Verde WhatsApp AI Booking Engine</span>
        </div>
        <p>Volledig geconfigureerd voor Railway deployment met standalone Next.js & Dockerfile.</p>
      </footer>
    </div>
  );
}
