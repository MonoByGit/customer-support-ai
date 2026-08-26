import { NextRequest, NextResponse } from "next/server";
import { getAllProfiles, getProfileBySlug, saveProfile } from "@/lib/storage";
import { BusinessProfileSchema } from "@/lib/schemas";

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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = BusinessProfileSchema.parse(body);

    const saved = saveProfile(validated);
    return NextResponse.json({ success: true, profile: saved });
  } catch (error: any) {
    console.error("Error saving profile:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
