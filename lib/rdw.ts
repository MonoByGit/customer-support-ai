import { readEnv } from "./env";

/**
 * RDW-kentekenkoppeling — gratis Nederlandse open data.
 * Kenteken in het gesprek → merk, model, bouwjaar, brandstof en
 * APK-vervaldatum automatisch in het dossier. Geen sleutel nodig.
 */
export interface RdwVoertuig {
  kenteken: string;
  merk: string;
  handelsbenaming: string;
  eersteToelating: string;
  apkVervaldatum: string | null;
}

const KENTEKEN_PATTERN =
  /\b([A-Z]{2}-?\d{2}-?\d{2}|\d{2}-?[A-Z]{2}-?\d{2}|\d{2}-?\d{2}-?[A-Z]{2}|[A-Z]{2}-?\d{2}-?[A-Z]{2}|[A-Z]{2}-?[A-Z]{2}-?\d{2}|\d{2}-?[A-Z]{2}-?[A-Z]{2}|\d{1}-?[A-Z]{3}-?\d{2}|[A-Z]{1}-?\d{3}-?[A-Z]{2}|[A-Z]{3}-?\d{2}-?[A-Z]{1}|[A-Z]{1}-?\d{2}-?[A-Z]{3}|\d{1}-?[A-Z]{2}-?\d{3}|\d{3}-?[A-Z]{2}-?\d{1}|\d{2}-?[A-Z]{3}-?\d{1}|[A-Z]{2}-?\d{3}-?[A-Z]{1})\b/i;

export function vindKenteken(tekst: string): string | null {
  const m = tekst.toUpperCase().match(KENTEKEN_PATTERN);
  return m ? m[1].replace(/-/g, "") : null;
}

function formatDatum(raw?: string): string | null {
  if (!raw || raw.length < 8) return null;
  return `${raw.slice(6, 8)}-${raw.slice(4, 6)}-${raw.slice(0, 4)}`;
}

export async function haalVoertuigOp(kenteken: string): Promise<RdwVoertuig | null> {
  if (readEnv("RDW_UIT") === "1") return null;
  try {
    const res = await fetch(
      `https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${encodeURIComponent(kenteken)}`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    const r = rows?.[0];
    if (!r) return null;
    return {
      kenteken,
      merk: r.merk || "",
      handelsbenaming: r.handelsbenaming || "",
      eersteToelating: formatDatum(r.datum_eerste_toelating) || "",
      apkVervaldatum: formatDatum(r.vervaldatum_apk),
    };
  } catch (e) {
    console.error("[rdw] lookup mislukt:", e);
    return null;
  }
}

export function voertuigContext(v: RdwVoertuig): string {
  const delen = [
    `${v.merk} ${v.handelsbenaming}`.trim(),
    v.eersteToelating ? `eerste toelating ${v.eersteToelating}` : null,
    v.apkVervaldatum ? `APK verloopt ${v.apkVervaldatum}` : null,
  ].filter(Boolean);
  return `[Voertuiggegevens via RDW voor kenteken ${v.kenteken}: ${delen.join(", ")}. Gebruik dit natuurlijk in het gesprek; noem de APK-vervaldatum alleen als dat relevant is.]`;
}
