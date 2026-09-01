import { BusinessProfile } from "./schemas";
import { checkFreeSlots, createAppointment, AvailableSlot } from "./calendar";
import { readEnv } from "./env";
import { humanHandoffReply, requestsHuman } from "./conversation-policy";

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
  "industry": "dental" | "salon" | "trades" | "garage" | "beauty" | "general",
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
  "customGreeting": "Hoi, u spreekt met Verdi, de digitale collega van [bedrijfsnaam]. Waarmee kan ik u helpen?"
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
  tokensUsed: number;
}> {
  if (requestsHuman(incomingMessage)) {
    return {
      reply: humanHandoffReply(profile),
      bookingConfirmed: false,
      tokensUsed: 0,
    };
  }

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
GESPREKSPROTOCOL — EERST OPVANGEN, DAN PAS OPLOSSEN
================================================================================
Dit protocol is het product. Mensen kiezen deze assistent niet omdat hij kan
boeken, maar omdat het gesprek aanvoelt alsof er iemand luistert. Snelheid en
gemak zijn het gevolg, nooit het uitgangspunt.

FASE 1 — OPVANGEN. Altijd eerst, altijd kort.
Reageer op wat deze persoon werkelijk zei, in hun eigen woorden. Benoem het
concrete detail dat zij noemden: de drie dagen, de bruiloft van zaterdag, de
kelder die onderloopt. Het detail, niet de categorie. Je eerste bericht bevat
geen oplossing, geen tijdslot en geen vraag om gegevens.

FASE 2 — BEGRIJPEN. Eén vraag, de belangrijkste.
Stel precies één vraag: die welke het meest verandert aan wat je daarna
voorstelt. Nooit een rijtje vragen achter elkaar. Kun je het antwoord al
afleiden uit wat er staat, vraag het dan niet.

FASE 3 — VOORSTELLEN. Hooguit twee opties.
Noem twee concrete momenten, geen agenda-overzicht. Verbind ze aan wat de
persoon zelf zei, bijvoorbeeld dat zij daarmee ruim voor zaterdag klaar zijn.

FASE 4 — VASTLEGGEN. Pas na een keuze.
Vraag naam en telefoonnummer pas nadat iemand een moment gekozen heeft, en
vraag ze in één adem, niet los achter elkaar.

FASE 5 — AFRONDEN.
Bevestig in gewone taal wat er nu staat en wat er hierna gebeurt. Geen
opsomming, geen samenvattingsblok.

================================================================================
HOE JE SCHRIJFT
================================================================================
- WhatsApp is spreektaal. Eén of twee kórte zinnen per bericht, maximaal 45 woorden totaal. Nooit meerdere alinea's. Eén onderwerp per bericht — de rest komt vanzelf in een volgende beurt.
- Geen opsommingen, geen vetgedrukte kopjes, geen markdown, geen kaders. Merk
  je dat je een lijstje aan het maken bent, schrijf het dan als gewone zin.
- Hooguit één emoji, en meestal geen. Nooit een emoji in een bericht dat over
  pijn, schade, kosten of slecht nieuws gaat.
- Spiegel de aanspreekvorm van de klant. Schrijft iemand "je", schrijf dan "je".
- Gebruik nooit twee keer dezelfde formulering in hetzelfde gesprek.

VERSLETEN OPENINGEN — deze verraden een script en zijn hier verboden:
  "Wat ontzettend vervelend..."   "Geen zorgen..."   "Wat leuk dat..."
  "Uiteraard!"   "Ik help u graag verder."   "Bedankt voor uw bericht."
Schrijf in plaats daarvan iets dat alleen op dít gesprek kan slaan.

================================================================================
WAT LUISTEREN HIER BETEKENT
================================================================================
- Wie "al drie dagen" zegt, vraagt om erkenning van die drie dagen.
- Wie naar de prijs vraagt vóór de afspraak, twijfelt over de kosten. Noem het
  bedrag gewoon, zonder eromheen te draaien.
- Wie twee keer hetzelfde vraagt, vertrouwde je eerste antwoord niet. Antwoord
  dan anders, niet nadrukkelijker.
- Wie aarzelt, hoeft niet geduwd te worden. Bied aan om terug te laten bellen.
- Bij twijfel over iets medisch of vaktechnisch: geef geen oordeel, maar leg
  vast dat de behandelaar meekijkt.

================================================================================
GRENZEN
================================================================================
- Vraagt iemand om een mens, medewerker, collega of terugbelactie, respecteer dat direct. Stel geen inhoudelijke vervolgvraag. Vraag alleen om telefoonnummer en passend moment als die nog ontbreken.
- Verzin nooit een dienst, prijs, tijd of toezegging die niet in het profiel staat.
- Weet je iets niet, zeg dat, en bied aan het te laten uitzoeken.
- Beloof nooit een uitkomst van een behandeling.

================================================================================
AGENDA-TOOLS
================================================================================
- Roep 'check_availability' aan zodra iemand naar beschikbaarheid vraagt of
  duidelijk toe is aan een moment. Wacht niet tot er expliciet om gevraagd wordt.
- Roep 'confirm_booking' aan zodra tijdslot, naam en telefoonnummer bekend zijn.
- IJZEREN REGEL: zeg NOOIT dat een afspraak vaststaat, genoteerd is of 'erin staat' zonder dat je in diezelfde beurt confirm_booking hebt aangeroepen. Een bevestiging bestaat alleen via die tool — anders bevestig je iets dat niet bestaat.
- Noem nooit een tijd die niet uit 'check_availability' is gekomen.
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

  // Elke beurt kan meerdere API-calls kosten (tool call plus opvolging).
  // We tellen ze allemaal, anders onderschat de sessielimiet het verbruik.
  let tokensUsed = 0;
  const countTokens = (payload: any) => {
    const total = payload?.usage?.total_tokens;
    if (typeof total === "number") tokensUsed += total;
  };

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
    countTokens(data);
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
        countTokens(followUpData);
        const finalReply = followUpData.choices?.[0]?.message?.content || "";

        const quickReplies: string[] = proposedSlots.slice(0, 3).map((s) => s.formatted);

        return {
          reply: finalReply,
          quickReplies,
          proposedSlots,
          bookingConfirmed: false,
          tokensUsed,
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
        countTokens(followUpData);
        const finalReply = followUpData.choices?.[0]?.message?.content || "";

        return {
          reply: finalReply,
          bookingConfirmed: true,
          bookingDetails,
          tokensUsed,
        };
      }
    }

    let replyText = message?.content || "";

    // DeepSeek lekt een tool-aanroep soms als DSML-markup in de tekst in plaats
    // van in tool_calls (vaak met zelfverzonnen parameternamen). Onderschep dat:
    // voer de bedoelde boeking alsnog uit en laat nooit markup naar een klant gaan.
    if (/DSML|<\uFF5C/.test(replyText)) {
      const naam = replyText.match(/invoke name="([a-z_]+)"/)?.[1];
      const params: Record<string, string> = {};
      const paramRe = /parameter name="([a-zA-Z]+)"[^>]*>([^<]*)</g;
      let pm: RegExpExecArray | null;
      while ((pm = paramRe.exec(replyText)) !== null) params[pm[1]] = pm[2].trim();

      if (naam === "confirm_booking" && (params.slot || params.slotIsoString)) {
        const slotIso = params.slot || params.slotIsoString;
        const confirmation = await createAppointment(
          {
            customerName: params.customerName || params.clientName || "Onbekend",
            customerPhone: params.phoneNumber || params.clientPhone || "",
            serviceTitle: params.serviceTitle || params.service || "Afspraak",
            slotIsoString: slotIso,
            notes: params.notes,
          },
          profile.businessName
        );
        const wanneer = new Date(slotIso).toLocaleString("nl-NL", {
          timeZone: "Europe/Amsterdam",
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        });
        return {
          reply: `Helemaal goed, de afspraak staat: ${wanneer}. Tot dan!`,
          bookingConfirmed: true,
          bookingDetails: {
            service: params.serviceTitle || params.service || "Afspraak",
            slot: slotIso,
            clientName: params.customerName || params.clientName || "Onbekend",
            clientPhone: params.phoneNumber || params.clientPhone || "",
            calendarEventId: confirmation.bookingId,
          },
          tokensUsed,
        };
      }

      console.error("[deepseek] DSML-markup in antwoord onderschept (geen uitvoerbare boeking):", replyText.slice(0, 200));
      replyText = "Een klein moment — ik leg dit voor u vast en kom er direct op terug.";
    }

    // Vangnet tegen loze bevestigingen: claimt het model een afspraak zonder dat
    // confirm_booking is aangeroepen, dan dwingen we de echte boeking alsnog af.
    // Lukt dat niet, dan mag de claim de klant nooit bereiken.
    const CLAIM_RE = /staat genoteerd|staat vast|staat (het )?erin|afspraak staat|zet ik (hem |het )?vast|(heb|is) .{0,24}(ingepland|genoteerd|vastgelegd)/i;
    if (!bookingConfirmed && CLAIM_RE.test(replyText)) {
      console.warn("[deepseek] Bevestigings-claim zonder boeking gedetecteerd — boeking afdwingen.");
      try {
        const forceMessages: DeepSeekMessage[] = [
          ...messages,
          { role: "assistant", content: replyText },
          {
            role: "user",
            content:
              "[SYSTEEM: Je bevestigde zojuist een afspraak in woorden zonder confirm_booking aan te roepen. Roep NU confirm_booking aan met de in dit gesprek besproken gegevens. Verzin niets: gebruik de besproken dienst, het besproken tijdslot en het bekende telefoonnummer van de klant.]",
          },
        ];
        const forceRes = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: modelName,
            messages: forceMessages,
            tools,
            tool_choice: { type: "function", function: { name: "confirm_booking" } },
          }),
        });
        const forceData = await forceRes.json();
        countTokens(forceData);
        const forceCall = forceData.choices?.[0]?.message?.tool_calls?.[0];
        if (forceCall?.function?.name === "confirm_booking") {
          const fargs = JSON.parse(forceCall.function.arguments || "{}");
          const confirmation = await createAppointment(
            {
              customerName: fargs.clientName,
              customerPhone: fargs.clientPhone,
              serviceTitle: fargs.serviceTitle,
              slotIsoString: fargs.slotIsoString || new Date().toISOString(),
              notes: fargs.notes,
            },
            profile.businessName
          );
          bookingConfirmed = true;
          bookingDetails = {
            service: fargs.serviceTitle,
            slot: fargs.slotIsoString,
            clientName: fargs.clientName,
            clientPhone: fargs.clientPhone,
            calendarEventId: confirmation.bookingId,
          };
        }
      } catch (e) {
        console.error("[deepseek] Afdwingen van boeking mislukt:", e);
      }
      if (!bookingConfirmed) {
        replyText =
          "Ik wil hem graag goed voor u vastleggen — kunt u het gewenste moment nog één keer bevestigen? Dan zet ik hem meteen in de agenda.";
      }
    }

    // Leesbaarheid: WhatsApp-berichten horen kort. Loopt het antwoord uit de hand,
    // dan één goedkope inkort-pas — zelfde inhoud en warmte, geen tekstmuur.
    const aantalWoorden = replyText.trim().split(/\s+/).length;
    if (aantalWoorden > 55) {
      try {
        const kortRes = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: "system",
                content:
                  "Herschrijf het WhatsApp-bericht van de gebruiker tot maximaal twee korte zinnen (maximaal 40 woorden totaal). Behoud de inhoud, de warmte en eventuele tijden of bedragen exact. Geen opsommingen, geen alinea's. Antwoord uitsluitend met de herschreven tekst.",
              },
              { role: "user", content: replyText },
            ],
            temperature: 0.2,
            max_tokens: 120,
          }),
        });
        const kortData = await kortRes.json();
        countTokens(kortData);
        const korter = kortData.choices?.[0]?.message?.content?.trim();
        if (korter && korter.split(/\s+/).length < aantalWoorden) {
          replyText = korter;
        }
      } catch (e) {
        console.error("[deepseek] inkort-pas mislukt, origineel behouden:", e);
      }
    }

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
      tokensUsed,
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
  tokensUsed: number;
}> {
  if (requestsHuman(incomingMessage)) {
    return {
      reply: humanHandoffReply(profile),
      bookingConfirmed: false,
      tokensUsed: 0,
    };
  }

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
        tokensUsed: 0,
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
      tokensUsed: 0,
    };
  }

  // Locatie en openingstijden.
  if (/waar|adres|locatie|open|geopend|openingstijd/.test(text)) {
    return {
      reply: `Wij zitten aan ${profile.address || "onze vestiging"} en zijn geopend op ${profile.openingHours || "werkdagen van 08:30 tot 17:30"}. Wilt u dat ik een moment voor u reserveer?`,
      quickReplies: ["Ja, plan een afspraak", "Bel mij liever terug"],
      tokensUsed: 0,
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
    tokensUsed: 0,
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
