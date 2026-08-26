import { BusinessProfile } from "./schemas";
import { checkFreeSlots, createAppointment, AvailableSlot } from "./calendar";
import { readEnv } from "./env";

/**
 * Actuele datum/tijd in Europe/Amsterdam, in natuurlijk Nederlands.
 * Nooit hardcoden: een vastgezette datum laat de assistent stilzwijgend verouderen.
 */
export function nowInAmsterdam(): string {
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Amsterdam",
  }).format(new Date());
}

/** Conversatie-item zoals de API-routes het aanleveren. */
export interface ChatMessage {
  role: "user" | "model" | "assistant" | "system";
  content: string;
}

export interface DeepSeekMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

/**
 * Extract structured BusinessProfile from raw scraped website content using DeepSeek Flash
 */
export async function extractBusinessProfileWithDeepSeek(input: string | any): Promise<BusinessProfile> {
  const apiKey = readEnv("DEEPSEEK_API_KEY") || "";
  const modelName = readEnv("DEEPSEEK_MODEL") || "deepseek-chat";

  const scrapedText = typeof input === "string" 
    ? input 
    : `Titel: ${input.title}\nBeschrijving: ${input.metaDescription}\nKoppen: ${input.headings?.join(", ")}\nInhoud: ${input.cleanText}\nTelefoon: ${input.phoneMatches?.join(", ")}\nEmail: ${input.emailMatches?.join(", ")}\nURL: ${input.url}`;

  const prompt = `
Je bent een data-extractie expert voor Nederlandse MKB websites (tandartsen, kapsalons, loodgieters, fysiotherapeuten, klinieken).
Analyseer de onderstaande website-inhoud en structureer alle bedrijfsinformatie in JSON volgens dit exacte schema (strikte JSON, geen markdown codeblocks):

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

Hier is de website-inhoud:
${scrapedText}
`;

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: "Je bent een JSON API die uitsluitend valide JSON retourneert zonder markdown backticks." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API extraction failed: ${response.status}`);
    }

    const data = await response.json();
    let rawContent = data.choices?.[0]?.message?.content || "{}";
    rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(rawContent);
  } catch (err: any) {
    console.warn("[deepseek] Extraction fallback triggered:", err.message);
    // Deterministic fallback from scraped data
    const title = (typeof input === "object" && input.title) ? input.title : "Bedrijfsprofiel";
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "nieuw-bedrijf";
    return {
      businessName: title,
      slug,
      industry: "general",
      tagline: "Professionele dienstverlening & afsprakenbeheer",
      phone: (typeof input === "object" && input.phoneMatches?.[0]) || "+31 20 123 4567",
      email: (typeof input === "object" && input.emailMatches?.[0]) || "info@bedrijf.nl",
      address: "Nederland",
      openingHours: "Ma-Vr: 08:30 - 17:30",
      websiteUrl: typeof input === "object" ? input.url : "",
      services: [
        { id: "srv-1", title: "Consult / Adviesgesprek", durationMinutes: 30, price: "Gratis" },
        { id: "srv-2", title: "Standaard Behandeling / Afspraak", durationMinutes: 45, price: "€65" },
        { id: "srv-3", title: "Spoedafspraak / Intake", durationMinutes: 30, price: "Op aanvraag" },
      ],
      faqs: [
        { question: "Hoe kan ik een afspraak verzetten?", answer: "Stuur ons simpelweg een WhatsApp berichtje om een nieuw tijdstip te kiezen." },
      ],
      toneOfVoice: "Warm, empathisch, professioneel en behulpzaam",
      customGreeting: `Goedendag! Welkom bij ${title}. Ik help u graag bij het inplannen van uw afspraak.`,
    };
  }
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
  const apiKey = readEnv("DEEPSEEK_API_KEY") || "";
  const modelName = readEnv("DEEPSEEK_MODEL") || "deepseek-chat";

  const systemPrompt = `
Je bent de virtuele receptionist en praktijkassistent van "${profile.businessName}" via WhatsApp.
Je spreekt vloeiend, natuurlijk en warm Nederlands.

HUIDIGE DATUM EN TIJD CONTEXT: ${nowInAmsterdam()}.

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

/**
 * Deterministische fallback-receptionist.
 *
 * Draait wanneer DEEPSEEK_API_KEY ontbreekt of de API faalt. Geen tweede LLM-provider:
 * de engine blijft DeepSeek-only, dit is puur een offline vangnet zodat een prospect
 * nooit tegen een dood scherm aanloopt tijdens een live gesprek.
 */
export async function processCustomerMessageFallback(
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
  const text = incomingMessage.toLowerCase();
  const firstService = profile.services[0];

  const phoneMatch = incomingMessage.match(/(\+?\d[\d\s\-]{7,})/);
  const nameMatch = incomingMessage.match(/(?:naam is|heet|ik ben)\s+([A-Za-zÀ-ÿ' -]{2,40})/i);

  // Klant levert naam + telefoon aan: definitief inboeken.
  if (phoneMatch && nameMatch) {
    const slots = await checkFreeSlots(new Date().toISOString().slice(0, 10));
    const slot = slots[0];
    const serviceTitle = firstService?.title || "Afspraak";

    if (slot) {
      const confirmation = await createAppointment(
        {
          customerName: nameMatch[1].trim(),
          customerPhone: phoneMatch[1].trim(),
          serviceTitle,
          slotIsoString: slot.iso,
        },
        profile.businessName
      );

      return {
        reply: `Helemaal geregeld, ${nameMatch[1].trim()}! ✨ Ik heb ${serviceTitle.toLowerCase()} voor u vastgelegd op ${slot.formatted}. U ontvangt een bevestiging en een herinnering via WhatsApp. Tot dan!`,
        bookingConfirmed: true,
        bookingDetails: {
          service: serviceTitle,
          slot: slot.formatted,
          clientName: nameMatch[1].trim(),
          clientPhone: phoneMatch[1].trim(),
          calendarEventId: confirmation.bookingId,
        },
      };
    }
  }

  // Tarieven en vergoedingen.
  if (/tarief|tarieven|prijs|prijzen|kost|kosten|vergoed/.test(text)) {
    const lines = profile.services
      .slice(0, 4)
      .map((s) => `• ${s.title} — ${s.price || "op aanvraag"} (${s.durationMinutes} min)`)
      .join("\n");
    return {
      reply: `Natuurlijk, ik zet onze tarieven even voor u op een rij:\n\n${lines}\n\nZal ik meteen kijken wanneer u terecht kunt?`,
      quickReplies: ["Ja graag, plan een afspraak", "Ik heb nog een vraag"],
    };
  }

  // Locatie en openingstijden.
  if (/waar|adres|locatie|open|geopend|openingstijd/.test(text)) {
    return {
      reply: `Wij zitten aan ${profile.address || "onze vestiging"} en zijn geopend op ${profile.openingHours || "werkdagen van 08:30 tot 17:30"}. Wilt u dat ik een moment voor u reserveer?`,
      quickReplies: ["Ja, plan een afspraak", "Bel mij liever terug"],
    };
  }

  // Standaard: beschikbaarheid voorstellen.
  const slots = await checkFreeSlots(new Date().toISOString().slice(0, 10));
  const isUrgent = /spoed|pijn|acuut|lekkage|storing|direct/.test(text);
  const opening = isUrgent
    ? "Wat vervelend dat u hier last van heeft! Geen zorgen, wij helpen u zo snel mogelijk."
    : `Wat fijn dat u contact opneemt met ${profile.businessName}!`;

  return {
    reply: `${opening} Voor ${firstService?.title.toLowerCase() || "een afspraak"} hebben wij de volgende momenten vrij:\n\n${slots
      .slice(0, 2)
      .map((s) => `• ${s.formatted}`)
      .join("\n")}\n\nWelk moment schikt u het beste? Laat u ook even uw naam en telefoonnummer achter?`,
    quickReplies: slots.slice(0, 2).map((s) => s.formatted),
    proposedSlots: slots,
  };
}

/**
 * Eén gespreksbeurt, provider-agnostisch aan de aanroepkant.
 * Gebruikt DeepSeek wanneer een sleutel beschikbaar is, anders de fallback hierboven.
 */
export async function executeChatTurn(
  profile: BusinessProfile,
  conversationHistory: ChatMessage[],
  incomingMessage: string
) {
  if (readEnv("DEEPSEEK_API_KEY")) {
    try {
      return await processCustomerMessageWithDeepSeek(profile, conversationHistory, incomingMessage);
    } catch (err) {
      console.error("[deepseek] Turn failed, falling back to deterministic receptionist:", err);
    }
  }
  return processCustomerMessageFallback(profile, conversationHistory, incomingMessage);
}
