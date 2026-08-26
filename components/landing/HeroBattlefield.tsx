"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Globe, CheckCheck } from "lucide-react";

/**
 * Bewust rustig.
 *
 * De klok en de beweging zitten in de dag-sectie die hierna komt. Als de hero
 * óók al schreeuwt, landt die niet meer. Hier alleen: wat het is, wat het doet,
 * en een gesprek dat laat horen hoe het klinkt.
 */

const OPENERS = [
  {
    at: 4,
    side: "user" as const,
    text: "Goedenavond, ik loop al drie dagen met flinke kiespijn rond en durf eerlijk gezegd niet zo goed naar de tandarts.",
  },
  {
    at: 3,
    side: "agent" as const,
    text: "Drie dagen is lang om mee rond te lopen. En dat je ertegenop ziet snap ik goed — je bent daar echt niet de enige in.",
  },
  {
    at: 2,
    side: "agent" as const,
    text: "Ik heb morgen om 08:45 een plek waarop we rustig even kunnen kijken, zonder dat er meteen iets moet. Schikt dat?",
  },
];

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export const HeroBattlefield: React.FC = () => {
  const [step, setStep] = useState(0);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setStep(4);
      return;
    }
    const timers = [500, 1200, 1900, 2600].map((ms, i) =>
      setTimeout(() => setStep(i + 1), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const stamp = (minutesAgo: number) => {
    if (!now) return "--:--";
    const t = new Date(now.getTime() - minutesAgo * 60000);
    return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
  };

  return (
    <section className="bg-[#0B1220] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-6 lg:col-span-7">
            <p className="font-mono text-[11px] uppercase text-[#93A6C0]">
              WhatsApp-assistent voor praktijken, salons en installateurs
            </p>

            <h1 className="max-w-[17ch] text-balance text-4xl font-bold leading-[1.08] sm:text-6xl">
              De vraag komt om kwart over tien &apos;s avonds.
            </h1>

            <p className="max-w-[46ch] text-pretty text-base leading-relaxed text-[#93A6C0] sm:text-lg">
              Verde AI voert het gesprek, luistert naar wat er werkelijk gevraagd wordt,
              kijkt in uw agenda en legt de afspraak vast. Ook als u allang dicht bent.
            </p>

            <form
              action="/admin"
              method="GET"
              className="flex max-w-lg flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-2 sm:flex-row"
            >
              <div className="relative flex flex-1 items-center">
                <Globe className="absolute left-3.5 size-4 text-[#6E829E]" aria-hidden="true" />
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
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#2196F3] px-5 py-2.5 text-sm font-semibold text-white transition-opacity duration-150 ease-out hover:opacity-90"
              >
                Bouw mijn assistent
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </form>

            <p className="font-mono text-[11px] text-[#5C718C]">
              Binnen tien seconden klaar · geen creditcard · uw eigen diensten en tarieven
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="mx-auto max-w-[400px] overflow-hidden rounded-2xl border border-white/10">
              <div className="flex items-center gap-2.5 bg-[#0D47A1] px-4 py-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#2196F3] text-[11px] font-bold text-white">
                  TG
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-white">
                    Tandartspraktijk De Groene Gracht
                  </p>
                  <p className="text-[10.5px] text-blue-200">
                    {step < 3 ? "aan het typen…" : "Online · beantwoordt direct"}
                  </p>
                </div>
              </div>

              <div className="whatsapp-bg space-y-2.5 px-3.5 py-4">
                {OPENERS.map((m, i) => (
                  <div
                    key={m.at}
                    className={`flex ${m.side === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-xl px-3.5 py-2 text-[13.5px] leading-relaxed shadow-sm transition-[opacity,transform] duration-200 ease-out ${
                        m.side === "user"
                          ? "rounded-tr-sm wa-bubble-out"
                          : "rounded-tl-sm wa-bubble-in"
                      }`}
                      style={{
                        opacity: step > i ? 1 : 0,
                        transform: step > i ? "none" : "translateY(8px)",
                      }}
                    >
                      {m.text}
                      <span className="wa-muted mt-0.5 block text-right text-[10px] tabular-nums">
                        {stamp(m.at)}
                      </span>
                    </div>
                  </div>
                ))}

                <div
                  className="wa-bubble-in overflow-hidden rounded-xl rounded-tl-sm shadow-sm transition-[opacity,transform] duration-200 ease-out"
                  style={{
                    opacity: step >= 4 ? 1 : 0,
                    transform: step >= 4 ? "none" : "translateY(8px)",
                  }}
                >
                  <div className="bg-[#0A192F] px-4 py-3">
                    <span className="block font-mono text-[9.5px] uppercase text-[#8FB6E0]">
                      Vastgelegd in de agenda
                    </span>
                    <span className="mt-1 block text-[15px] font-semibold text-white">
                      Morgen 08:45 · rustig consult
                    </span>
                  </div>
                  <p className="wa-muted flex items-center gap-1.5 px-4 py-2.5 text-[11px]">
                    <CheckCheck className="wa-tick size-3.5" aria-hidden="true" />
                    Bevestiging en herinnering verstuurd
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
