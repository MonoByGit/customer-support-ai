import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { labelSessies, bouwOverzicht } from "@/lib/signalen";

/**
 * Signalen-overzicht voor het dashboard.
 * Labelt bij elke aanroep eerst een handvol nog ongelabelde afgeronde
 * gesprekken (goedkoop, gecachet) en geeft daarna de aggregatie terug.
 */
export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || undefined;

    const nieuwGelabeld = await labelSessies(slug);
    const overzicht = bouwOverzicht(slug);

    return NextResponse.json({ success: true, nieuwGelabeld, overzicht });
  } catch (error: any) {
    console.error("[signalen] fout:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
