import { NextRequest, NextResponse } from "next/server";
import { getProfileBySlug } from "@/lib/storage";
import { executeChatTurn } from "@/lib/gemini";

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || "whatsapp_ai_verify_token_2026";

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
 * Receives incoming messages from WhatsApp users and dispatches replies via Gemini Flash & Google Calendar.
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

    if (!userText.trim()) {
      return NextResponse.json({ status: "ignored_non_text" });
    }

    console.log(`[webhook] Received WhatsApp message from ${fromPhoneNumber}: "${userText}"`);

    // Determine target business profile (default to tandarts-demo or query by phone number ID)
    const profile = getProfileBySlug("tandarts-demo");
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Execute Gemini AI turn with tools
    const chatResult = await executeChatTurn(
      profile,
      [],
      userText
    );

    // If Meta Access Token is configured, send reply directly back to WhatsApp
    const accessToken = process.env.META_WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

    if (accessToken && phoneNumberId) {
      await sendWhatsAppCloudMessage({
        accessToken,
        phoneNumberId,
        recipientPhone: fromPhoneNumber,
        text: chatResult.text,
        proposedSlots: chatResult.proposedSlots,
      });
    }

    return NextResponse.json({
      success: true,
      from: fromPhoneNumber,
      reply: chatResult.text,
      bookingData: chatResult.bookingData || null,
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
