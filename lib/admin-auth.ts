import { NextRequest, NextResponse } from "next/server";
import { readEnv } from "@/lib/env";

/**
 * Poortwachter voor schrijf- en kostenacties (profielen schrijven, ingest).
 *
 * Zonder ENGINE_ADMIN_KEY in de omgeving is schrijven altijd uitgeschakeld —
 * nooit een "open" API per ongeluk, ook niet tijdelijk. De sleutel wordt
 * meegestuurd via de header `x-verdi-key`.
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const adminKey = readEnv("ENGINE_ADMIN_KEY");
  if (!adminKey) {
    return NextResponse.json(
      { error: "Schrijf-API is niet geconfigureerd: ENGINE_ADMIN_KEY ontbreekt in de omgeving." },
      { status: 503 }
    );
  }

  const provided = req.headers.get("x-verdi-key");
  if (!provided || provided !== adminKey) {
    return NextResponse.json(
      { error: "Ongeldige of ontbrekende x-verdi-key header." },
      { status: 401 }
    );
  }

  return null;
}
