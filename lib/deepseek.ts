import { BusinessProfile } from "./schemas";
import { checkFreeSlots, createAppointment, AvailableSlot } from "./calendar";

export interface DeepSeekMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

export async function processCustomerMessageWithDeepSeek(
  profile: BusinessProfile,
  conversationHistory: Array<{ role: "user" | "model" | "assistant" | "system"; content: string }>,
  incomingMessage: string
): Promise<{
  reply: string;
  quickReplies?: string[];
  bookingConfirmed?: boolean;
  bookingDetails?: {
    service: string;
    slot: string;
    clientName: string;
    clientPhone: string;
    calendarEventId?: string;
  };
  proposedSlots?: AvailableSlot[];
}> {
  const apiKey = process.env.DEEPSEEK_API_KEY || "";
  const modelName = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  const systemPrompt = `
Je bent de virtuele receptionist en praktijkassistent van "${profile.businessName}" via WhatsApp.
Je spreekt vloeiend, natuurlijk en warm Nederlands.

HUIDIGE DATUM EN TIJD CONTEXT: Woensdag 26 augustus 2026, 14:00 uur.

BEDRIJFSPROFIEL:
- Bedrijfsnaam: ${profile.businessName}
- Branche: ${profile.industry}
- Tagline: ${profile.tagline || ""}
- Openingstijden: ${profile.openingHours || "Ma-Vr: 08:30 - 17:30"}
- Locatie: ${profile.address || "Nederland"}
- Telefoon: ${profile.phone || ""}
- E-mail: ${profile.email || ""}

DIENSTEN & TARIEVEN:
${profile.services.map((s) => `- ${s.title}: ${s.price || "Op aanvraag"} (${s.durationMinutes} min) - ${s.description || ""}`).join("\n")}

================================================================================
BELANGRIJKSTE REGELS VOOR MENSELIJK, EMPATHISCH & VERTROUWENSWEKKEND CONTACT:
================================================================================
1. WEES ECHT MENSELIJK, WARM EN EMPATHISCH:
   - Toon als allereerste altijd oprechte empathie of enthousiasme voor de situatie van de klant!
   - Bij pijn/schade/spoed (bijv. kiespijn, lekkage): "Wat ontzettend vervelend dat u hier last van heeft! Geen zorgen, wij gaan dit zo snel mogelijk voor u verhelpen."
   - Bij beauty/verzorging/controles: "Wat leuk dat u bij ons langskomt! Ik help u heel graag bij het vinden van een passend moment."
   - Geef de klant het gevoel dat ze écht gehoord worden en bij jullie in de allerbeste handen zijn.

2. WEES BEHULPZAAM & PROACTIEF:
   - Geef heldere, rustige en begrijpelijke antwoorden.
   - Vraag vriendelijk naar de nodige gegevens (naam en telefoonnummer) zodra een datum gekozen is.
   - Bevestig altijd duidelijk wat de vervolgstappen zijn.

3. GOOGLE AGENDA TOOL CALLS:
   - Roep 'check_availability' aan wanneer iemand vraagt naar beschikbare dagen of tijden.
   - Roep 'confirm_booking' aan zodra de klant een specifiek tijdslot heeft gekozen en de naam + telefoonnummer bekend zijn.

4. WHATSAPP BERICHTEN OPMAAK:
   - Houd WhatsApp berichten beknopt, overzichtelijk en vriendelijk. Gebruik 1 of 2 relevante emoji's (zoals 👋, 🦷, ✂️, 🔧, ✨).
`;

  const tools = [
    {
      type: "function",
      function: {
        name: "check_availability",
        description: "Controleer beschikbare agenda tijdsloten voor een datum of gewenste dag (bijv. morgen, donderdag, 2026-08-27).",
        parameters: {
          type: "object",
          properties: {
            date: {
              type: "string",
              description: "De datum om te controleren in YYYY-MM-DD formaat of relatieve datum zoals 'morgen', 'donderdag'.",
            },
            serviceTitle: {
              type: "string",
              description: "De naam van de behandeling of dienst (optioneel).",
            },
          },
          required: ["date"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "confirm_booking",
        description: "Definitief inboeken van een geverifieerde afspraak in de Google Agenda nadat de klant het tijdslot, naam en telefoonnummer heeft bevestigd.",
        parameters: {
          type: "object",
          properties: {
            serviceTitle: {
              type: "string",
              description: "De geselecteerde dienst of behandeling.",
            },
            slotIsoString: {
              type: "string",
              description: "De gekozen starttijd in ISO formaat (bijv. '2026-08-27T10:00:00.000Z') of datumomschrijving.",
            },
            clientName: {
              type: "string",
              description: "De volledige naam van de klant/patiënt.",
            },
            clientPhone: {
              type: "string",
              description: "Het telefoonnummer van de klant voor WhatsApp herinneringen.",
            },
            notes: {
              type: "string",
              description: "Eventuele specifieke klachten of wensen van de klant.",
            },
          },
          required: ["serviceTitle", "slotIsoString", "clientName", "clientPhone"],
        },
      },
    },
  ];

  const messages: DeepSeekMessage[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.map((m) => ({
      role: (m.role === "model" ? "assistant" : m.role) as "user" | "assistant" | "system",
      content: m.content,
    })),
    { role: "user", content: incomingMessage },
  ];

  let bookingConfirmed = false;
  let bookingDetails: any = null;
  let proposedSlots: AvailableSlot[] = [];

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages,
        tools,
        tool_choice: "auto",
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`DeepSeek API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const message = choice?.message;

    if (message?.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      const args = JSON.parse(toolCall.function.arguments || "{}");

      if (toolCall.function.name === "check_availability") {
        proposedSlots = await checkFreeSlots(args.date);

        // Follow up request to DeepSeek with tool response
        const followUpMessages: DeepSeekMessage[] = [
          ...messages,
          message,
          {
            role: "tool",
            tool_call_id: toolCall.id,
            name: "check_availability",
            content: JSON.stringify({ availableSlots: proposedSlots }),
          },
        ];

        const followUpRes = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: followUpMessages,
          }),
        });

        const followUpData = await followUpRes.json();
        const finalReply = followUpData.choices?.[0]?.message?.content || "";

        const quickReplies: string[] = proposedSlots.slice(0, 3).map((s) => s.formatted);

        return {
          reply: finalReply,
          quickReplies,
          proposedSlots,
          bookingConfirmed: false,
        };
      } else if (toolCall.function.name === "confirm_booking") {
        const confirmation = await createAppointment(
          {
            customerName: args.clientName,
            customerPhone: args.clientPhone,
            serviceTitle: args.serviceTitle,
            slotIsoString: args.slotIsoString || new Date().toISOString(),
            notes: args.notes,
          },
          profile.businessName
        );

        bookingConfirmed = true;
        bookingDetails = {
          service: args.serviceTitle,
          slot: args.slotIsoString,
          clientName: args.clientName,
          clientPhone: args.clientPhone,
          calendarEventId: confirmation.bookingId,
        };

        const followUpMessages: DeepSeekMessage[] = [
          ...messages,
          message,
          {
            role: "tool",
            tool_call_id: toolCall.id,
            name: "confirm_booking",
            content: JSON.stringify({
              status: "success",
              bookingId: confirmation.bookingId,
              message: "Afspraak succesvol geboekt in Google Agenda.",
            }),
          },
        ];

        const followUpRes = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: followUpMessages,
          }),
        });

        const followUpData = await followUpRes.json();
        const finalReply = followUpData.choices?.[0]?.message?.content || "";

        return {
          reply: finalReply,
          bookingConfirmed: true,
          bookingDetails,
        };
      }
    }

    const replyText = message?.content || "";

    // Extract quick replies if any times were mentioned
    const quickReplies: string[] = [];
    const timeRegex = /(maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag|morgen|overmorgen)?\s*(om|\bat\b)?\s*(\d{1,2}:\d{2})\s*(uur)?/gi;
    let match;
    while ((match = timeRegex.exec(replyText)) !== null) {
      const fullMatch = match[0].trim();
      if (fullMatch.length >= 5 && !quickReplies.includes(fullMatch) && quickReplies.length < 3) {
        const formatted = fullMatch.charAt(0).toUpperCase() + fullMatch.slice(1);
        quickReplies.push(formatted);
      }
    }

    return {
      reply: replyText,
      quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
      bookingConfirmed: false,
    };
  } catch (err: any) {
    console.error("[deepseek] Error calling DeepSeek API:", err);
    throw err;
  }
}
