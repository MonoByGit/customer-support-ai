import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { BusinessProfile, BusinessProfileSchema } from "./schemas";
import { checkFreeSlots, createAppointment } from "./calendar";
import { slugify } from "./storage";

function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * 1. Extract structured BusinessProfile JSON from scraped web content using Gemini
 */
export async function extractBusinessProfileFromText(
  scrapedContent: {
    title: string;
    metaDescription: string;
    cleanText: string;
    phoneMatches: string[];
    emailMatches: string[];
    url: string;
  }
): Promise<BusinessProfile> {
  const gemini = getGeminiClient();

  if (!gemini) {
    console.warn("[gemini] No GEMINI_API_KEY set. Generating deterministic profile from scraped content.");
    return generateFallbackProfile(scrapedContent);
  }

  try {
    const model = gemini.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const prompt = `Je bent een AI specialist die bedrijfswebsites analyseert om een interactieve WhatsApp Boekingsassistent in te richten.
Analyseer onderstaande website gegevens en produceer een gestructureerd JSON object volgens dit schema:

Schema verwachting:
{
  "businessName": "Duidelijke officiële bedrijfsnaam",
  "slug": "url-vriendelijke-slug",
  "industry": "dental" | "salon" | "trades" | "general",
  "tagline": "Korte pakkende slogan van 1 zin",
  "phone": "Telefoonnummer (of gevonden kandidaat)",
  "email": "Emailadres (of gevonden kandidaat)",
  "address": "Locatie of werkgebied",
  "openingHours": "Openingstijden samenvatting",
  "websiteUrl": "${scrapedContent.url}",
  "services": [
    {
      "id": "korte_id",
      "title": "Naam van de behandeling/dienst",
      "durationMinutes": 30 of 45 of 60,
      "price": "bijv. €45 of Op aanvraag",
      "description": "Korte toelichting van 1 zin"
    }
  ],
  "faqs": [
    {
      "question": "Veelgestelde vraag relevant voor dit bedrijf",
      "answer": "Kort en behulpzaam antwoord"
    }
  ],
  "toneOfVoice": "Warm, vriendelijk en direct to-the-point",
  "customGreeting": "Natuurlijke welkomstboodschap in WhatsApp stijl voor dit specifieke bedrijf",
  "avatarUrl": "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=150&auto=format&fit=crop&q=80"
}

Belangrijk:
- Genereer minimaal 3 en maximaal 5 herkenbare diensten/behandelingen die klanten via WhatsApp kunnen boeken.
- Bedenk minstens 2 relevante FAQs (bijv. over vergoedingen, wachttijd, parkeren of annuleren).
- Schrijf alles in natuurlijk Nederlands tenzij de website overduidelijk Engelstalig is.

Website Gegevens:
Titel: ${scrapedContent.title}
Omschrijving: ${scrapedContent.metaDescription}
Gevonden Telefoons: ${scrapedContent.phoneMatches.join(", ") || "Geen"}
Gevonden Emails: ${scrapedContent.emailMatches.join(", ") || "Geen"}
Tekstinhoud:
${scrapedContent.cleanText.slice(0, 10000)}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    // Ensure slug is clean
    if (!parsed.slug || parsed.slug.length < 2) {
      parsed.slug = slugify(parsed.businessName || scrapedContent.title);
    }
    parsed.slug = slugify(parsed.slug);
    parsed.websiteUrl = scrapedContent.url;

    return BusinessProfileSchema.parse(parsed);
  } catch (error) {
    console.error("[gemini] Error during profile extraction:", error);
    return generateFallbackProfile(scrapedContent);
  }
}

function generateFallbackProfile(scrapedContent: {
  title: string;
  metaDescription: string;
  cleanText: string;
  phoneMatches: string[];
  emailMatches: string[];
  url: string;
}): BusinessProfile {
  const name = scrapedContent.title.split("|")[0].split("-")[0].trim() || "Bedrijf";
  const slug = slugify(name);

  return {
    businessName: name,
    slug: slug || "bedrijf-demo",
    industry: "general",
    tagline: scrapedContent.metaDescription || "Persoonlijke service en directe afspraken via WhatsApp.",
    phone: scrapedContent.phoneMatches[0] || "+31 20 555 0199",
    email: scrapedContent.emailMatches[0] || "contact@demo.nl",
    address: "Nederland",
    openingHours: "Maandag t/m Vrijdag: 09:00 - 17:30",
    websiteUrl: scrapedContent.url,
    services: [
      {
        id: "intake",
        title: "Eerste Consult & Adviesgesprek",
        durationMinutes: 30,
        price: "Kosteloos",
        description: "Vrijblijvende kennismaking om uw wensen en opties te bespreken.",
      },
      {
        id: "standaard",
        title: "Standaard Behandeling / Afspraak",
        durationMinutes: 45,
        price: "€65,00",
        description: "Volledige reguliere afspraak volgens afgesproken specificaties.",
      },
      {
        id: "uitgebreid",
        title: "Uitgebreide Sessie / Spoedservice",
        durationMinutes: 60,
        price: "€110,00",
        description: "Diepgaande behandeling of snelle service met prioriteit.",
      },
    ],
    faqs: [
      {
        question: "Hoe snel kan ik terecht voor een afspraak?",
        answer: "Meestal hebben we binnen 24 tot 48 uur plek in de agenda. Vraag gerust naar de beschikbare tijden!",
      },
      {
        question: "Hoe kan ik annuleren?",
        answer: "U kunt tot 24 uur van tevoren kosteloos annuleren door simpelweg een berichtje te sturen.",
      },
    ],
    toneOfVoice: "Vriendelijk, professioneel en vlot.",
    customGreeting: `Welkom bij ${name}! 👋 Hoe kan ik je vandaag helpen? Wil je direct een afspraak inplannen of heb je een vraag?`,
    avatarUrl: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=150&auto=format&fit=crop&q=80",
  };
}

/**
 * 2. WhatsApp Agent Tool Declarations for Gemini Flash
 */
const checkAvailabilityTool: FunctionDeclaration = {
  name: "check_availability",
  description: "Check open calendar appointment slots for the business. Use this as soon as a customer expresses interest in booking or selecting a service.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      startDate: {
        type: SchemaType.STRING,
        description: "The preferred date in YYYY-MM-DD format (or ISO string) to start looking for slots.",
      },
      serviceDurationMinutes: {
        type: SchemaType.NUMBER,
        description: "Estimated duration of the service in minutes (defaults to 30).",
      },
      preferredTimeOfDay: {
        type: SchemaType.STRING,
        description: "Optional preference for morning or afternoon times ('morning', 'afternoon', or 'any').",
      },
    },
    required: ["startDate"],
  },
};

const confirmBookingTool: FunctionDeclaration = {
  name: "confirm_booking",
  description: "Confirm and book the chosen appointment in the calendar once the customer has provided their Full Name and Phone Number and selected a specific time slot.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      customerName: {
        type: SchemaType.STRING,
        description: "Customer's full name.",
      },
      customerPhone: {
        type: SchemaType.STRING,
        description: "Customer's phone number.",
      },
      customerEmail: {
        type: SchemaType.STRING,
        description: "Optional customer email.",
      },
      serviceTitle: {
        type: SchemaType.STRING,
        description: "Title of the service being booked.",
      },
      slotIsoString: {
        type: SchemaType.STRING,
        description: "Exact ISO 8601 string of the agreed appointment start time.",
      },
      notes: {
        type: SchemaType.STRING,
        description: "Optional special requests or remarks.",
      },
    },
    required: ["customerName", "customerPhone", "serviceTitle", "slotIsoString"],
  },
};

/**
 * 3. Compiles the system instructions for the WhatsApp receptionist
 */
export function compileSystemPrompt(profile: BusinessProfile): string {
  const servicesList = profile.services
    .map(
      (s) => `- ${s.title} (${s.durationMinutes} min, ${s.price || "prijs op aanvraag"}): ${s.description || ""}`
    )
    .join("\n");

  const faqsList = profile.faqs
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join("\n\n");

  return `Je bent de vriendelijke, efficiënte en behulpzame WhatsApp assistent van "${profile.businessName}".
Je spreekt klanten direct aan in een natuurlijke, menselijke WhatsApp-stijl.

BEDRIJFSINFORMATIE:
- Bedrijfsnaam: ${profile.businessName}
- Adres: ${profile.address || "Op aanvraag"}
- Telefoon: ${profile.phone || "Onbekend"}
- Openingstijden: ${profile.openingHours || "Ma-Vr 09:00-17:30"}
- Toon van het gesprek: ${profile.toneOfVoice}

BESCHIKBARE DIENSTEN:
${servicesList}

VEELGESTELDE VRAGEN & ANTWOORDEN:
${faqsList}

BELANGRIJKE GESPREKSREGELS VOOR WHATSAPP:
1. MAXIMAAL 2 TOT 3 KORTE ZINNEN PER BERICHT. Houd het vlot, to-the-point en WhatsApp-achtig. Geen lange lappen tekst of overdreven formele brieftaal.
2. VRIENDELIJK & EMOTICONS: Gebruik af en toe een passende emoji (bijv. 👋, 📅, ✨, 👍) om het gesprek warm te houden.
3. PROACTIEF AFSPRAAK PROPOSEN:
   - Zodra de klant vraagt om een afspraak of een dienst kiest, roep direct de tool \`check_availability\` aan.
   - Stel daarna concreet 2 opties voor (bijv. "Ik heb donderdag om 10:00 uur of vrijdag om 14:00 uur vrij. Welke van de twee past jou het beste?").
4. GEGEVENS VERZAMELEN:
   - Voordat je definitief boekt met \`confirm_booking\`, vraag altijd vriendelijk naar de **Volledige Naam** en het **Telefoonnummer** van de klant als deze nog niet bekend zijn.
5. NA HET BOEKEN:
   - Roep de tool \`confirm_booking\` aan met de exacte parameters.
   - Bevestig daarna kort en enthousiast dat de afspraak staat en dat er een bevestiging is klaargezet!
`;
}

/**
 * 4. Main Chat Engine handler with tool execution
 */
export async function executeChatTurn(
  profile: BusinessProfile,
  history: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  currentMessage: string
) {
  const gemini = getGeminiClient();

  // If no Gemini API key is configured, provide an intelligent rule-based agent loop
  if (!gemini) {
    return await executeFallbackChatTurn(profile, history, currentMessage);
  }

  try {
    const model = gemini.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: compileSystemPrompt(profile),
      tools: [{ functionDeclarations: [checkAvailabilityTool, confirmBookingTool] }],
    });

    // Format chat history for Gemini API
    const formattedHistory = history
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    let result = await chat.sendMessage(currentMessage);
    let response = result.response;
    let functionCalls = response.functionCalls();

    let bookingDataResult = null;
    let proposedSlotsResult: any[] = [];

    // Loop to handle tool calling if Gemini demands tool execution
    while (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      console.log(`[gemini] Tool call requested: ${call.name}`, call.args);

      if (call.name === "check_availability") {
        const args = call.args as any;
        const slots = await checkFreeSlots(
          args.startDate || new Date().toISOString(),
          args.serviceDurationMinutes || 30,
          args.preferredTimeOfDay
        );
        proposedSlotsResult = slots;

        result = await chat.sendMessage([
          {
            functionResponse: {
              name: "check_availability",
              response: {
                availableSlots: slots.map((s) => ({
                  isoString: s.iso,
                  formattedDescription: s.formatted,
                })),
              },
            },
          },
        ]);
        response = result.response;
        functionCalls = response.functionCalls();
      } else if (call.name === "confirm_booking") {
        const args = call.args as any;
        const booking = await createAppointment(
          {
            customerName: args.customerName,
            customerPhone: args.customerPhone,
            customerEmail: args.customerEmail,
            serviceTitle: args.serviceTitle,
            slotIsoString: args.slotIsoString,
            notes: args.notes,
          },
          profile.businessName
        );
        bookingDataResult = booking;

        result = await chat.sendMessage([
          {
            functionResponse: {
              name: "confirm_booking",
              response: {
                status: "confirmed",
                bookingId: booking.bookingId,
                details: booking,
              },
            },
          },
        ]);
        response = result.response;
        functionCalls = response.functionCalls();
      } else {
        break;
      }
    }

    const replyText = response.text() || "Ik heb je bericht ontvangen!";

    return {
      text: replyText,
      bookingData: bookingDataResult,
      proposedSlots: proposedSlotsResult.length > 0 ? proposedSlotsResult : undefined,
    };
  } catch (error) {
    console.error("[gemini] Error executing chat turn:", error);
    return await executeFallbackChatTurn(profile, history, currentMessage);
  }
}

/**
 * Intelligent Fallback Agent Loop (Runs 100% offline / without API key for flawless previews)
 */
async function executeFallbackChatTurn(
  profile: BusinessProfile,
  history: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  currentMessage: string
) {
  const lower = currentMessage.toLowerCase();

  // 1. Check if user is confirming or providing details
  const phoneMatch = currentMessage.match(/(?:(?:\+|00)31|0)(?:\s|\-)?(?:\(0\))?[1-9](?:[\s\-]?[0-9]){8}/);
  const isPickingSlot = lower.includes("uur") || lower.includes("optie") || lower.includes("morgen") || lower.includes("donderdag") || lower.includes("vrijdag");

  if (phoneMatch || (lower.includes("@") && history.length >= 2)) {
    // Booking confirmation intent
    const slots = await checkFreeSlots(undefined, 30);
    const chosenSlot = slots[0] || {
      iso: new Date(Date.now() + 86400000).toISOString(),
      formatted: "morgen om 10:00 uur",
      durationMinutes: 30,
    };

    const booking = await createAppointment(
      {
        customerName: extractName(currentMessage) || "Klant",
        customerPhone: phoneMatch ? phoneMatch[0] : "+31 6 12345678",
        serviceTitle: profile.services[0]?.title || "Afspraak",
        slotIsoString: chosenSlot.iso,
      },
      profile.businessName
    );

    return {
      text: `Super, dankjewel! 🎉 Ik heb de afspraak direct in de agenda gezet voor ${chosenSlot.formatted}. Je ontvangt zo dadelijk een bevestiging!`,
      bookingData: booking,
    };
  }

  // 2. Service selection or availability intent
  const matchedService = profile.services.find(
    (s) => lower.includes(s.title.toLowerCase()) || lower.includes(s.id.toLowerCase())
  );

  if (matchedService || lower.includes("afspraak") || lower.includes("boeken") || lower.includes("tijd") || isPickingSlot) {
    const serviceName = matchedService ? matchedService.title : profile.services[0]?.title || "de afspraak";
    const slots = await checkFreeSlots(undefined, matchedService?.durationMinutes || 30);

    const slot1 = slots[0]?.formatted || "Morgen om 10:00 uur";
    const slot2 = slots[1]?.formatted || "Vrijdag om 14:00 uur";

    return {
      text: `Gezellig! Voor ${serviceName} heb ik onder andere de volgende plekken vrij in de agenda:\n\n1️⃣ ${slot1}\n2️⃣ ${slot2}\n\nWelke van deze twee komt jou het beste uit?`,
      proposedSlots: slots,
    };
  }

  // 3. FAQ checking
  const matchedFaq = profile.faqs.find((f) =>
    f.question.toLowerCase().split(" ").some((w) => w.length > 4 && lower.includes(w))
  );

  if (matchedFaq) {
    return {
      text: `${matchedFaq.answer}\n\nWil je dat ik alvast een afspraak voor je inplan?`,
    };
  }

  // 4. Default helpful receptionist response
  return {
    text: `Leuk dat je contact opneemt met ${profile.businessName}! ✨ Ik kan je direct helpen met het inplannen van een afspraak voor bijvoorbeeld ${profile.services[0]?.title || "een consult"}. Zullen we een tijdstip prikken?`,
  };
}

function extractName(text: string): string | null {
  const parts = text.split(/[\n,.]/);
  for (const part of parts) {
    const words = part.trim().split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && !part.includes("@") && !part.match(/\d/)) {
      return part.trim();
    }
  }
  return null;
}
