/**
 * Placeholder-bewust uitlezen van environment-variabelen.
 *
 * Op Railway staan alle variabelen alvast klaar met een `REPLACE_ME__`-waarde,
 * zodat er alleen een waarde vervangen hoeft te worden in plaats van dat iemand
 * de juiste variabelenaam moet weten. Een placeholder is echter géén configuratie:
 * behandel hem exact zoals een ontbrekende variabele, anders belooft het
 * beheerportaal een koppeling die in werkelijkheid faalt bij de eerste API-call.
 */

export const PLACEHOLDER_PREFIX = "REPLACE_ME";

export function isPlaceholder(value: string | undefined | null): boolean {
  if (!value) return false;
  return value.trim().toUpperCase().startsWith(PLACEHOLDER_PREFIX);
}

/** De waarde, of undefined wanneer de variabele leeg is of nog een placeholder bevat. */
export function readEnv(name: string): string | undefined {
  const raw = process.env[name];
  if (!raw || !raw.trim()) return undefined;
  if (isPlaceholder(raw)) return undefined;
  return raw;
}

/** True zodra elke opgegeven variabele een echte waarde heeft. */
export function hasEnv(...names: string[]): boolean {
  return names.every((n) => readEnv(n) !== undefined);
}

/** Onderscheid tussen "nooit ingevuld" en "placeholder klaargezet". */
export function envState(...names: string[]): "configured" | "placeholder" | "missing" {
  if (hasEnv(...names)) return "configured";
  if (names.some((n) => isPlaceholder(process.env[n]))) return "placeholder";
  return "missing";
}
