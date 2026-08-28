import { NextResponse } from "next/server";
import { getAllProfiles } from "@/lib/storage";

export const dynamic = "force-dynamic";

/** Simpele liveness/readiness check, o.a. voor Railway health checks. */
export async function GET() {
  try {
    const profiles = getAllProfiles();
    return NextResponse.json({ ok: true, profiles: profiles.length });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
