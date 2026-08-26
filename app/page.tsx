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
  Clock,
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
import { FloatingWhatsAppWidget } from "@/components/landing/FloatingWhatsAppWidget";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D11] text-slate-900 dark:text-[#F1F5F9] selection:bg-[#00D492] selection:text-black overflow-x-hidden transition-colors duration-200">
      
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-emerald-500/10 dark:from-emerald-500/15 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="border-b border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#090D11]/80 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D492] to-[#075E54] flex items-center justify-center shadow-sm">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Verde AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                WHATSAPP BOEKINGSENGINE
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />

            <Link
              href="/admin"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] px-3.5 py-2 rounded-xl transition-all hidden sm:inline-flex"
            >
              Demo Generator
            </Link>

            <Link
              href="/demo/tandarts-demo"
              className="bg-[#00D492] hover:bg-[#00be82] active:scale-95 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Authoritative B2B Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Meta WhatsApp Cloud API & Google Agenda Integratie</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              Zet websitebezoekers om in{" "}
              <span className="text-emerald-600 dark:text-[#00D492]">
                bevestigde afspraken
              </span>{" "}
              via WhatsApp.
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Meer dan 40% van uw potentiële klanten bezoekt uw website buiten kantoortijden en haakt af op statische contactformulieren. Verde AI plant 24/7 autonoom afspraken in direct in uw Google Agenda.
            </p>

            {/* Fast Ingestion Form */}
            <div className="pt-2 max-w-lg">
              <form
                action="/admin"
                method="GET"
                className="bg-white dark:bg-[#0F141C] p-2 rounded-2xl border border-slate-200 dark:border-white/[0.1] shadow-lg flex flex-col sm:flex-row gap-2"
              >
                <div className="flex-1 relative flex items-center">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    name="url"
                    placeholder="https://uwbedrijf.nl"
                    className="w-full bg-transparent pl-10 pr-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#00D492] hover:bg-[#00be82] active:scale-95 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
                >
                  <span>Genereer Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-2.5 px-1 font-medium">
                <span>✓ Vrijblijvende live demo</span>
                <span>✓ Binnen 10 sec gegenereerd</span>
                <span>✓ Geen creditcard nodig</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200 dark:border-white/[0.08] max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono">
                  98%
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Open rate op WhatsApp</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono">
                  &lt; 30 sec
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Gemiddelde boekingstijd</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  0%
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">No-shows door herinneringen</div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, Authentic iPhone 16 Pro Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroInteractivePhone />
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-slate-200 dark:border-white/[0.08] bg-slate-100/60 dark:bg-[#0c1118]/60 py-5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <span>Tandartspraktijken</span>
          <span>•</span>
          <span>Klinieken & Zorg</span>
          <span>•</span>
          <span>Kapsalons & Beauty</span>
          <span>•</span>
          <span>Installateurs & Loodgieters</span>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="px-4 sm:px-8 py-20 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Proces
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Van websitebezoeker naar agenda-afspraak in 4 stappen
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="premium-card p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Klant opent WhatsApp</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Via de knop op uw website of advertentie start de bezoeker direct een laagdrempelig gesprek.
            </p>
          </div>

          <div className="premium-card p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">AI controleert agenda</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Verde AI analyseert realtime uw actuele beschikbaarheid en stelt 2 concrete opties voor.
            </p>
          </div>

          <div className="premium-card p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Klant bevestigt met 1 klik</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Via WhatsApp Interactive Buttons kiest de klant direct het tijdslot en geeft contactgegevens door.
            </p>
          </div>

          <div className="premium-card p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center justify-center text-sm">
              04
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">2-Way Agenda Synchronisatie</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              De afspraak wordt definitief ingeroosterd in Google Agenda en de klant ontvangt automatische reminders.
            </p>
          </div>
        </div>
      </section>

      {/* Industry Tabs */}
      <section className="py-16 border-t border-slate-200 dark:border-white/[0.08] bg-slate-100/50 dark:bg-[#0c1118]/50">
        <IndustryTabs />
      </section>

      {/* ROI Calculator */}
      <section className="px-4 sm:px-8 py-20 max-w-6xl mx-auto border-t border-slate-200 dark:border-white/[0.08]">
        <RoiCalculator />
      </section>

      {/* Pricing */}
      <section className="py-20 border-t border-slate-200 dark:border-white/[0.08] bg-slate-100/50 dark:bg-[#0c1118]/50">
        <PricingSection />
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-slate-200 dark:border-white/[0.08]">
        <FaqAccordion />
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-8 py-20 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-br from-emerald-950 to-slate-950 border border-emerald-500/30 text-white rounded-3xl p-8 sm:p-12 space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Start vandaag met het automatiseren van uw agenda
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Genereer direct een interactief WhatsApp prototype voor uw website. Binnen 10 seconden klaar om te testen.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/admin"
              className="bg-[#00D492] hover:bg-[#00be82] active:scale-95 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Genereer Demo voor Uw Bedrijf</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>

            <Link
              href="/demo/tandarts-demo"
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all"
            >
              Bekijk Tandarts Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#090D11] py-8 px-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2 transition-colors">
        <div className="flex items-center justify-center gap-2 text-slate-800 dark:text-slate-200 font-semibold text-sm">
          <MessageSquare className="w-4 h-4 text-[#00D492]" />
          <span>Verde WhatsApp AI Booking Engine</span>
        </div>
        <p>© 2026 Verde AI. Alle rechten voorbehouden.</p>
      </footer>

      {/* Floating Sales WhatsApp Trigger */}
      <FloatingWhatsAppWidget />
    </div>
  );
}
