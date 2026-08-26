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
} from "lucide-react";
import { getAllProfiles } from "@/lib/storage";

export default function LandingPage() {
  const profiles = getAllProfiles();

  return (
    <div className="min-h-screen bg-[#0b141a] text-white selection:bg-[#00A884]">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-[#111b21]/70 backdrop-blur-lg sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A884] to-[#075E54] flex items-center justify-center shadow-lg shadow-emerald-950">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                WhatsApp AI Engine
              </span>
              <span className="block text-[10px] text-emerald-400 font-mono">
                Gemini Flash & Google Calendar
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all font-medium"
            >
              Admin Generator
            </Link>
            <Link
              href="/demo/tandarts-demo"
              className="bg-[#00A884] hover:bg-[#069677] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center gap-1.5"
            >
              <span>Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            WhatsApp AI Appointment Booking Engine & Clickable Demos
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Zet websitebezoekers direct om in{" "}
            <span className="bg-gradient-to-r from-[#25D366] to-[#00A884] bg-clip-text text-transparent">
              bevestigde agenda-afspraken
            </span>{" "}
            via WhatsApp.
          </h1>

          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Schraap een bedrijfswebsite, extraheer diensten & tarieven met Gemini AI, en start direct een klikbare WhatsApp Web demo met Google Calendar synchronisatie.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/demo/tandarts-demo"
              className="bg-[#00A884] hover:bg-[#069677] text-white px-7 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-emerald-900/40 hover:scale-[1.02] transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Test Tandarts Demo (WhatsApp)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admin"
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-7 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Genereer Nieuw Bedrijfsprofiel</span>
            </Link>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-left">
            <div className="bg-[#111b21] border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-black text-emerald-400">3 sec</div>
              <div className="text-xs text-gray-400 mt-1">Website Scraping & Extraction</div>
            </div>
            <div className="bg-[#111b21] border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-black text-emerald-400">100%</div>
              <div className="text-xs text-gray-400 mt-1">WhatsApp Web Pixel-Perfect</div>
            </div>
            <div className="bg-[#111b21] border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-black text-emerald-400">Native Tools</div>
              <div className="text-xs text-gray-400 mt-1">Availability & Booking Tool Calls</div>
            </div>
            <div className="bg-[#111b21] border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-black text-emerald-400">Auto Fallback</div>
              <div className="text-xs text-gray-400 mt-1">Zero-Config Sandbox Mode</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="px-6 py-16 bg-[#0e161c] border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Compleet End-to-End Ecosysteem
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Alles wat nodig is om een prospect binnen enkele seconden te overtuigen met een werkend WhatsApp prototype.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#111b21] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. AI Ingestion & Scraping</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Cheerio verwijdert automatisch headers, footers en scripts. Gemini Flash structureert de data direct in een gevalideerd Zod schema met diensten, prijzen en openingstijden.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#111b21] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Gemini Flash Tool Calling</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                De assistent houdt WhatsApp-berichten kort (2-3 zinnen), roept autonoom <code className="text-emerald-300">check_availability</code> aan en stelt 2 concrete tijdslots voor.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#111b21] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Google Calendar Engine</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Volledige Google Calendar API koppeling via Service Account credentials met een robuuste ingebouwde sandbox fallback voor directe tests zonder externe sleutels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Demo Profiles */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Beschikbare Demo Profielen</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Klik op een van de gegenereerde bedrijven om direct de WhatsApp interface te openen.
              </p>
            </div>
            <Link
              href="/admin"
              className="bg-[#00A884] hover:bg-[#069677] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 self-start"
            >
              <span>+ Nieuw Bedrijf Scrapen</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((p) => (
              <Link
                key={p.slug}
                href={`/demo/${p.slug}`}
                className="bg-[#111b21] border border-white/10 hover:border-emerald-500/50 rounded-2xl p-5 transition-all group flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-emerald-950/20"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30 uppercase">
                      {p.industry}
                    </span>
                    <span className="text-xs text-gray-500">{p.services.length} diensten</span>
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                    {p.businessName}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {p.tagline || "Klik om het WhatsApp gesprek te starten."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-emerald-400 font-medium">
                  <span>Open WhatsApp Demo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#111b21] py-8 px-6 text-center text-xs text-gray-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-gray-400 font-semibold">
          <MessageSquare className="w-4 h-4 text-[#00A884]" />
          <span>WhatsApp AI Appointment Booking Engine</span>
        </div>
        <p>Volledig geconfigureerd voor Railway deployment met standalone Next.js & Dockerfile.</p>
      </footer>
    </div>
  );
}
