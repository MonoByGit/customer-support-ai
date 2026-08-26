"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe, CheckCheck } from "lucide-react";

const REFERENCE_SLUG = "tandartspraktijk-amsterdam";

/** Openingstijden waar de hero zich naar voegt. */
const OPEN_FROM = 8 * 60 + 30;
const OPEN_UNTIL = 17 * 60 + 30;

interface Framing {
  state: string;
  head: string;
  sub: string;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

/**
 * De kop verandert met het uur waarop iemand de pagina opent.
 *
 * Dat is niet decoratief: het hele product gaat over het moment waarop een
 * praktijk niet bereikbaar is. Wie 's avonds kijkt, leest daarom een andere
 * pagina dan wie op dinsdagochtend kijkt — en herkent zijn eigen situatie.
 */
function framingFor(d: Date): Framing {
  const day = d.getDay();
  const minutes = d.getHours() * 60 + d.getMinutes();
  const isWeekend = day === 0 || day === 6;
  const isOpen = !isWeekend && minutes >= OPEN_FROM && minutes < OPEN_UNTIL;

  if (isWeekend) {
    return {
      state: "Weekend",
      head: "Het is weekend. Uw agenda niet.",
      sub: "Wie nu met kiespijn zoekt, wacht niet tot maandag. Die appt de praktijk die wél antwoordt.",
    };
  }
  if (isOpen) {
    return {
      state: "Balie bezet",
      head: "Uw balie is nu aan het werk.",
      sub: "Elke keer dat de telefoon overgaat tijdens een behandeling, kiest iemand tussen wachten en verder zoeken.",
    };
  }
  if (minutes < OPEN_FROM) {
    return {
      state: "Nog gesloten",
      head: "U opent pas over een paar uur.",
      sub: "De aanvragen van vannacht liggen te wachten. De mensen erachter meestal niet.",
    };
  }
  const hoursClosed = Math.max(1, d.getHours() - 17);
  return {
    state: "Praktijk gesloten",
    head:
      hoursClosed > 1
        ? `Uw praktijk is al ${hoursClosed} uur dicht.`
        : "Uw praktijk is net gesloten.",
    sub: "Vanaf nu tot morgenochtend beantwoordt niemand meer een vraag. Behalve wie het geregeld heeft.",
  };
}

export const HeroBattlefield: React.FC = () => {
  const [now, setNow] = useState<Date | null>(null);
  const [depth, setDepth] = useState(0);
  const [step, setStep] = useState(0);
  const reduced = useRef(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Klok
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);

  // Parallax: één rAF-gebonden scrollwaarde die alle lagen aanstuurt.
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // 0 bovenaan, 1 wanneer de sectie er net uit is
        const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
        setDepth(p);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Het gesprek rechts komt binnen zodra de pagina staat.
  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (r) {
      setStep(4);
      return;
    }
    const timers = [700, 1500, 2400, 3200].map((ms, i) =>
      setTimeout(() => setStep(i + 1), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const framing = now ? framingFor(now) : null;
  const hh = now ? pad(now.getHours()) : "--";
  const mm = now ? pad(now.getMinutes()) : "--";

  const stamp = (minutesAgo: number) => {
    if (!now) return "--:--";
    const t = new Date(now.getTime() - minutesAgo * 60000);
    return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050B16] text-[#EAF1FA]"
    >
      {/* Laag 1 — diepste gloed, beweegt het traagst */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(85% 70% at 22% 6%, rgba(33,150,243,.22), transparent 62%), radial-gradient(60% 45% at 92% 88%, rgba(255,145,0,.10), transparent 60%)",
          transform: `translate3d(0, ${depth * 40}px, 0)`,
        }}
      />

      {/* Laag 2 — rasterlijnen, beweegt sneller: geeft de diepte weg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(70% 60% at 40% 30%, #000 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 40% 30%, #000 30%, transparent 78%)",
          transform: `translate3d(0, ${depth * 110}px, 0)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 pt-16 sm:pt-24 pb-20 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* ---------------- links: de bewering ---------------- */}
          <div
            className="lg:col-span-7 space-y-6"
            style={{ transform: `translate3d(0, ${depth * -26}px, 0)` }}
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-[#FF9100]/30 bg-[#FF9100]/[0.07] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#FFB65C]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF9100] opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF9100]" />
              </span>
              {framing ? framing.state : "Verbinden"}
            </span>

            <div>
              <span className="block font-mono text-[clamp(72px,14vw,168px)] font-bold leading-[0.84] tracking-[-0.045em] tabular-nums text-white">
                {hh}
                <span className="text-[#2196F3]">:{mm}</span>
              </span>
            </div>

            <h1 className="max-w-[19ch] text-[clamp(24px,3.4vw,40px)] font-bold leading-[1.15] tracking-tight text-balance">
              {framing ? framing.head : " "}
            </h1>

            <p className="max-w-[44ch] text-sm sm:text-base leading-relaxed text-[#9DB2CC]">
              {framing ? framing.sub : " "}
            </p>

            <form
              action="/admin"
              method="GET"
              className="flex max-w-lg flex-col gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] p-2 backdrop-blur-sm sm:flex-row"
            >
              <div className="relative flex flex-1 items-center">
                <Globe className="absolute left-3.5 h-4 w-4 text-[#6E829E]" />
                <label htmlFor="hero-url" className="sr-only">
                  Website van uw bedrijf
                </label>
                <input
                  id="hero-url"
                  type="text"
                  name="url"
                  placeholder="https://uwpraktijk.nl"
                  className="w-full bg-transparent py-2 pl-10 pr-3 text-sm font-medium text-white outline-none placeholder:text-[#5C718C]"
                />
              </div>
              <button
                type="submit"
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#2196F3] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1E88E5] active:scale-95"
              >
                Bouw mijn assistent
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="font-mono text-[11px] text-[#5C718C]">
              Binnen tien seconden klaar · geen creditcard · uw eigen diensten en tarieven
            </p>
          </div>

          {/* ---------------- rechts: het bewijs ---------------- */}
          <div
            className="lg:col-span-5"
            style={{ transform: `translate3d(0, ${depth * 34}px, 0)` }}
          >
            <div className="mx-auto max-w-[400px] overflow-hidden rounded-2xl border border-white/[0.1] shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)]">
              <div className="flex items-center justify-between bg-[#0D47A1] px-4 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#2196F3] text-[11px] font-bold text-white">
                    TG
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-white">
                      Tandartspraktijk De Groene Gracht
                    </p>
                    <p className="text-[10.5px] text-blue-200">
                      {step < 4 ? "aan het typen…" : "Online · beantwoordt direct"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="whatsapp-bg space-y-2.5 px-3.5 py-4">
                <p className="text-center">
                  <span className="rounded-md bg-[var(--wa-notice)] px-2.5 py-1 text-[10px] text-[#5B6169]">
                    Op ditzelfde moment
                  </span>
                </p>

                <Bubble side="user" show={step >= 1} time={stamp(3)}>
                  Goedenavond, ik loop al drie dagen met kiespijn en durf eerlijk gezegd niet zo
                  goed naar de tandarts.
                </Bubble>

                <Bubble side="agent" show={step >= 2} time={stamp(2)}>
                  Drie dagen is lang om mee rond te lopen. En dat je ertegenop ziet snap ik goed —
                  je bent daar echt niet de enige in.
                </Bubble>

                <Bubble side="agent" show={step >= 3} time={stamp(1)}>
                  Ik heb morgen om 08:45 een plek waarop we rustig even kunnen kijken, zonder dat
                  er meteen iets moet. Schikt dat?
                </Bubble>

                <div
                  className="overflow-hidden rounded-xl rounded-tl-sm wa-bubble-in shadow-sm"
                  style={{
                    opacity: step >= 4 ? 1 : 0,
                    transform: step >= 4 ? "translateY(0)" : "translateY(10px)",
                    transition: "opacity .45s ease, transform .45s cubic-bezier(.16,1,.3,1)",
                  }}
                >
                  <div className="bg-gradient-to-br from-[#0A192F] to-[#123258] px-4 py-3">
                    <span className="block font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#8FB6E0]">
                      Vastgelegd in de agenda
                    </span>
                    <span className="mt-1 block text-[15px] font-semibold text-white">
                      Morgen 08:45 · rustig consult
                    </span>
                  </div>
                  <p className="flex items-center gap-1.5 px-4 py-2.5 text-[11px] wa-muted">
                    <CheckCheck className="h-3.5 w-3.5 text-[#2196F3]" />
                    Bevestiging en herinnering verstuurd
                  </p>
                </div>
              </div>
            </div>

            <p className="mx-auto mt-4 max-w-[400px] text-center font-mono text-[10.5px] leading-relaxed text-[#5C718C]">
              Een echt gesprek met onze assistent. Eerst opvangen, dan pas plannen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

function Bubble({
  side,
  show,
  time,
  children,
}: {
  side: "user" | "agent";
  show: boolean;
  time: string;
  children: React.ReactNode;
}) {
  const isUser = side === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-xl px-3.5 py-2 text-[13.5px] leading-relaxed shadow-sm ${
          isUser
            ? "rounded-tr-sm bg-[var(--wa-bubble-out)] text-[var(--wa-text)]"
            : "rounded-tl-sm wa-bubble-in"
        }`}
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(10px)",
          transition: "opacity .45s ease, transform .45s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {children}
        <span className="mt-0.5 block text-right text-[10px] tabular-nums text-[#8D9299]">
          {time}
        </span>
      </div>
    </div>
  );
}
