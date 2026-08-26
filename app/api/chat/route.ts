import { NextRequest, NextResponse } from "next/server";
import { getProfileBySlug } from "@/lib/storage";
import { executeChatTurn } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, messages, currentMessage } = body;

    if (!slug) {
      return NextResponse.json({ error: "Missing business slug parameter." }, { status: 400 });
    }

    if (!currentMessage || typeof currentMessage !== "string") {
      return NextResponse.json({ error: "Invalid or missing current message." }, { status: 400 });
    }

    const profile = getProfileBySlug(slug);
    if (!profile) {
      return NextResponse.json({ error: `Business profile not found for slug '${slug}'.` }, { status: 404 });
    }

    const chatHistory = Array.isArray(messages)
      ? messages.map((m: any) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content as string,
        }))
      : [];

    const result = await executeChatTurn(profile, chatHistory, currentMessage);

    return NextResponse.json({
      success: true,
      reply: result.text,
      bookingData: result.bookingData || null,
      proposedSlots: result.proposedSlots || null,
    });
  } catch (error: any) {
    console.error("[api/chat] Error handling chat message:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process chat message." },
      { status: 500 }
    );
  }
}
