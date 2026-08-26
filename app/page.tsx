import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Globe,
  ShieldCheck,
  Clock,
  TrendingDown,
  PhoneOff,
  CalendarCheck,
} from "lucide-react";
import { HeroInteractivePhone } from "@/components/landing/HeroInteractivePhone";
import { IndustryTabs } from "@/components/landing/IndustryTabs";
import { LiveQrSection } from "@/components/landing/LiveQrSection";
import { RoiCalculator } from "@/components/landing/RoiCalculator";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { FloatingWhatsAppWidget } from "@/components/landing/FloatingWhatsAppWidget";
import { BrandLogo } from "@/components/ui/BrandLogo";

const REFERENCE_SLUG = "tandartspraktijk-amsterdam";

const PROOF_POINTS = [
  {
    icon: TrendingDown,
    stat: "68%",
    label: "van de contactformulieren wordt nooit ingevuld",
    source: "Bezoekers haken af op een formulier dat pas morgen antwoord geeft.",
  },
  {
    icon: Clock,
    stat: "98%",
    label: "open rate op WhatsApp binnen 3 minuten",
    source: "E-mail blijft steken rond de 20%, en dan pas uren later.",
  },
  {
    icon: PhoneOff,
    stat: "41%",
    label: "van de inkomende telefoontjes valt buiten openingstijden",
    source: "Precies de uren waarin uw balie leeg is en uw concurrent wel opneemt.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Klant opent WhatsApp",
    body: "Via de knop op uw website, een QR-code op de balie of een advertentie start de bezoeker een laagdrempelig gesprek.",
  },
  {
    n: "02",
    title: "AI leest uw agenda",
    body: "Verde AI controleert realtime uw werkelijke beschikbaarheid en stelt twee concrete tijdstippen voor.",
  },
  {
    n: "03",
    title: "Klant bevestigt met één tik",
    body: "Via WhatsApp Interactive Buttons kiest de klant het tijdslot en geeft naam en telefoonnummer door.",
  },
  {
    n: "04",
    title: "Tweewegs synchronisatie",
    body: "De afspraak staat definitief in Google Agenda en de klant krijgt automatisch bevestiging en herinnering.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#07090E] text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Zachte ambient belichting in primair Azure */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#2196F3]/10 dark:from-[#2196F3]/15 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="border-b border-slate-200/80 dark:border-white/[0.07] bg-white/90 dark:bg-[#0C0F17]/90 backdrop-blur-xl sticky top-0 z-40 px-6 sm:px-10 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <BrandLogo className="w-8 h-8 shrink-0" />
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Verde AI
              </span>
              <span className="hidden lg:inline-block ml-2 text-[10px] bg-[#2196F3]/10 text-[#2196F3] font-semibold px-2 py-0.5 rounded-md border border-[#2196F3]/20 uppercase tracking-wider">
                WhatsApp Boekingsengine
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <a href="#werking" className="hover:text-slate-900 dark:hover:text-white transition-colors">Werking</a>
            <a href="#branches" className="hover:text-slate-900 dark:hover:text-white transition-colors">Branches</a>
            <a href="#rendement" className="hover:text-slate-900 dark:hover:text-white transition-colors">Rendement</a>
            <a href="#tarieven" className="hover:text-slate-900 dark:hover:text-white transition-colors">Tarieven</a>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href={`/live/${REFERENCE_SLUG}`}
              className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200/80 dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/[0.08] px-3.5 py-2 rounded-lg transition-all hidden sm:inline-flex"
            >
              Live simulator
            </Link>

            <Link
              href="/admin"
              className="bg-[#2196F3] hover:bg-[#1E88E5] active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Start AI Bedrijfsscan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 sm:px-10 pt-12 sm:pt-20 pb-16 sm:pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-[#2196F3]/10 border border-[#2196F3]/25 text-[#2196F3] px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DeepSeek Flash V4 · Google Agenda · Meta WhatsApp Cloud API</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              Uw website vangt bezoekers.{" "}
              <span className="text-[#2196F3]">Verde AI vangt afspraken.</span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Vier op de tien geïnteresseerden kijken buiten kantoortijden op uw site en haken af
              op een statisch contactformulier. Verde AI voert het gesprek, controleert uw agenda
              en legt de afspraak vast — 24 uur per dag, in uw eigen tone of voice.
            </p>

            {/* Primaire conversieactie */}
            <div className="pt-2 max-w-lg">
              <form
                action="/admin"
                method="GET"
                className="bg-white dark:bg-[#0F131C] p-2 rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-lg flex flex-col sm:flex-row gap-2"
              >
                <div className="flex-1 relative flex items-center">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <label htmlFor="hero-url" className="sr-only">
                    Website van uw bedrijf
                  </label>
                  <input
                    id="hero-url"
                    type="text"
                    name="url"
                    placeholder="https://uwbedrijf.nl"
                    className="w-full bg-transparent pl-10 pr-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#2196F3] hover:bg-[#1E88E5] active:scale-95 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
                >
                  <span>Bouw mijn assistent</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-2.5 px-1 font-medium">
                <span>✓ Binnen 10 seconden klaar</span>
                <span>✓ Geen creditcard</span>
                <span>✓ Uw eigen diensten en tarieven</span>
              </div>
            </div>

            {/* Kerncijfers */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200 dark:border-white/[0.08] max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono">98%</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Open rate op WhatsApp</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono">&lt; 30 sec</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Gemiddelde boekingstijd</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-[#FF9100] font-mono">24/7</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Ook 's avonds en in het weekend</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <HeroInteractivePhone />
          </div>
        </div>
      </section>

      {/* Branchestrip */}
      <section className="border-y border-slate-200/80 dark:border-white/[0.07] bg-white/60 dark:bg-[#0C0F17]/60 py-5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 sm:gap-x-12 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <span>Tandartspraktijken</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Klinieken &amp; zorg</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Kapsalons &amp; beauty</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Installateurs &amp; loodgieters</span>
        </div>
      </section>

      {/* Het probleem, in cijfers */}
      <section className="px-6 sm:px-10 py-20 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#2196F3] uppercase tracking-wider">Het lek</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            U betaalt al voor het verkeer. Het lek zit in de opvolging.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PROOF_POINTS.map((p) => (
            <div key={p.stat} className="pro-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF9100]/10 text-[#FF9100] flex items-center justify-center">
                <p.icon className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
                {p.stat}
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                {p.label}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{p.source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proces */}
      <section id="werking" className="px-6 sm:px-10 py-20 max-w-6xl mx-auto space-y-12 scroll-mt-24 border-t border-slate-200/80 dark:border-white/[0.07]">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#2196F3] uppercase tracking-wider">Werking</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Van websitebezoeker naar agenda-afspraak in vier stappen
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="pro-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#2196F3]/10 text-[#2196F3] font-mono font-bold flex items-center justify-center text-sm">
                {s.n}
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{s.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Zelf testen via QR */}
      <div className="border-t border-slate-200/80 dark:border-white/[0.07] bg-white/40 dark:bg-[#0A0D14]/40">
        <LiveQrSection />
      </div>

      {/* Branches */}
      <section id="branches" className="py-16 border-t border-slate-200/80 dark:border-white/[0.07] scroll-mt-24">
        <IndustryTabs />
      </section>

      {/* Rendement */}
      <section id="rendement" className="px-6 sm:px-10 py-20 max-w-6xl mx-auto border-t border-slate-200/80 dark:border-white/[0.07] scroll-mt-24">
        <RoiCalculator />
      </section>

      {/* Garantie */}
      <section className="px-6 sm:px-10 pb-4 max-w-4xl mx-auto">
        <div className="pro-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 border-[#FF9100]/30">
          <div className="w-12 h-12 rounded-xl bg-[#FF9100]/10 text-[#FF9100] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
              Rendementsgarantie: 60 dagen, of u krijgt uw geld terug
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Levert Verde AI in de eerste 60 dagen niet minimaal het abonnementsbedrag aan extra
              geboekte afspraken op, dan storten wij het volledige bedrag terug. Geen kleine
              lettertjes, geen opzegtermijn — u zegt op wanneer u wilt.
            </p>
          </div>
        </div>
      </section>

      {/* Tarieven */}
      <section id="tarieven" className="py-20 border-t border-slate-200/80 dark:border-white/[0.07] bg-white/40 dark:bg-[#0A0D14]/40 scroll-mt-24">
        <PricingSection />
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-slate-200/80 dark:border-white/[0.07]">
        <FaqAccordion />
      </section>

      {/* Slot-CTA */}
      <section className="px-6 sm:px-10 py-20 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#0D47A1] to-[#0A192F] border border-[#2196F3]/30 text-white rounded-2xl p-8 sm:p-12 space-y-6 shadow-xl">
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[11px] font-semibold">
              <CalendarCheck className="w-3.5 h-3.5 text-[#FF9100]" />
              <span>Binnen twee minuten live op uw eigen website</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Elke avond zonder Verde AI is een avond met gemiste afspraken
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Voer uw website-URL in en zie binnen tien seconden een werkende assistent met uw
              eigen diensten, tarieven en openingstijden.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/admin"
              className="bg-[#2196F3] hover:bg-[#1E88E5] active:scale-95 text-white font-semibold px-8 py-3.5 rounded-lg text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Start de AI Bedrijfsscan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={`/live/${REFERENCE_SLUG}`}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-lg text-sm transition-all"
            >
              Eerst de simulator proberen
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0C0F17] py-8 px-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-800 dark:text-slate-200 font-semibold text-sm">
          <BrandLogo className="w-4 h-4" />
          <span>Verde AI · WhatsApp Boekingsengine</span>
        </div>
        <p>© 2026 Verde AI. Alle rechten voorbehouden. AVG-conform verwerkt binnen de EU.</p>
      </footer>

      {/* Vaste mobiele conversiebalk */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0C0F17]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/[0.08] px-4 py-3 flex items-center gap-3">
        <Link
          href={`/live/${REFERENCE_SLUG}`}
          className="flex-1 text-center text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] py-2.5 rounded-lg"
        >
          Simulator
        </Link>
        <Link
          href="/admin"
          className="flex-[1.4] text-center bg-[#2196F3] active:scale-95 text-white text-xs font-semibold py-2.5 rounded-lg shadow-xs transition-transform"
        >
          Start AI Bedrijfsscan
        </Link>
      </div>

      <FloatingWhatsAppWidget />
    </div>
  );
}
