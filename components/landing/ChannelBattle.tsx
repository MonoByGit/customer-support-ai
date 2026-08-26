"use client";

import React, { useEffect, useRef, useState } from "react";
import { CLAIMS } from "@/lib/evidence";

/**
 * Het strijdtoneel: drie kanalen op één logaritmische tijdas.
 *
 * De log-schaal is de hele truc. Op een lineaire as van 48 uur zou het verschil
 * tussen 30 seconden en 5 minuten onzichtbaar zijn en zou e-mail gewoon "rechts"
 * staan. Logaritmisch zie je precies wat er gebeurt: Verde AI staat aan het begin,
 * de telefoon haalt de eerste minuten niet, en e-mail loopt van het scherm af.
 */

const AXIS_MIN_SECONDS = 10;
const AXIS_MAX_SECONDS = 48 * 3600;

function position(seconds: number): number {
  const lo = Math.log10(AXIS_MIN_SECONDS);
  const hi = Math.log10(AXIS_MAX_SECONDS);
  const v = Math.log10(Math.max(AXIS_MIN_SECONDS, Math.min(AXIS_MAX_SECONDS, seconds)));
  return ((v - lo) / (hi - lo)) * 100;
}

const TICKS = [
  { s: 10, label: "direct" },
  { s: 30, label: "30 sec" },
  { s: 300, label: "5 min" },
  { s: 1800, label: "30 min" },
  { s: 3600, label: "1 uur" },
  { s: 8 * 3600, label: "8 uur" },
  { s: 42 * 3600, label: "42 uur" },
];

interface Lane {
  id: string;
  name: string;
  detail: string;
  /** Waar de reactie landt op de as, in seconden. */
  respondsAt: number;
  /** Deel van de as dat dit kanaal überhaupt niet dekt. */
  deadZone?: { from: number; to: number; note: string };
  tone: "verde" | "phone" | "mail";
  footnote?: string;
}

const LANES: Lane[] = [
  {
    id: "verde",
    name: "Verde AI",
    detail: "Antwoordt terwijl de klant nog op uw site is",
    respondsAt: 30,
    tone: "verde",
  },
  {
    id: "phone",
    name: "Telefoon",
    detail: "Alleen bereikbaar als er iemand vrij is om op te nemen",
    respondsAt: 8 * 3600,
    deadZone: { from: 10, to: 8 * 3600, note: "buiten openingstijd of balie bezet" },
    tone: "phone",
  },
  {
    id: "mail",
    name: "E-mail & contactformulier",
    detail: `Gemiddeld ${CLAIMS.averageResponse.value} — en ${CLAIMS.neverRespond.value} krijgt nooit antwoord`,
    respondsAt: 42 * 3600,
    tone: "mail",
    footnote: CLAIMS.averageResponse.source,
  },
];

const TONE: Record<Lane["tone"], { dot: string; bar: string; text: string }> = {
  verde: {
    dot: "#2196F3",
    bar: "#2196F3",
    text: "#7FC0F7",
  },
  phone: {
    dot: "#94A3B8",
    bar: "#64748B",
    text: "#B6C2D1",
  },
  mail: {
    dot: "#FF9100",
    bar: "#FF9100",
    text: "#FFB65C",
  },
};

export const ChannelBattle: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setArmed(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setArmed(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#050B16] text-[#EAF1FA] py-20 sm:py-28 px-6 sm:px-10"
    >
      <div className="relative max-w-6xl mx-auto">
        <div className="max-w-2xl space-y-4 mb-14 sm:mb-20">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF9100]">
            Het strijdtoneel
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.06] text-balance">
            Uw klant wacht niet.
            <br />
            Uw kanalen wel.
          </h2>
          <p className="text-[#9DB2CC] text-sm sm:text-base leading-relaxed max-w-xl">
            Dezelfde vraag, dezelfde klant, drie manieren om te antwoorden. Hieronder staan ze op
            één tijdas — logaritmisch, anders past het verschil niet op één scherm.
          </p>
        </div>

        {/* Tijdas */}
        <div className="relative mb-3 h-6 select-none pr-6" aria-hidden="true">
          {TICKS.map((t) => (
            <span
              key={t.s}
              className="absolute -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-wider"
              style={{ left: `${position(t.s)}%`, color: "#5C718C" }}
            >
              {t.label}
            </span>
          ))}
        </div>

        <div className="space-y-9 sm:space-y-11">
          {LANES.map((lane, idx) => {
            const tone = TONE[lane.tone];
            const end = position(lane.respondsAt);

            return (
              <div key={lane.id} className="relative">
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <h3
                      className="font-semibold text-base sm:text-lg tracking-tight"
                      style={{ color: tone.text }}
                    >
                      {lane.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#8AA0BC] leading-relaxed mt-0.5">
                      {lane.detail}
                    </p>
                  </div>
                </div>

                {/* Baan */}
                <div className="relative h-11">
                  {/* rails */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/[0.08]" />

                  {/* dode zone: waar dit kanaal simpelweg niet antwoordt */}
                  {lane.deadZone && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-6 rounded-sm border border-dashed border-white/[0.13] flex items-center justify-center overflow-hidden"
                      style={{
                        left: `${position(lane.deadZone.from)}%`,
                        width: `${position(lane.deadZone.to) - position(lane.deadZone.from)}%`,
                        background:
                          "repeating-linear-gradient(135deg, rgba(255,255,255,.045) 0 6px, transparent 6px 12px)",
                        opacity: armed ? 1 : 0,
                        transition: "opacity .7s ease .35s",
                      }}
                    >
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#6E829E] px-2 truncate">
                        {lane.deadZone.note}
                      </span>
                    </div>
                  )}

                  {/* voortgangsbalk tot het moment van antwoorden */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full origin-left"
                    style={{
                      left: 0,
                      width: `${end}%`,
                      background: tone.bar,
                      transform: armed ? "scaleX(1)" : "scaleX(0)",
                      transition: `transform 1.5s ease-out ${idx * 0.22 + 0.1}s`,
                    }}
                  />

                  {/* het moment zelf */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{
                      left: `${end}%`,
                      opacity: armed ? 1 : 0,
                      transform: armed ? "translate(-50%,-50%) scale(1)" : "translate(-50%,-50%) scale(.4)",
                      transition: `opacity .5s ease ${idx * 0.22 + 1.15}s, transform .6s ease-out ${
                        idx * 0.22 + 1.15
                      }s`,
                    }}
                  >
                    <span
                      className="block w-3.5 h-3.5 rounded-full"
                      style={{ background: tone.dot }}
                    />
                  </div>
                </div>

                {lane.footnote && (
                  <p className="font-mono text-[10px] text-[#5C718C] mt-1.5 leading-relaxed">
                    {lane.footnote}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* De conclusie, met bron */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[CLAIMS.respondWithinFive, CLAIMS.qualifyOdds, CLAIMS.neverRespond].map((c, i) => (
            <div
              key={c.id}
              className="rounded-xl border border-white/[0.09] bg-white/[0.03] p-5"
              style={{
                opacity: armed ? 1 : 0,
                transform: armed ? "translateY(0)" : "translateY(14px)",
                transition: `opacity .6s ease ${1.5 + i * 0.13}s, transform .6s ease-out ${
                  1.5 + i * 0.13
                }s`,
              }}
            >
              <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
                {c.value}
              </div>
              <p className="text-[13px] text-[#9DB2CC] leading-relaxed mt-1.5">{c.label}</p>
              <p className="font-mono text-[9.5px] text-[#5C718C] mt-3 leading-relaxed">{c.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
