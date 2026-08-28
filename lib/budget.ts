import fs from "fs";
import path from "path";
import { readEnv } from "./env";

/**
 * Dagbudgetten voor de open chat-API.
 *
 * De chat staat bewust zonder login open (demo's moeten frictieloos zijn), maar
 * een open LLM-endpoint is anders een onbegrensde rekening. Twee plafonds:
 *
 * - Per demo-slug per dag: beschermt tegen één misbruikte demolink. Bij het
 *   plafond krijgt de bezoeker een nette boodschap.
 * - Globaal per dag: de noodrem over alles heen. Bij het plafond schakelt de
 *   motor over op de deterministische fallback-receptionist — demo's blijven
 *   werken, alleen zonder LLM-kosten.
 *
 * Tellers staan per dag als JSON in DATA_DIR/budget/ zodat ze een herstart
 * overleven. Datum in Europe/Amsterdam, net als de rest van het product.
 */
const DATA_ROOT = readEnv("DATA_DIR") || path.join(process.cwd(), "data");
const BUDGET_DIR = path.join(DATA_ROOT, "budget");

export const SLUG_DAILY_TOKENS = Number(readEnv("BUDGET_SLUG_DAILY_TOKENS") || 150_000);
export const GLOBAL_DAILY_TOKENS = Number(readEnv("BUDGET_GLOBAL_DAILY_TOKENS") || 2_000_000);

interface DayBudget {
  total: number;
  perSlug: Record<string, number>;
}

function vandaag(): string {
  return new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .split("-")
    .reverse()
    .join("-");
}

function budgetFile(): string {
  return path.join(BUDGET_DIR, `${vandaag()}.json`);
}

function readDay(): DayBudget {
  try {
    if (fs.existsSync(budgetFile())) {
      const data = JSON.parse(fs.readFileSync(budgetFile(), "utf-8"));
      if (typeof data.total === "number" && data.perSlug) return data;
    }
  } catch (e) {
    console.error("[budget] leesfout:", e);
  }
  return { total: 0, perSlug: {} };
}

export function addUsage(slug: string, tokens: number): void {
  if (!tokens || tokens <= 0) return;
  try {
    if (!fs.existsSync(BUDGET_DIR)) fs.mkdirSync(BUDGET_DIR, { recursive: true });
    const day = readDay();
    day.total += tokens;
    day.perSlug[slug] = (day.perSlug[slug] || 0) + tokens;
    fs.writeFileSync(budgetFile(), JSON.stringify(day), "utf-8");
  } catch (e) {
    console.error("[budget] schrijffout:", e);
  }
}

export function slugExhausted(slug: string): boolean {
  return (readDay().perSlug[slug] || 0) >= SLUG_DAILY_TOKENS;
}

export function globalExhausted(): boolean {
  return readDay().total >= GLOBAL_DAILY_TOKENS;
}
