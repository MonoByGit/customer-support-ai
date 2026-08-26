import { GoogleGenerativeAI } from "@google/generative-ai";
import { BusinessProfile, BusinessProfileSchema, ChatMessage as SchemaChatMessage, BookingConfirmation } from "./schemas";
import { checkFreeSlots, createAppointment, AvailableSlot } from "./calendar";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export interface ChatMessage {
  role: "user" | "model" | "system";
  content: string;
}

/**
 * 1. Extract structured BusinessProfile from raw scraped website HTML/text using Gemini
 */
export async function extractBusinessProfileFromText(input: string | any): Promise<BusinessProfile> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const scrapedText = typeof input === "string" 
    ? input 
    : `Titel: ${input.title}\nBeschrijving: ${input.metaDescription}\nKoppen: ${input.headings?.join(", ")}\nInhoud: ${input.cleanText}\nTelefoon: ${input.phoneMatches?.join(", ")}\nEmail: ${input.emailMatches?.join(", ")}\nURL: ${input.url}`;

  const prompt = `
Je bent een data-extractie expert voor Nederlandse MKB websites (tandartsen, kapsalons, loodgieters, fysiotherapeuten, klinieken).
Analyseer de onderstaande website-inhoud en structureer alle bedrijfsinformatie in JSON volgens dit exacte schema:

{
  "businessName": "string",
  "slug": "url-friendly-slug-lowercase",
  "industry": "dental" | "salon" | "trades" | "general",
  "tagline": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "openingHours": "string",
  "websiteUrl": "string",
  "services": [
    {
      "id": "string",
      "title": "string",
      "durationMinutes": 30,
      "price": "string",
      "description": "string"
    }
  ],
  "faqs": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "toneOfVoice": "Warm, empathisch, professioneel en behulpzaam",
  "customGreeting": "string"
}

WEBSITE CONTENT:
${scrapedText.slice(0, 15000)}
`;

  const result = await model.generateContent(prompt);
  const jsonText = result.response.text();
  const parsed = JSON.parse(jsonText);
  return BusinessProfileSchema.parse(parsed);
}

/**
 * 2. High-Empathy, Warm Customer Chat Processor with Function Calling
 */
export async function processCustomerMessage(
  profile: BusinessProfile,
  conversationHistory: ChatMessage[],
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
  const tools: any = [
    {
      functionDeclarations: [
        {
          name: "check_availability",
          description: "Controleer beschikbare agenda tijdsloten voor een datum of gewenste dag (bijv. morgen, donderdag, 2026-08-27).",
          parameters: {
            type: "OBJECT",
            properties: {
              date: {
                type: "STRING",
                description: "De datum om te controleren in YYYY-MM-DD formaat of relatieve datum zoals 'morgen', 'donderdag'.",
              },
              serviceTitle: {
                type: "STRING",
                description: "De naam van de behandeling of dienst (optioneel).",
              },
            },
            required: ["date"],
          },
        },
        {
          name: "confirm_booking",
          description: "Definitief inboeken van een geverifieerde afspraak in de Google Agenda nadat de klant het tijdslot, naam en telefoonnummer heeft bevestigd.",
          parameters: {
            type: "OBJECT",
            properties: {
              serviceTitle: {
                type: "STRING",
                description: "De geselecteerde dienst of behandeling.",
              },
              slotIsoString: {
                type: "STRING",
                description: "De gekozen starttijd in ISO formaat (bijv. '2026-08-27T10:00:00.000Z') of datumomschrijving.",
              },
              clientName: {
                type: "STRING",
                description: "De volledige naam van de klant/patiënt.",
              },
              clientPhone: {
                type: "STRING",
                description: "Het telefoonnummer van de klant voor WhatsApp herinneringen.",
              },
              notes: {
                type: "STRING",
                description: "Eventuele specifieke klachten of wensen van de klant.",
              },
            },
            required: ["serviceTitle", "slotIsoString", "clientName", "clientPhone"],
          },
        },
      ],
    },
  ];

  const systemInstruction = `
Je bent de virtuele receptionist en praktijkassistent van "${profile.businessName}" via WhatsApp.
Je spreekt vloeiend, natuurlijk en warm Nederlands.

HUIDIGE DATUM EN TIJD CONTEXT: Woensdag 26 augustus 2026, 13:45 uur.

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

3. GOOGLE AGENDA FUNCTION CALLS:
   - Roep 'check_availability' aan wanneer iemand vraagt naar beschikbare dagen of tijden.
   - Roep 'confirm_booking' aan zodra de klant een specifiek tijdslot heeft gekozen en de naam + telefoonnummer bekend zijn.

4. WHATSAPP BERICHTEN OPMAAK:
   - Houd WhatsApp berichten beknopt, overzichtelijk en vriendelijk. Gebruik 1 of 2 relevante emoji's (zoals 👋, 🦷, ✂️, 🔧, ✨).
`;

  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    systemInstruction,
    tools,
  });

  // Google Generative AI SDK requires history to start with 'user' role and alternate
  let rawHistory = conversationHistory.map((m) => ({
    role: (m.role === "user" ? "user" : "model") as "user" | "model",
    parts: [{ text: m.content }],
  }));

  // Drop leading model greeting if present
  while (rawHistory.length > 0 && rawHistory[0].role === "model") {
    rawHistory.shift();
  }

  // Ensure alternating turns
  const cleanHistory: typeof rawHistory = [];
  for (const item of rawHistory) {
    if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1].role !== item.role) {
      cleanHistory.push(item);
    }
  }

  const chat = model.startChat({
    history: cleanHistory,
  });

  let response = await chat.sendMessage(incomingMessage);
  let functionCalls = response.response.functionCalls();

  let bookingConfirmed = false;
  let bookingDetails: any = null;
  let proposedSlots: AvailableSlot[] = [];

  if (functionCalls && functionCalls.length > 0) {
    for (const call of functionCalls) {
      if (call.name === "check_availability") {
        const { date } = call.args as any;
        proposedSlots = await checkFreeSlots(date);

        response = await chat.sendMessage([
          {
            functionResponse: {
              name: "check_availability",
              response: { availableSlots: proposedSlots },
            },
          },
        ]);
      } else if (call.name === "confirm_booking") {
        const { serviceTitle, slotIsoString, clientName, clientPhone, notes } = call.args as any;
        const confirmation = await createAppointment(
          {
            customerName: clientName,
            customerPhone: clientPhone,
            serviceTitle,
            slotIsoString: slotIsoString || new Date().toISOString(),
            notes,
          },
          profile.businessName
        );

        bookingConfirmed = true;
        bookingDetails = {
          service: serviceTitle,
          slot: slotIsoString,
          clientName,
          clientPhone,
          calendarEventId: confirmation.bookingId,
        };

        response = await chat.sendMessage([
          {
            functionResponse: {
              name: "confirm_booking",
              response: {
                status: "success",
                bookingId: confirmation.bookingId,
                message: "Afspraak succesvol geboekt in Google Agenda.",
              },
            },
          },
        ]);
      }
    }
  }

  const replyText = response.response.text();

  // Extract quick replies from text or proposed slots
  const quickReplies: string[] = [];
  if (proposedSlots.length > 0) {
    proposedSlots.slice(0, 3).forEach((s) => quickReplies.push(s.formatted));
  } else {
    const timeRegex = /(maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag|morgen|overmorgen)?\s*(om|\bat\b)?\s*(\d{1,2}:\d{2})\s*(uur)?/gi;
    let match;
    while ((match = timeRegex.exec(replyText)) !== null) {
      const fullMatch = match[0].trim();
      if (fullMatch.length >= 5 && !quickReplies.includes(fullMatch) && quickReplies.length < 3) {
        const formatted = fullMatch.charAt(0).toUpperCase() + fullMatch.slice(1);
        quickReplies.push(formatted);
      }
    }
  }

  return {
    reply: replyText,
    quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
    bookingConfirmed,
    bookingDetails,
    proposedSlots: proposedSlots.length > 0 ? proposedSlots : undefined,
  };
}

/**
 * 3. Backward-compatible helper for Meta Webhook dispatcher
 */
export async function executeChatTurn(
  profile: BusinessProfile,
  history: SchemaChatMessage[],
  incomingUserText: string
): Promise<{
  text: string;
  bookingData?: BookingConfirmation;
  proposedSlots?: Array<{ iso: string; formatted: string }>;
}> {
  const convertedHistory: ChatMessage[] = history.map((h) => ({
    role: h.role === "user" ? "user" : "model",
    content: h.content,
  }));

  const res = await processCustomerMessage(profile, convertedHistory, incomingUserText);

  return {
    text: res.reply,
    proposedSlots: res.proposedSlots?.map((s) => ({ iso: s.iso, formatted: s.formatted })),
  };
}
