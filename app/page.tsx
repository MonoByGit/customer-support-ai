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
  Lock,
  Headphones,
  Check,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { HeroInteractivePhone } from "@/components/landing/HeroInteractivePhone";
import { IndustryTabs } from "@/components/landing/IndustryTabs";
import { RoiCalculator } from "@/components/landing/RoiCalculator";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqAccordion } from "@/components/landing/FaqAccordion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06090e] text-slate-900 dark:text-slate-100 selection:bg-[#00D492] selection:text-black overflow-x-hidden transition-colors duration-200">
      {/* Background Ambient Radial Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-emerald-500/10 dark:from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <nav className="border-b border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#06090e]/80 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Left */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D492] to-[#075E54] flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                Verde AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                WHATSAPP BOEKINGSENGINE
              </span>
            </div>
          </Link>

          {/* Right Controls: Theme Switcher & CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />

            <Link
              href="/admin"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] px-3.5 py-2 rounded-xl transition-all hidden sm:inline-flex"
            >
              Admin Generator
            </Link>

            <Link
              href="/demo/tandarts-demo"
              className="bg-[#00D492] hover:bg-[#00be82] active:scale-95 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <span>Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Meta WhatsApp Cloud API & Gemini Flash 2.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              Zet websitebezoekers om in{" "}
              <span className="text-gradient-emerald">
                bevestigde afspraken
              </span>{" "}
              via WhatsApp.
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Meer dan 40% van je potentiële klanten bezoekt je website 's avonds en haakt af op formulieren. Verde plant 24/7 autonoom afspraken in direct in je Google Agenda.
            </p>

            {/* Fast Ingestion Form directly in Hero */}
            <div className="pt-2 max-w-lg">
              <form
                action="/admin"
                method="GET"
                className="bg-white dark:bg-[#0d141e] p-2 rounded-2xl border border-slate-200 dark:border-white/[0.12] shadow-lg flex flex-col sm:flex-row gap-2"
              >
                <div className="flex-1 relative flex items-center">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    name="url"
                    placeholder="https://jouwpraktijk.nl"
                    className="w-full bg-transparent pl-10 pr-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#00D492] hover:bg-[#00be82] text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
                >
                  <span>Genereer Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-2 px-1">
                <span>✓ 100% Gratis uitproberen</span>
                <span>✓ Binnen 10 sec live</span>
                <span>✓ Geen creditcard nodig</span>
              </div>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200 dark:border-white/[0.08] max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                  98%
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Open rate op WhatsApp</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                  &lt; 45 sec
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Gemiddelde boekingstijd</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  0%
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">No-shows door reminders</div>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Playable Product Simulator */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroInteractivePhone />
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-slate-200 dark:border-white/[0.08] bg-slate-100/60 dark:bg-[#090e15]/60 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <span>Tandartspraktijken</span>
          <span>•</span>
          <span>Haar- & Schoonheidssalons</span>
          <span>•</span>
          <span>Installateurs & Loodgieters</span>
          <span>•</span>
          <span>Fysiotherapie & Zorgklinieken</span>
        </div>
      </section>

      {/* 4-Step How It Works Flow */}
      <section className="px-4 sm:px-8 py-20 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Hoe het werkt
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Van websitebezoeker naar bevestigde afspraak in 45 seconden
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#0d141e] border border-slate-200 dark:border-white/[0.08] p-6 rounded-3xl space-y-3 shadow-sm dark:shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-[#00D492] font-mono font-extrabold flex items-center justify-center text-base">
              01
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Klant opent WhatsApp</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Via de zwevende WhatsApp widget op je site of een advertentielink start de bezoeker direct een gesprek.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0d141e] border border-slate-200 dark:border-white/[0.08] p-6 rounded-3xl space-y-3 shadow-sm dark:shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-[#00D492] font-mono font-extrabold flex items-center justify-center text-base">
              02
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">AI checkt Google Agenda</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Verde analyseert realtime je vrije tijdslots en stelt 2 concrete opties voor met interactieve knoppen.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0d141e] border border-slate-200 dark:border-white/[0.08] p-6 rounded-3xl space-y-3 shadow-sm dark:shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-[#00D492] font-mono font-extrabold flex items-center justify-center text-base">
              03
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Klant bevestigt met 1 klik</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              De klant klikt op het gewenste tijdstip en geeft naam en telefoonnummer door. Geen logins of formulieren.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0d141e] border border-slate-200 dark:border-white/[0.08] p-6 rounded-3xl space-y-3 shadow-sm dark:shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-[#00D492] font-mono font-extrabold flex items-center justify-center text-base">
              04
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Direct in beide agenda's</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              De afspraak staat in je Google Agenda en de klant ontvangt direct een kalenderbevestiging en herinneringen.
            </p>
          </div>
        </div>
      </section>

      {/* Target Industry Showcase Tabs */}
      <section className="py-16 border-t border-slate-200 dark:border-white/[0.08] bg-slate-100/40 dark:bg-[#080d14]/40">
        <IndustryTabs />
      </section>

      {/* Interactive ROI Calculator */}
      <section className="px-4 sm:px-8 py-20 max-w-6xl mx-auto border-t border-slate-200 dark:border-white/[0.08]">
        <RoiCalculator />
      </section>

      {/* Feature Deep Dive Grid */}
      <section className="px-4 sm:px-8 py-20 max-w-6xl mx-auto space-y-12 border-t border-slate-200 dark:border-white/[0.08]">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Geavanceerde Functionaliteiten
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Gebouwd voor maximale betrouwbaarheid en privacy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white dark:bg-[#0d141e] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">WhatsApp Interactive Buttons</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Gebruikt de officiële Meta Cloud API interactieve knoppen zodat klanten met één tik een tijdslot selecteren.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-[#0d141e] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">2-Way Google Agenda Sync</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Voorkomt dubbele boekingen door continu de vrije en bezette momenten in je Google Agenda te controleren.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-[#0d141e] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">AVG & Privacy Proof</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Volledig conform de Europese privacywetgeving (AVG/GDPR). Gegevens worden uitsluitend gebruikt voor de afspraak.
            </p>
          </div>
        </div>
      </section>

      {/* Transparent Pricing Matrix */}
      <section className="py-20 border-t border-slate-200 dark:border-white/[0.08] bg-slate-100/40 dark:bg-[#080d14]/40">
        <PricingSection />
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 border-t border-slate-200 dark:border-white/[0.08]">
        <FaqAccordion />
      </section>

      {/* Final High-Converting CTA Banner */}
      <section className="px-4 sm:px-8 py-20 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-br from-emerald-950 to-teal-950 border border-emerald-500/40 rounded-3xl p-8 sm:p-12 text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Start vandaag met het automatisch vullen van je agenda
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Genereer direct een interactief WhatsApp prototype voor jouw website. Binnen 10 seconden klaar om te testen.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/admin"
              className="bg-[#00D492] hover:bg-[#00be82] active:scale-95 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm shadow-lg transition-all flex items-center gap-2"
            >
              <span>Genereer Demo voor Jouw Bedrijf</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>

            <Link
              href="/demo/tandarts-demo"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all"
            >
              Bekijk Tandarts Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#06090e] py-10 px-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3 transition-colors">
        <div className="flex items-center justify-center gap-2 text-slate-800 dark:text-slate-300 font-semibold text-sm">
          <MessageSquare className="w-4 h-4 text-[#00D492]" />
          <span>Verde WhatsApp AI Booking Engine</span>
        </div>
        <p>© 2026 Verde AI. Alle rechten voorbehouden. Gebouwd voor Nederlandse MKB dienstverleners.</p>
      </footer>
    </div>
  );
}
