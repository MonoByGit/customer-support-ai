import { NextRequest, NextResponse } from "next/server";
import { getProfileBySlug } from "@/lib/storage";
import { executeChatTurn, processCustomerMessageFallback, ChatMessage } from "@/lib/deepseek";
import { addUsage, slugExhausted, globalExhausted } from "@/lib/budget";
import { getSession, saveSession, expiryReason } from "@/lib/session-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileSlug, message, history, sessionId } = body;

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
    const session = getSession(profileSlug, typeof sessionId === "string" ? sessionId : undefined);

    // If session hasn't started yet, start it now on first user message!
    if (!session.startTime) {
      session.startTime = Date.now();
    }

    // Drie plafonds bewaken de sessie: tijd, aantal berichten en tokenverbruik.
    // Het tokenplafond is het plafond dat de rekening bepaalt.
    const elapsedMinutes = (Date.now() - session.startTime) / (1000 * 60);
    if (
      elapsedMinutes >= session.maxDurationMinutes ||
      session.messageCount >= session.maxMessages ||
      session.tokensUsed >= session.maxTokens
    ) {
      session.isExpired = true;
      saveSession(session);

      const reason = expiryReason(session);
      const because =
        reason === "tijd"
          ? "De testperiode van tien minuten zit erop."
          : reason === "berichten"
          ? "U heeft het maximale aantal testberichten gebruikt."
          : "Het testbudget voor deze sessie is op.";

      return NextResponse.json(
        {
          error: "Sessielimiet bereikt",
          isExpired: true,
          reason,
          reply: `${because} Genoeg gezien? Dan zetten we deze assistent met uw eigen agenda live. Wilt u eerst verder testen, dan verlengen wij de sessie graag.`,
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

    // Dagbudget per demo-slug: één misbruikte link kan niet de hele dag doorbranden.
    if (slugExhausted(profileSlug)) {
      return NextResponse.json(
        {
          error: "Dagbudget bereikt",
          isExpired: true,
          reply:
            "Deze demo heeft vandaag veel belangstelling gehad en neemt even pauze. Morgen staat Verdi hier weer voor u klaar — of plan direct een gesprek, dan zetten we hem live voor uw eigen zaak.",
        },
        { status: 403 }
      );
    }

    // Globaal dagplafond: demo's blijven werken op de vangnet-receptionist, zonder LLM-kosten.
    const result = globalExhausted()
      ? await processCustomerMessageFallback(profile, formattedHistory, message)
      : await executeChatTurn(profile, formattedHistory, message);
    session.tokensUsed += result.tokensUsed || 0;
    addUsage(profileSlug, result.tokensUsed || 0);

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
        tokensUsed: session.tokensUsed,
        maxTokens: session.maxTokens,
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
