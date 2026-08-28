import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getProfileBySlug, getAllProfiles } from "@/lib/storage";
import { readEnv } from "@/lib/env";
import { executeChatTurn, ChatMessage } from "@/lib/deepseek";
import { getSession, saveSession } from "@/lib/session-store";
import { addUsage } from "@/lib/budget";
import { vindKenteken, haalVoertuigOp, voertuigContext } from "@/lib/rdw";

/**
 * Foto-dossier: media van WhatsApp downloaden (twee stappen via de Graph API)
 * en opslaan in DATA_DIR/media/<slug>/ zodat het dossier hem kan tonen.
 */
async function bewaarWhatsAppFoto(mediaId: string, slug: string, accessToken: string): Promise<string | null> {
  try {
    const metaRes = await fetch(`https://graph.facebook.com/v20.0/${mediaId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const meta = await metaRes.json();
    if (!meta?.url) return null;
    const fileRes = await fetch(meta.url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!fileRes.ok) return null;
    const buffer = Buffer.from(await fileRes.arrayBuffer());
    const ext = (meta.mime_type || "image/jpeg").split("/")[1].split(";")[0] || "jpg";
    const dir = path.join(readEnv("DATA_DIR") || path.join(process.cwd(), "data"), "media", slug);
    fs.mkdirSync(dir, { recursive: true });
    const naam = `${Date.now()}-${mediaId}.${ext}`;
    fs.writeFileSync(path.join(dir, naam), buffer);
    return naam;
  } catch (e) {
    console.error("[webhook] foto opslaan mislukt:", e);
    return null;
  }
}

const VERIFY_TOKEN = readEnv("META_WEBHOOK_VERIFY_TOKEN") || "whatsapp_ai_verify_token_2026";

/**
 * 1. Meta Webhook Verification Handshake (GET)
 * Meta calls this when setting up Webhook URL in Meta for Developers.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[webhook] Meta Webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

/**
 * 2. Meta WhatsApp Cloud API Message Dispatcher (POST)
 * Receives incoming messages from WhatsApp users and dispatches replies via DeepSeek Flash & Google Calendar.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if this is a WhatsApp message event
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];

    if (!message) {
      // Could be a delivery receipt or status update
      return NextResponse.json({ status: "acknowledged" });
    }

    const fromPhoneNumber = message.from; // Customer WhatsApp number e.g. "31612345678"
    let userText = "";

    if (message.type === "text") {
      userText = message.text?.body || "";
    } else if (message.type === "interactive") {
      // Customer clicked an interactive button or list item
      if (message.interactive.type === "button_reply") {
        userText = message.interactive.button_reply?.title || message.interactive.button_reply?.id || "";
      } else if (message.interactive.type === "list_reply") {
        userText = message.interactive.list_reply?.title || "";
      }
    }

    const isFoto = message.type === "image" && message.image?.id;
    if (!userText.trim() && !isFoto) {
      return NextResponse.json({ status: "ignored_non_text" });
    }

    console.log(`[webhook] Received WhatsApp message from ${fromPhoneNumber}: "${userText}"`);

    // Routering: elk klantbedrijf heeft straks een eigen WhatsApp-nummer. Meta stuurt
    // bij elk bericht het phone_number_id mee; een profiel met dat id in het veld
    // metaPhoneNumberId wint. Zonder match: het standaardprofiel (testopstelling).
    const inkomendNummerId = change?.metadata?.phone_number_id as string | undefined;
    const { getAllProfiles } = await import("@/lib/storage");
    const opNummer = inkomendNummerId
      ? getAllProfiles().find((p: any) => p.metaPhoneNumberId === inkomendNummerId)
      : undefined;
    const profile = opNummer || getProfileBySlug(readEnv("DEFAULT_PROFILE_SLUG") || "tandartspraktijk-amsterdam");
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Gespreksgeheugen: één sessie per klantnummer per bedrijf. Zo onthoudt Verdi
    // het gesprek over beurten heen en voeden echte WhatsApp-gesprekken het
    // dashboard en de signalen. Geen sessielimieten hier: echte klanten kap je niet af.
    const session = getSession(profile.slug, fromPhoneNumber);
    if (!session.startTime) session.startTime = Date.now();
    const tijdstempel = () =>
      new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });

    const accessTokenVooraf = readEnv("META_WHATSAPP_ACCESS_TOKEN") || "";
    let modelBericht = userText;

    if (isFoto) {
      const bestand = await bewaarWhatsAppFoto(message.image.id, profile.slug, accessTokenVooraf);
      session.messages.push({
        id: `sys_${Date.now()}`,
        sender: "system",
        text: `Dossier: foto ontvangen${bestand ? ` (${bestand})` : ""}.`,
        timestamp: tijdstempel(),
      });
      userText = "[foto meegestuurd]";
      modelBericht =
        "[De klant stuurde zojuist een foto mee voor het dossier. Bevestig kort en warm dat de foto in het dossier zit en vraag wat er te zien is of waarbij u kunt helpen.]";
    } else {
      // RDW: kenteken in een WhatsApp-bericht → voertuiggegevens in dossier en context.
      const kenteken = vindKenteken(userText);
      if (kenteken && !(session as any).rdw) {
        const voertuig = await haalVoertuigOp(kenteken);
        if (voertuig) {
          (session as any).rdw = voertuig;
          session.messages.push({
            id: `sys_${Date.now()}`,
            sender: "system",
            text: `Dossier: ${voertuig.merk} ${voertuig.handelsbenaming}, eerste toelating ${voertuig.eersteToelating}${voertuig.apkVervaldatum ? `, APK verloopt ${voertuig.apkVervaldatum}` : ""} (kenteken ${voertuig.kenteken}, via RDW).`,
            timestamp: tijdstempel(),
          });
          modelBericht = `${voertuigContext(voertuig)}
${userText}`;
        }
      }
    }

    const history: ChatMessage[] = session.messages
      .filter((m) => m.sender === "user" || m.sender === "agent")
      .slice(-12)
      .map((m) => ({ role: m.sender === "user" ? ("user" as const) : ("model" as const), content: m.text }));

    session.messageCount += 1;
    session.messages.push({
      id: `usr_${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: tijdstempel(),
    });

    const chatResult = await executeChatTurn(profile, history, modelBericht);

    session.messages.push({
      id: `agt_${Date.now()}`,
      sender: "agent",
      text: chatResult.reply,
      timestamp: tijdstempel(),
      isBookingCard: chatResult.bookingConfirmed,
      bookingDetails: chatResult.bookingDetails,
    });
    session.tokensUsed += chatResult.tokensUsed || 0;
    addUsage(profile.slug, chatResult.tokensUsed || 0);
    saveSession(session);

    // If Meta Access Token is configured, send reply directly back to WhatsApp
    const accessToken = readEnv("META_WHATSAPP_ACCESS_TOKEN");
    const phoneNumberId = readEnv("META_PHONE_NUMBER_ID");

    if (accessToken && phoneNumberId) {
      await sendWhatsAppCloudMessage({
        accessToken,
        phoneNumberId,
        recipientPhone: fromPhoneNumber,
        text: chatResult.reply,
        proposedSlots: chatResult.proposedSlots,
      });
    }

    return NextResponse.json({
      success: true,
      from: fromPhoneNumber,
      reply: chatResult.reply,
      bookingData: chatResult.bookingDetails || null,
      proposedSlots: chatResult.proposedSlots || null,
    });
  } catch (error: any) {
    console.error("[webhook] Error handling Meta webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Send real Interactive WhatsApp Message back via Meta Graph API
 */
async function sendWhatsAppCloudMessage({
  accessToken,
  phoneNumberId,
  recipientPhone,
  text,
  proposedSlots,
}: {
  accessToken: string;
  phoneNumberId: string;
  recipientPhone: string;
  text: string;
  proposedSlots?: Array<{ iso: string; formatted: string }>;
}) {
  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  let payload: any = {
    messaging_product: "whatsapp",
    to: recipientPhone,
    type: "text",
    text: { body: text },
  };

  // If we have proposed slots, send as WhatsApp Interactive Quick Reply Buttons (max 3 buttons)
  if (proposedSlots && proposedSlots.length > 0) {
    const buttons = proposedSlots.slice(0, 3).map((slot, i) => ({
      type: "reply",
      reply: {
        id: `slot_${slot.iso}`,
        title: slot.formatted.slice(0, 20), // Meta limits button title to 20 chars
      },
    }));

    payload = {
      messaging_product: "whatsapp",
      to: recipientPhone,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text },
        action: { buttons },
      },
    };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("[webhook] Failed to send WhatsApp Graph API message:", errText);
  }
}
