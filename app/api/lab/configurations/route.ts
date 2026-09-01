import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getProfileBySlug, saveProfile } from "@/lib/storage";
import {
  ConfigurationStage,
  QualityCheckName,
  transitionConfiguration,
  updateQualityCheck,
} from "@/lib/configuration";

const QUALITY_CHECKS = new Set<QualityCheckName>([
  "sourceReviewed",
  "profileReviewed",
  "whatsappTested",
  "voiceTested",
]);

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Query parameter 'slug' is verplicht." }, { status: 400 });
  }

  const profile = getProfileBySlug(slug);
  if (!profile?.configuration) {
    return NextResponse.json({ error: "Labconfiguratie niet gevonden." }, { status: 404 });
  }

  return NextResponse.json({ success: true, slug: profile.slug, configuration: profile.configuration });
}

export async function PATCH(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const slug = typeof body.slug === "string" ? body.slug : "";
    const profile = slug ? getProfileBySlug(slug) : null;

    if (!profile?.configuration) {
      return NextResponse.json({ error: "Labconfiguratie niet gevonden." }, { status: 404 });
    }

    let configuration = profile.configuration;

    if (body.check) {
      if (!QUALITY_CHECKS.has(body.check as QualityCheckName)) {
        return NextResponse.json({ error: "Onbekende kwaliteitscontrole." }, { status: 400 });
      }
      configuration = updateQualityCheck(configuration, body.check as QualityCheckName, body.status);
    } else if (body.stage) {
      configuration = transitionConfiguration(configuration, body.stage as ConfigurationStage);
    } else {
      return NextResponse.json({ error: "Geef een kwaliteitscontrole of volgende fase op." }, { status: 400 });
    }

    const saved = saveProfile({ ...profile, configuration });
    return NextResponse.json({ success: true, slug: saved.slug, configuration: saved.configuration });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Labconfiguratie bijwerken mislukt." }, { status: 400 });
  }
}
