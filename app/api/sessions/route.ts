import { NextRequest, NextResponse } from "next/server";
import { listAllSessions, getSession, extendSession, resetSession, saveSession } from "@/lib/session-store";
import { getAllProfiles } from "@/lib/storage";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const session = getSession(slug);
      return NextResponse.json({ success: true, session });
    }

    // Return all profiles merged with their session status
    const profiles = getAllProfiles();
    const sessions = listAllSessions();
    const sessionMap = new Map(sessions.map((s) => [s.slug, s]));

    const result = profiles.map((p) => {
      const session = sessionMap.get(p.slug) || {
        slug: p.slug,
        businessName: p.businessName,
        startTime: null,
        maxDurationMinutes: 10,
        messageCount: 0,
        maxMessages: 30,
        isExpired: false,
        messages: [],
        lastActive: Date.now(),
      };

      let remainingMinutes = 10;
      if (session.startTime) {
        const elapsed = (Date.now() - session.startTime) / (1000 * 60);
        remainingMinutes = Math.max(0, Math.round(session.maxDurationMinutes - elapsed));
      }

      return {
        profile: p,
        session,
        remainingMinutes,
        hasStarted: session.startTime !== null,
        messageCount: session.messageCount,
        maxMessages: session.maxMessages,
        isExpired: session.isExpired,
      };
    });

    return NextResponse.json({ success: true, sessions: result });
  } catch (error: any) {
    console.error("Error in sessions API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, action, extraMinutes, extraMessages } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is verplicht" }, { status: 400 });
    }

    if (action === "extend") {
      const updated = extendSession(slug, extraMinutes || 10, extraMessages || 10);
      return NextResponse.json({ success: true, session: updated });
    }

    if (action === "reset") {
      const updated = resetSession(slug);
      return NextResponse.json({ success: true, session: updated });
    }

    return NextResponse.json({ error: "Ongeldige actie" }, { status: 400 });
  } catch (error: any) {
    console.error("Error in session action:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
