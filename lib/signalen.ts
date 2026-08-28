import fs from "fs";
import path from "path";
import { readEnv } from "./env";
import { ClientSession, listAllSessions, saveSession } from "./session-store";

/**
 * Signalen-laag: "er zit zoveel data tussen de regels".
 *
 * Elk afgerond gesprek krijgt één label-analyse (klacht/kans/spoed, onderwerp,
 * sentiment, aangedragen oplossing, en of er iets gevraagd werd dat de zaak
 * niet aanbiedt). Labels worden in het sessiebestand gecachet zodat elke
 * sessie hooguit één keer door het model gaat. Zonder DeepSeek-sleutel valt
 * de analyse terug op een eerlijke trefwoord-heuristiek — nooit verzonnen
 * cijfers, wel eenvoudiger labels.
 */
export interface Signaal {
  categorie: "klacht" | "kans" | "spoed" | "boeking" | "vraag";
  onderwerp: string;
  sentiment: "positief" | "neutraal" | "negatief";
  samenvatting: string;
  nietAangeboden?: string;
  oplossingAangedragen?: boolean;
  gelabeldOp: string;
  bron: "model" | "heuristiek";
}

export interface SignalenOverzicht {
  totaalGesprekken: number;
  gelabeld: number;
  perCategorie: Record<string, number>;
  sentiment: Record<string, number>;
  onderwerpen: { onderwerp: string; aantal: number }[];
  nietAangeboden: { vraag: string; aantal: number }[];
  recent: (Signaal & { slug: string })[];
}

const SESSIE_KLAAR_NA_MS = 30 * 60 * 1000; // een half uur stil = afgerond

function isAfgerond(s: ClientSession): boolean {
  if (!s.startTime || s.messages.length < 2) return false;
  return s.isExpired || Date.now() - s.lastActive > SESSIE_KLAAR_NA_MS;
}

function transcriptTekst(s: ClientSession): string {
  return s.messages
    .filter((m) => m.sender !== "system")
    .map((m) => `${m.sender === "user" ? "Klant" : "Verdi"}: ${m.text}`)
    .join("\n")
    .slice(0, 6000);
}

async function labelViaModel(s: ClientSession): Promise<Signaal | null> {
  const key = readEnv("DEEPSEEK_API_KEY");
  if (!key) return null;

  const prompt = `Je analyseert een WhatsApp-gesprek tussen een klant en de assistent van een klein bedrijf. Antwoord UITSLUITEND met geldige JSON, zonder toelichting:
{"categorie":"klacht|kans|spoed|boeking|vraag","onderwerp":"kort onderwerp, max 4 woorden","sentiment":"positief|neutraal|negatief","samenvatting":"één zin, max 20 woorden","nietAangeboden":"alleen invullen als de klant iets vroeg dat het bedrijf niet aanbiedt, anders weglaten","oplossingAangedragen":true of false}

Gesprek:
${transcriptTekst(s)}`;

  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: readEnv("DEEPSEEK_MODEL") || "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 200,
      }),
    });
    const data = await res.json();
    let raw = data?.choices?.[0]?.message?.content || "";
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(raw);
    if (!parsed.categorie || !parsed.onderwerp) return null;
    return {
      categorie: parsed.categorie,
      onderwerp: String(parsed.onderwerp).slice(0, 60),
      sentiment: parsed.sentiment || "neutraal",
      samenvatting: String(parsed.samenvatting || "").slice(0, 160),
      nietAangeboden: parsed.nietAangeboden ? String(parsed.nietAangeboden).slice(0, 80) : undefined,
      oplossingAangedragen: Boolean(parsed.oplossingAangedragen),
      gelabeldOp: new Date().toISOString(),
      bron: "model",
    };
  } catch (e) {
    console.error("[signalen] modellabel mislukt:", e);
    return null;
  }
}

function labelViaHeuristiek(s: ClientSession): Signaal {
  const t = transcriptTekst(s).toLowerCase();
  const boeking = s.messages.some((m) => m.isBookingCard);
  let categorie: Signaal["categorie"] = "vraag";
  if (boeking) categorie = "boeking";
  else if (/spoed|direct|nu meteen|dringend|pijn|kapot onderweg/.test(t)) categorie = "spoed";
  else if (/klacht|ontevreden|slecht|boos|teleurgesteld|niet blij/.test(t)) categorie = "klacht";
  else if (/afspraak|inplannen|boeken|reserveren/.test(t)) categorie = "kans";
  const sentiment = /dank|top|fijn|super|graag gedaan/.test(t)
    ? "positief"
    : /klacht|boos|slecht|teleurgesteld/.test(t)
    ? "negatief"
    : "neutraal";
  return {
    categorie,
    onderwerp: /prijs|kost|tarief/.test(t) ? "prijsvraag" : /apk/.test(t) ? "apk" : "algemeen",
    sentiment,
    samenvatting: "Automatisch gelabeld zonder model (heuristiek).",
    gelabeldOp: new Date().toISOString(),
    bron: "heuristiek",
  };
}

/** Labelt maximaal `max` nog ongelabelde afgeronde sessies (voor deze slug of alle). */
export async function labelSessies(slug?: string, max = 8): Promise<number> {
  const alle = listAllSessions().filter(
    (s) => (!slug || s.slug === slug || s.slug.startsWith(`${slug}__`)) && isAfgerond(s) && !(s as any).signaal
  );
  let gedaan = 0;
  for (const s of alle.slice(0, max)) {
    const signaal = (await labelViaModel(s)) || labelViaHeuristiek(s);
    (s as any).signaal = signaal;
    saveSession(s);
    gedaan++;
  }
  return gedaan;
}

export function bouwOverzicht(slug?: string): SignalenOverzicht {
  const relevant = listAllSessions().filter(
    (s) => (!slug || s.slug === slug || s.slug.startsWith(`${slug}__`)) && s.messages.length >= 2
  );
  const gelabelde = relevant.filter((s) => (s as any).signaal);

  const perCategorie: Record<string, number> = {};
  const sentiment: Record<string, number> = {};
  const onderwerpTelling: Record<string, number> = {};
  const nietAangebodenTelling: Record<string, number> = {};

  for (const s of gelabelde) {
    const sig = (s as any).signaal as Signaal;
    perCategorie[sig.categorie] = (perCategorie[sig.categorie] || 0) + 1;
    sentiment[sig.sentiment] = (sentiment[sig.sentiment] || 0) + 1;
    onderwerpTelling[sig.onderwerp] = (onderwerpTelling[sig.onderwerp] || 0) + 1;
    if (sig.nietAangeboden) {
      nietAangebodenTelling[sig.nietAangeboden] = (nietAangebodenTelling[sig.nietAangeboden] || 0) + 1;
    }
  }

  const sorteer = (obj: Record<string, number>) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

  return {
    totaalGesprekken: relevant.length,
    gelabeld: gelabelde.length,
    perCategorie,
    sentiment,
    onderwerpen: sorteer(onderwerpTelling).map(([onderwerp, aantal]) => ({ onderwerp, aantal })),
    nietAangeboden: sorteer(nietAangebodenTelling).map(([vraag, aantal]) => ({ vraag, aantal })),
    recent: gelabelde
      .sort((a, b) => b.lastActive - a.lastActive)
      .slice(0, 10)
      .map((s) => ({ ...((s as any).signaal as Signaal), slug: s.slug })),
  };
}
