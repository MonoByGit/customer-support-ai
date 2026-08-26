"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Waar het product écht om draait.
 *
 * Beide antwoorden hieronder zijn echt: links wat onze eigen assistent
 * teruggaf vóór het gespreksprotocol, rechts wat hij nu teruggeeft op exact
 * dezelfde vraag. Geen opgepoetst voorbeeld — het verschil is het product.
 */

const PROMPT = "Ik loop al drie dagen met flinke kiespijn rond en durf eerlijk gezegd niet zo goed naar de tandarts.";

const BEFORE = `Wat ontzettend vervelend dat u kiespijn heeft! 😟 Geen zorgen, wij gaan dit zo snel mogelijk voor u verhelpen.

Om u het beste te helpen:
• **Spoedconsult** — €45,00 (30 min)
• **Periodieke controle** — €27,50 (30 min)

Wilt u een afspraak inplannen? Wij hebben morgen om 10:00 uur en 14:00 uur plek! 🦷`;

const AFTER = `Drie dagen flinke kiespijn, dat klinkt niet als iets om mee te blijven rondlopen. En die spanning ervoor snap ik heel goed, je bent echt niet de enige die dat heeft.

Wat voor pijn is het precies? Is het een zeurende pijn of juist een stekende, en wordt het erger als je ergens op bijt?`;

const TELLS = [
  { label: "Opent met een sjabloonzin", before: true, after: false },
  { label: "Benoemt wat de klant écht zei", before: false, after: true },
  { label: "Hoort de aarzeling die er niet als vraag stond", before: false, after: true },
  { label: "Duwt meteen naar een tijdslot", before: true, after: false },
  { label: "Stelt één vraag in plaats van een rijtje", before: false, after: true },
  { label: "Prijslijst vóór er iets gevraagd is", before: true, after: false },
];

export const PersonalitySection: React.FC = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setArmed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setArmed(true);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.2 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="border-t border-slate-200/80 dark:border-white/[0.07] px-6 sm:px-10 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl space-y-4 mb-12 sm:mb-16">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2196F3]">
            Wat u eigenlijk koopt
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.06] text-slate-900 dark:text-white text-balance">
            Snel antwoorden kan iedereen.
            <br />
            Goed luisteren niet.
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400 max-w-xl">
            Dit zijn twee echte antwoorden van onze eigen assistent op dezelfde vraag — links
            vóór wij het gespreksprotocol schreven, rechts erna. Het verschil is niet de techniek.
          </p>
        </div>

        {/* De vraag */}
        <div className="mx-auto mb-8 max-w-2xl">
          <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-slate-400">
            De klant stuurt
          </p>
          <div className="whatsapp-bg rounded-xl p-4">
            <div className="ml-auto max-w-[92%] rounded-xl rounded-tr-sm wa-bubble-out px-3.5 py-2.5 text-[13.5px] leading-relaxed shadow-sm">
              {PROMPT}
            </div>
          </div>
        </div>

        {/* De twee antwoorden */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Answer
            armed={armed}
            delay={0}
            kind="before"
            title="Een gewone chatbot"
            caption="Vriendelijk bedoeld, maar het is een formulier met emoji"
            body={BEFORE}
          />
          <Answer
            armed={armed}
            delay={0.14}
            kind="after"
            title="Verde AI"
            caption="Eerst opvangen. Het tijdslot komt later vanzelf"
            body={AFTER}
          />
        </div>

        {/* Waar je het aan ziet */}
        <div className="mt-12 overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
          <div className="grid grid-cols-[minmax(0,1fr)_72px_72px] items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
              Waar je het aan ziet
            </span>
            <span className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">
              Bot
            </span>
            <span className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-[#2196F3]">
              Verde
            </span>
          </div>

          {TELLS.map((t, i) => (
            <div
              key={t.label}
              className="grid grid-cols-[minmax(0,1fr)_72px_72px] items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-white/[0.05]"
              style={{
                opacity: armed ? 1 : 0,
                transform: armed ? "translateY(0)" : "translateY(8px)",
                transition: `opacity .45s ease ${0.5 + i * 0.06}s, transform .45s cubic-bezier(.16,1,.3,1) ${
                  0.5 + i * 0.06
                }s`,
              }}
            >
              <span className="text-[13px] text-slate-700 dark:text-slate-300">{t.label}</span>
              <Mark on={t.before} tone="bad" />
              <Mark on={t.after} tone="good" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

function Mark({ on, tone }: { on: boolean; tone: "good" | "bad" }) {
  if (!on) {
    return <span className="text-center text-slate-300 dark:text-slate-700">·</span>;
  }
  const color = tone === "good" ? "#2196F3" : "#FF9100";
  return (
    <span className="flex justify-center">
      <span
        className="grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold text-white"
        style={{ background: color }}
        aria-hidden="true"
      >
        {tone === "good" ? "✓" : "!"}
      </span>
      <span className="sr-only">{tone === "good" ? "ja" : "ja, en dat is het probleem"}</span>
    </span>
  );
}

function Answer({
  armed,
  delay,
  kind,
  title,
  caption,
  body,
}: {
  armed: boolean;
  delay: number;
  kind: "before" | "after";
  title: string;
  caption: string;
  body: string;
}) {
  const isAfter = kind === "after";
  return (
    <div
      className={`overflow-hidden rounded-xl border ${
        isAfter
          ? "border-[#2196F3]/35 bg-[#2196F3]/[0.03]"
          : "border-slate-200 dark:border-white/[0.08]"
      }`}
      style={{
        opacity: armed ? 1 : 0,
        transform: armed ? "translateY(0)" : "translateY(16px)",
        transition: `opacity .6s ease ${delay}s, transform .6s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 px-4 py-3 dark:border-white/[0.06]">
        <div>
          <h3
            className={`text-sm font-bold tracking-tight ${
              isAfter ? "text-[#2196F3]" : "text-slate-700 dark:text-slate-300"
            }`}
          >
            {title}
          </h3>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">
            {caption}
          </p>
        </div>
      </div>

      <div className="whatsapp-bg p-4">
        <div className="max-w-[94%] rounded-xl rounded-tl-sm wa-bubble-in px-3.5 py-3 text-[13.5px] leading-relaxed shadow-sm whitespace-pre-line">
          {body}
        </div>
      </div>
    </div>
  );
}
