import { NextRequest, NextResponse } from "next/server";
import { deleteProfile, getAllProfiles, getProfileBySlug, saveProfile } from "@/lib/storage";
import { BusinessProfileSchema } from "@/lib/schemas";
import { readEnv } from "@/lib/env";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Poortwachter voor alle schrijfacties (PUT/PATCH/DELETE).
 *
 * Zonder ENGINE_ADMIN_KEY in de omgeving is schrijven altijd uitgeschakeld —
 * nooit een "open" API per ongeluk, ook niet tijdelijk. De sleutel wordt
 * meegestuurd via de header `x-verdi-key`.
 */
function requireAdmin(req: NextRequest): NextResponse | null {
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

function validateSlugAndName(body: any): NextResponse | null {
  if (typeof body?.slug !== "string" || !SLUG_PATTERN.test(body.slug)) {
    return NextResponse.json(
      { error: "slug is verplicht en moet kebab-case zijn (bijv. 'mijn-bedrijf')." },
      { status: 400 }
    );
  }
  if (typeof body?.businessName !== "string" || body.businessName.trim().length === 0) {
    return NextResponse.json(
      { error: "businessName is verplicht en mag niet leeg zijn." },
      { status: 400 }
    );
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const profile = getProfileBySlug(slug);
      if (!profile) {
        return NextResponse.json({ error: "Profiel niet gevonden" }, { status: 404 });
      }
      return NextResponse.json({ success: true, profile });
    }

    const profiles = getAllProfiles();
    return NextResponse.json({ success: true, profiles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/** Create-or-update van een volledig profiel op basis van slug. */
export async function PUT(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const body = await req.json();

    const validationError = validateSlugAndName(body);
    if (validationError) return validationError;

    const validated = BusinessProfileSchema.parse(body);
    const saved = saveProfile(validated);
    return NextResponse.json({ success: true, profile: saved });
  } catch (error: any) {
    console.error("Error saving profile:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/** Partiële update (merge) van een bestaand profiel op basis van ?slug=. */
export async function PATCH(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Query parameter 'slug' is verplicht." }, { status: 400 });
    }

    const existing = getProfileBySlug(slug);
    if (!existing) {
      return NextResponse.json({ error: "Profiel niet gevonden" }, { status: 404 });
    }

    const patch = await req.json();
    const merged = { ...existing, ...patch, slug: existing.slug };

    const validationError = validateSlugAndName(merged);
    if (validationError) return validationError;

    const validated = BusinessProfileSchema.parse(merged);
    const saved = saveProfile(validated);
    return NextResponse.json({ success: true, profile: saved });
  } catch (error: any) {
    console.error("Error patching profile:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/** Verwijdert een profiel op basis van ?slug=. */
export async function DELETE(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Query parameter 'slug' is verplicht." }, { status: 400 });
    }

    const removed = deleteProfile(slug);
    if (!removed) {
      return NextResponse.json({ error: "Profiel niet gevonden" }, { status: 404 });
    }

    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    console.error("Error deleting profile:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
