import { NextRequest, NextResponse } from "next/server";
import { getProfileBySlug } from "@/lib/storage";
import { processCustomerMessage, ChatMessage } from "@/lib/gemini";
import { processCustomerMessageWithDeepSeek } from "@/lib/deepseek";
import { getSession, saveSession } from "@/lib/session-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileSlug, message, history } = body;

    if (!profileSlug || !message) {
      return NextResponse.json(
        { error: "profileSlug en message zijn verplicht." },
        { status: 400 }
      );
    }

    const profile = getProfileBySlug(profileSlug);
    if (!profile) {
      return NextResponse.json(
        { error: `Geen bedrijfsprofiel gevonden voor '${profileSlug}'` },
        { status: 404 }
      );
    }

    // Retrieve or initialize session state
    const session = getSession(profileSlug);

    // If session hasn't started yet, start it now on first user message!
    if (!session.startTime) {
      session.startTime = Date.now();
    }

    // Check expiration: 10 minutes or max message limit
    const elapsedMinutes = (Date.now() - session.startTime) / (1000 * 60);
    if (elapsedMinutes >= session.maxDurationMinutes || session.messageCount >= session.maxMessages) {
      session.isExpired = true;
      saveSession(session);
      return NextResponse.json(
        {
          error: "Sessie limiet bereikt",
          isExpired: true,
          reply: "Uw 10-minuten demo sessie is voltooid! Wilt u Verde AI live activeren voor uw praktijk of een verlenging aanvragen?",
        },
        { status: 403 }
      );
    }

    // Increment message count
    session.messageCount += 1;

    // Record user message in server transcript
    session.messages.push({
      id: `usr_${Date.now()}`,
      sender: "user",
      text: message,
      timestamp: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
    });

    const formattedHistory: ChatMessage[] = (history || []).map((h: any) => ({
      role: h.sender === "user" ? "user" : "model",
      content: h.text,
    }));

    let result: any;

    // Route to DeepSeek if DEEPSEEK_API_KEY is present, otherwise fallback to Gemini
    if (process.env.DEEPSEEK_API_KEY) {
      try {
        console.log(`[chat] Routing message to DeepSeek API (${process.env.DEEPSEEK_MODEL || "deepseek-chat"})...`);
        result = await processCustomerMessageWithDeepSeek(profile, formattedHistory, message);
      } catch (deepseekErr) {
        console.warn("[chat] DeepSeek failed, falling back to Gemini:", deepseekErr);
        result = await processCustomerMessage(profile, formattedHistory, message);
      }
    } else {
      console.log(`[chat] Routing message to Gemini Flash API...`);
      result = await processCustomerMessage(profile, formattedHistory, message);
    }

    // Record agent message in server transcript
    session.messages.push({
      id: `agt_${Date.now()}`,
      sender: "agent",
      text: result.reply,
      timestamp: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
      quickReplies: result.quickReplies,
      isBookingCard: result.bookingConfirmed,
      bookingDetails: result.bookingDetails,
    });

    saveSession(session);

    const remainingSeconds = Math.max(
      0,
      Math.round(session.maxDurationMinutes * 60 - (Date.now() - session.startTime) / 1000)
    );

    return NextResponse.json({
      success: true,
      reply: result.reply,
      quickReplies: result.quickReplies,
      bookingConfirmed: result.bookingConfirmed,
      bookingDetails: result.bookingDetails,
      proposedSlots: result.proposedSlots,
      session: {
        startTime: session.startTime,
        remainingSeconds,
        messageCount: session.messageCount,
        maxMessages: session.maxMessages,
        isExpired: session.isExpired,
      },
    });
  } catch (error: any) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: error.message || "Interne serverfout bij het verwerken van het chatbericht." },
      { status: 500 }
    );
  }
}
