"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { CLAIMS } from "@/lib/evidence";

/**
 * Scrollen ís de dag.
 *
 * Geen sectie óver bereikbaarheid: de scrollpositie is de klok. Boven is het
 * 08:00, onder is het middernacht. Onderweg komen er mensen binnen met een
 * vraag, gaat de praktijk om 17:30 dicht, en zie je wat er daarna met die
 * vragen gebeurt. De bezoeker leest niet dat er iets misgaat — hij kijkt ernaar.
 *
 * Bewust geen gradients of gloed: dat zijn de signalen die een pagina er
 * gegenereerd uit laten zien. De beweging komt uit de compositie, niet uit
 * effecten. Alleen transform en opacity, zodat het op de compositor blijft.
 */

const DAY_START = 8 * 60; // 08:00
const DAY_END = 24 * 60; // 00:00
const CLOSING = 17 * 60 + 30; // 17:30

interface Arrival {
  /** Minuten sinds middernacht. */
  at: number;
  who: string;
  asks: string;
}

const ARRIVALS: Arrival[] = [
  { at: 8 * 60 + 40, who: "Bezoeker uit Amsterdam-Zuid", asks: "Nemen jullie nog nieuwe patiënten aan?" },
  { at: 10 * 60 + 15, who: "Bezoeker via Google", asks: "Wat kost een controle bij jullie?" },
  { at: 12 * 60 + 5, who: "Bezoeker op mobiel", asks: "Kan ik vanmiddag nog terecht? Ik heb pijn." },
  { at: 15 * 60 + 50, who: "Bezoeker uit Oud-West", asks: "Hebben jullie zaterdag open?" },
  { at: 18 * 60 + 20, who: "Bezoeker op mobiel", asks: "Al twee dagen kiespijn. Kan ik morgen langskomen?" },
  { at: 20 * 60 + 45, who: "Bezoeker via Instagram", asks: "Doen jullie ook bleken? En wat kost dat?" },
  { at: 22 * 60 + 30, who: "Bezoeker uit Amsterdam-Noord", asks: "Spoed! Stuk afgebroken tand." },
];

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function clockFrom(minutes: number) {
  const m = Math.round(minutes);
  return `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;
}

export const DayInPractice: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Scrollvoortgang wordt de tijd van de dag.
  const minutes = useTransform(scrollYProgress, [0, 1], [DAY_START, DAY_END]);

  const [now, setNow] = useState(DAY_START);
  useMotionValueEvent(minutes, "change", (v) => setNow(v));

  // Nachtlaag eroverheen: alleen opacity, dus compositor-veilig.
  const night = useTransform(
    scrollYProgress,
    [0, 0.42, 0.62, 1],
    [0, 0.15, 0.82, 0.97]
  );

  const isClosed = now >= CLOSING;
  const missed = ARRIVALS.filter((a) => a.at <= now && a.at >= CLOSING).length;
  const answeredByStaff = ARRIVALS.filter((a) => a.at <= now && a.at < CLOSING).length;

  return (
    <section
      ref={ref}
      aria-label="Een werkdag in uw praktijk"
      className="relative"
      style={{ height: reduced ? "auto" : "420vh" }}
    >
      <div
        className={
          reduced
            ? "relative overflow-hidden bg-[#0B1220] text-white"
            : "sticky top-0 h-dvh overflow-hidden bg-[#0B1220] text-white"
        }
      >
        {/* Nacht valt in. Twee vlakken, alleen opacity ertussen. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[#03070E]"
          style={{ opacity: reduced ? 0.9 : (night as MotionValue<number>) }}
        />

        <div className="relative z-10 mx-auto grid h-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* ---------------- links: de klok en de stand ---------------- */}
          <div className="space-y-6">
            <p className="font-mono text-[11px] uppercase text-[#93A6C0]">
              Een dinsdag in uw praktijk
            </p>

            <p className="font-mono text-[clamp(64px,11vw,132px)] font-bold leading-none tabular-nums">
              {clockFrom(now)}
            </p>

            <p
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase ${
                isClosed
                  ? "border-[#FF9100]/40 text-[#FFB65C]"
                  : "border-white/20 text-[#C6D4E6]"
              }`}
            >
              {isClosed ? "Gesloten sinds 17:30" : "Balie bemand"}
            </p>

            <h2 className="max-w-[16ch] text-pretty text-2xl font-bold sm:text-4xl">
              {isClosed
                ? "Vanaf nu antwoordt er niemand meer."
                : "Overdag lukt het nog. Meestal."}
            </h2>

            {/* De teller die oploopt terwijl je kijkt */}
            <div className="flex gap-8 border-t border-white/10 pt-5">
              <div>
                <p className="font-mono text-3xl font-bold tabular-nums text-[#7FC0F7]">
                  {answeredByStaff}
                </p>
                <p className="mt-1 text-xs text-[#93A6C0]">
                  door de balie opgepakt
                </p>
              </div>
              <div>
                <p
                  className={`font-mono text-3xl font-bold tabular-nums ${
                    missed > 0 ? "text-[#FF9100]" : "text-white/40"
                  }`}
                >
                  {missed}
                </p>
                <p className="mt-1 text-xs text-[#93A6C0]">
                  blijft liggen tot morgen
                </p>
              </div>
            </div>

            <p className="max-w-[38ch] text-pretty text-sm text-[#93A6C0]">
              Onderzoek naar het opvolgen van online aanvragen: gemiddeld{" "}
              <span className="text-white">{CLAIMS.averageResponse.value}</span> voordat er
              gereageerd wordt, en{" "}
              <span className="text-white">{CLAIMS.neverRespond.value}</span> krijgt nooit
              antwoord.
            </p>
          </div>

          {/* ---------------- rechts: wie er binnenkomt ---------------- */}
          <ol className="relative max-h-full space-y-2.5 overflow-hidden">
            {ARRIVALS.map((a) => (
              <ArrivalRow key={a.at} arrival={a} now={now} closing={CLOSING} />
            ))}
          </ol>
        </div>

        {/* Slot: pas onderaan, als de dag voorbij is */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#03070E]/90 px-6 py-5 sm:px-10"
          style={{
            opacity: useTransform(scrollYProgress, [0.86, 0.97], [0, 1]),
          }}
        >
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-pretty text-sm text-[#C6D4E6]">
              <span className="font-semibold text-white">Zeven vragen vandaag.</span> Drie
              daarvan kwamen binnen toen u dicht was.
            </p>
            <Link
              href="/admin"
              className="shrink-0 rounded-lg bg-[#2196F3] px-5 py-2.5 text-sm font-semibold text-white transition-opacity duration-150 ease-out hover:opacity-90"
            >
              Zet de assistent aan
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

function ArrivalRow({
  arrival,
  now,
  closing,
}: {
  arrival: Arrival;
  now: number;
  closing: number;
}) {
  const arrived = now >= arrival.at;
  const afterHours = arrival.at >= closing;
  // Overdag pakt de balie het na een kwartier op; 's avonds gebeurt er niets.
  const handled = arrived && !afterHours && now >= arrival.at + 15;
  const abandoned = arrived && afterHours && now >= arrival.at + 20;

  return (
    <li
      className="rounded-lg border px-4 py-3 transition-[opacity,transform] duration-200 ease-out"
      style={{
        opacity: arrived ? (abandoned ? 0.32 : 1) : 0,
        transform: arrived ? "none" : "translateY(8px)",
        borderColor: abandoned
          ? "rgba(255,145,0,.35)"
          : handled
          ? "rgba(33,150,243,.3)"
          : "rgba(255,255,255,.12)",
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[11px] tabular-nums text-[#93A6C0]">
          {clockFrom(arrival.at)}
        </span>
        <span
          className={`font-mono text-[10px] uppercase ${
            abandoned
              ? "text-[#FF9100]"
              : handled
              ? "text-[#7FC0F7]"
              : "text-[#6E829E]"
          }`}
        >
          {abandoned
            ? "vertrokken"
            : handled
            ? "opgepakt"
            : arrived
            ? "wacht"
            : ""}
        </span>
      </div>

      <p
        className={`mt-1 text-pretty text-sm ${
          abandoned ? "text-[#93A6C0] line-through decoration-[#FF9100]/50" : "text-white"
        }`}
      >
        {arrival.asks}
      </p>
      <p className="mt-0.5 truncate text-[11px] text-[#6E829E]">{arrival.who}</p>
    </li>
  );
}
