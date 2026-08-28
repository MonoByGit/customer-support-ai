import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getProfileBySlug } from "@/lib/storage";
import { readEnv } from "@/lib/env";

/**
 * De Gemiste-Oproep-Redder.
 *
 * De ondernemer voert het nummer van een gemiste oproep in; Verdi stuurt die
 * klant proactief een WhatsApp en neemt het antwoord daarna gewoon op in het
 * normale gesprek (het webhook-pad). Buiten het 24-uursvenster staat Meta
 * alleen goedgekeurde templates toe — daarom template `verdi_gemist`
 * ({{1}} = bedrijfsnaam). Zolang die nog in review is, geeft Meta een
 * duidelijke fout terug die we één-op-één doorgeven.
 */
const TELEFOON_PATTERN = /^\+[1-9][0-9]{7,14}$/;

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const { slug, telefoon } = await req.json();

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug is verplicht." }, { status: 400 });
    }
    if (typeof telefoon !== "string" || !TELEFOON_PATTERN.test(telefoon)) {
      return NextResponse.json(
        { error: "telefoon moet internationaal genoteerd zijn, bijv. +31612345678." },
        { status: 400 }
      );
    }

    const profile = getProfileBySlug(slug);
    if (!profile) {
      return NextResponse.json({ error: `Geen profiel voor '${slug}'.` }, { status: 404 });
    }

    const accessToken = readEnv("META_WHATSAPP_ACCESS_TOKEN");
    const phoneNumberId = readEnv("META_PHONE_NUMBER_ID");
    if (!accessToken || accessToken.startsWith("REPLACE") || !phoneNumberId) {
      return NextResponse.json(
        { error: "WhatsApp is nog niet gekoppeld. Deze functie werkt zodra het nummer live is." },
        { status: 503 }
      );
    }

    const res = await fetch(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: telefoon.replace("+", ""),
          type: "template",
          template: {
            name: "verdi_gemist",
            language: { code: "nl" },
            components: [
              {
                type: "body",
                parameters: [{ type: "text", text: profile.businessName }],
              },
            ],
          },
        }),
      }
    );

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = data?.error?.message || `Meta gaf status ${res.status}.`;
      console.error("[outbound/gemist] verzenden mislukt:", detail);
      return NextResponse.json(
        { error: `Verzenden mislukt: ${detail}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, status: "verzonden", metaId: data?.messages?.[0]?.id });
  } catch (error: any) {
    console.error("[outbound/gemist] fout:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
