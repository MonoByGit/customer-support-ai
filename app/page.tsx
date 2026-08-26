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
  HeartHandshake,
  Check,
  MousePointer2,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { HeroInteractivePhone } from "@/components/landing/HeroInteractivePhone";
import { IndustryTabs } from "@/components/landing/IndustryTabs";
import { RoiCalculator } from "@/components/landing/RoiCalculator";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqAccordion } from "@/components/landing/FaqAccordion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#18181B] text-slate-900 dark:text-[#F4F4F5] selection:bg-[#0ACF83] selection:text-slate-950 overflow-x-hidden transition-colors duration-200">
      
      {/* Playful Figma Canvas Grid Background (Subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Left with Figma Palette Accent */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0ACF83] via-[#18A0FB] to-[#A259FF] flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Verde AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10.5px] bg-[#0ACF83]/15 text-[#0ACF83] font-mono font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                WHATSAPP BOEKINGEN
              </span>
            </div>
          </Link>

          {/* Right Nav */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />

            <Link
              href="/admin"
              className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#27272A] hover:bg-slate-200 dark:hover:bg-[#323236] border border-slate-200 dark:border-white/10 px-3.5 py-2 rounded-xl transition-all hidden sm:inline-flex"
            >
              Demo Generator
            </Link>

            <Link
              href="/demo/tandarts-demo"
              className="bg-[#0ACF83] hover:bg-[#00be82] active:scale-95 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Test Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 pt-10 sm:pt-16 pb-16 sm:pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Friendly, High-Converting Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Playful Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#0ACF83]/10 dark:bg-[#0ACF83]/20 border border-[#0ACF83]/30 text-[#0ACF83] px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0ACF83]" />
              <span>Slimme WhatsApp Afspraken voor Ondernemers</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Jouw agenda automatisch volgeboekt,{" "}
              <span className="text-[#0ACF83] underline decoration-wavy decoration-[#FFC700] decoration-2 underline-offset-8">
                zonder gedoe.
              </span>
            </h1>

            {/* Human & Relatable Copy for Small Business Owners */}
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Klanten appen liever snel dan bellen. Terwijl jij aan het behandelen, knippen of sleutelen bent, plant Verde AI direct afspraken in jouw Google Agenda.
            </p>

            {/* Fast 1-Click Ingestion Generator Box */}
            <div className="pt-1 max-w-lg">
              <form
                action="/admin"
                method="GET"
                className="bg-white dark:bg-[#27272A] p-2 rounded-2xl border-2 border-slate-200 dark:border-white/10 shadow-lg flex flex-col sm:flex-row gap-2"
              >
                <div className="flex-1 relative flex items-center">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    name="url"
                    placeholder="https://jouwbedrijf.nl"
                    className="w-full bg-transparent pl-10 pr-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#0ACF83] hover:bg-[#00be82] active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
                >
                  <span>Genereer Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center gap-4 text-[11.5px] text-slate-500 dark:text-slate-400 pt-2.5 px-1 font-medium">
                <span>✓ 100% Gratis uitproberen</span>
                <span>✓ Klaar in 10 seconden</span>
                <span>✓ Geen creditcard nodig</span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200 dark:border-white/10 max-w-lg">
              <div className="bg-white dark:bg-[#27272A] p-3 rounded-xl border border-slate-200 dark:border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                  98%
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">Leest WhatsApp</div>
              </div>
              <div className="bg-white dark:bg-[#27272A] p-3 rounded-xl border border-slate-200 dark:border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                  &lt; 30 sec
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">Snel geboekt</div>
              </div>
              <div className="bg-white dark:bg-[#27272A] p-3 rounded-xl border border-slate-200 dark:border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-extrabold text-[#0ACF83] font-mono">
                  0%
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">No-shows</div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic iPhone 16 Pro Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroInteractivePhone />
          </div>
        </div>
      </section>

      {/* Friendly Industry Strip */}
      <section className="border-y border-slate-200 dark:border-white/10 bg-white dark:bg-[#1E1E1E] py-5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5">🦷 Tandartsen & Klinieken</span>
          <span>•</span>
          <span className="flex items-center gap-1.5">✂️ Kapsalons & Schoonheid</span>
          <span>•</span>
          <span className="flex items-center gap-1.5">🔧 Loodgieters & Installateurs</span>
          <span>•</span>
          <span className="flex items-center gap-1.5">💆 Fysiotherapie & Zorg</span>
        </div>
      </section>

      {/* 4-Step Visual Flow */}
      <section className="px-4 sm:px-8 py-20 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-[#0ACF83] bg-[#0ACF83]/10 dark:bg-[#0ACF83]/20 px-3 py-1 rounded-full uppercase tracking-wider">
            Supersimpel
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Hoe het werkt in 4 makkelijke stappen
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="figma-card p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0ACF83]/15 text-[#0ACF83] font-mono font-extrabold flex items-center justify-center text-base">
              1
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Klant stuurt een appje</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Via de knop op je website of via je bestaande bedrijfsnummer start de klant eenvoudig een chat.
            </p>
          </div>

          <div className="figma-card p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#18A0FB]/15 text-[#18A0FB] font-mono font-extrabold flex items-center justify-center text-base">
              2
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI stelt opties voor</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Verde checkt jouw vrije momenten in Google Agenda en toont direct 2 handige keuzeknoppen.
            </p>
          </div>

          <div className="figma-card p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A259FF]/15 text-[#A259FF] font-mono font-extrabold flex items-center justify-center text-base">
              3
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Klant klikt en bevestigt</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Met 1 tik kiest de klant het tijdslot. Geen wachtwoorden, downloads of formulieren.
            </p>
          </div>

          <div className="figma-card p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFC700]/20 text-[#D97706] dark:text-[#FFC700] font-mono font-extrabold flex items-center justify-center text-base">
              4
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Direct in je agenda</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              De afspraak staat in jouw agenda en de klant krijgt direct een herinnering via WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Target Industry Showcase Tabs */}
      <section className="py-16 border-t border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-[#1E1E1E]">
        <IndustryTabs />
      </section>

      {/* Interactive ROI Calculator */}
      <section className="px-4 sm:px-8 py-20 max-w-6xl mx-auto border-t border-slate-200 dark:border-white/10">
        <RoiCalculator />
      </section>

      {/* Pricing Matrix */}
      <section className="py-20 border-t border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-[#1E1E1E]">
        <PricingSection />
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 border-t border-slate-200 dark:border-white/10">
        <FaqAccordion />
      </section>

      {/* Final Cheerful CTA Banner */}
      <section className="px-4 sm:px-8 py-20 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#0ACF83] via-[#075E54] to-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Klaar voor een altijd gevulde agenda?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Probeer het nu direct gratis uit voor jouw eigen zaak. Binnen 10 seconden klaar om te testen.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/admin"
              className="bg-white hover:bg-slate-100 active:scale-95 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-lg transition-all flex items-center gap-2"
            >
              <span>Genereer Demo voor Jouw Bedrijf</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/demo/tandarts-demo"
              className="bg-black/30 hover:bg-black/40 text-white border border-white/20 font-bold px-6 py-3.5 rounded-xl text-sm transition-all"
            >
              Bekijk Tandarts Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#1E1E1E] py-8 px-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2 transition-colors">
        <div className="flex items-center justify-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <MessageSquare className="w-4 h-4 text-[#0ACF83]" />
          <span>Verde WhatsApp AI Booking Engine</span>
        </div>
        <p>© 2026 Verde AI. Gemaakt voor hardwerkende lokale ondernemers en vakmensen.</p>
      </footer>
    </div>
  );
}
