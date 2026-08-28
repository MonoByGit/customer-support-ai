import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getProfileBySlug } from "@/lib/storage";
import { readEnv } from "@/lib/env";
import { addUsage } from "@/lib/budget";
import { situatiesVoor } from "@/lib/intakeSituaties";

/**
 * Kennisintake-service (stateless).
 *
 * Verdi voert hier een gesprek met de ÓNDERNEMER (niet met een klant): per
 * beurt één situatievraag, en uit elk antwoord wordt gestructureerde kennis
 * geëxtraheerd. De service past zelf NIETS toe op het profiel — de merksite
 * verzamelt de opbrengst zichtbaar in het opbouwpaneel en schrijft pas bij
 * het akkoord van de ondernemer (Dusty's flow: opbouwen → overzicht →
 * akkoord → aanvulbare basisset).
 */
interface IntakeBericht {
  rol: "ondernemer" | "verdi";
  tekst: string;
}

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const { slug, messages = [], behandeld = [] } = await req.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug is verplicht." }, { status: 400 });
    }
    const profile = getProfileBySlug(slug);
    if (!profile) {
      return NextResponse.json({ error: `Geen profiel voor '${slug}'.` }, { status: 404 });
    }

    const alle = situatiesVoor(profile.industry);
    const open = alle.filter((s) => !behandeld.includes(s.id));
    const huidige = open[0] || null;
    const klaar = !huidige;

    const key = readEnv("DEEPSEEK_API_KEY");

    // Zonder model: nette gescripte intake — vraag stellen, antwoord letterlijk bewaren.
    if (!key) {
      const laatste = (messages as IntakeBericht[]).filter((m) => m.rol === "ondernemer").pop();
      const vorigeId = (behandeld as string[])[behandeld.length - 1];
      return NextResponse.json({
        success: true,
        reply: klaar
          ? "Dat was de laatste vraag. Hieronder staat alles wat we samen hebben ingevuld — kijk het rustig na en geef akkoord, dan is dit vanaf nu wat ik namens u vertel."
          : `Dank u. ${huidige!.vraag}`,
        totaal: alle.length,
        situatieId: huidige?.id || null,
        situatieTitel: huidige?.titel || null,
        updates: laatste && vorigeId ? { situatie: { id: vorigeId, antwoord: laatste.tekst } } : null,
        klaar,
      });
    }

    const gesprek = (messages as IntakeBericht[])
      .slice(-12)
      .map((m) => `${m.rol === "ondernemer" ? "Ondernemer" : "Verdi"}: ${m.tekst}`)
      .join("\n");

    const prompt = `Je bent Verdi en je voert een warme, rustige kennisintake met de eigenaar van ${profile.businessName} (${profile.industry}). Je spreekt de ondernemer aan met u, kort en hartelijk, nooit als een formulier.

Zojuist behandelde situatievraag (waar het laatste antwoord van de ondernemer bij hoort): ${
      behandeld.length > 0
        ? alle.find((s) => s.id === behandeld[behandeld.length - 1])?.vraag || "geen"
        : "geen — dit is de opening"
    }
${huidige ? `De volgende situatievraag die je nu stelt (id ${huidige.id}): ${huidige.vraag}` : "Alle situaties zijn behandeld: rond warm af en verwijs naar het overzicht en de akkoord-knop."}

Gesprek tot nu toe:
${gesprek || "(nog leeg — open het gesprek: stel uzelf kort voor als hun nieuwe assistent en stel de eerste vraag)"}

Antwoord UITSLUITEND met geldige JSON:
{"reply":"jouw volgende bericht aan de ondernemer (reageer eerst kort en menselijk op het laatste antwoord, stel dan de volgende vraag; max 60 woorden)","antwoordSamenvatting":"het laatste antwoord van de ondernemer samengevat in één klantklare zin die jij straks tegen klanten kunt zeggen, of null als er nog geen antwoord was"}`;

    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: readEnv("DEEPSEEK_MODEL") || "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 300,
      }),
    });
    const data = await res.json();
    addUsage(slug, data?.usage?.total_tokens || 0);
    let raw = data?.choices?.[0]?.message?.content || "";
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed: { reply?: string; antwoordSamenvatting?: string | null } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { reply: raw.slice(0, 400), antwoordSamenvatting: null };
    }

    const vorigeId = (behandeld as string[])[behandeld.length - 1];
    return NextResponse.json({
      success: true,
      totaal: alle.length,
      reply:
        parsed.reply ||
        (klaar
          ? "Dat was de laatste vraag — kijk het overzicht rustig na en geef akkoord."
          : huidige!.vraag),
      situatieId: huidige?.id || null,
      situatieTitel: huidige?.titel || null,
      updates:
        parsed.antwoordSamenvatting && vorigeId
          ? { situatie: { id: vorigeId, antwoord: parsed.antwoordSamenvatting } }
          : null,
      klaar,
    });
  } catch (error: any) {
    console.error("[intake] fout:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
