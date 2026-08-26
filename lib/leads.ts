import { BusinessProfile } from "./schemas";

export type LeadStage = "geconverteerd" | "hot" | "gesprek" | "gereed";

export interface ClientSessionItem {
  profile: BusinessProfile;
  session: {
    slug: string;
    businessName: string;
    startTime: number | null;
    maxDurationMinutes: number;
    messageCount: number;
    maxMessages: number;
    tokensUsed: number;
    maxTokens: number;
    isExpired: boolean;
    lastActive?: number;
    messages: Array<{
      id: string;
      sender: "user" | "agent" | "system";
      text: string;
      timestamp: string;
      isBookingCard?: boolean;
    }>;
  };
  remainingMinutes: number;
  hasStarted: boolean;
  messageCount: number;
  maxMessages: number;
  tokensUsed: number;
  maxTokens: number;
  isExpired: boolean;
}

export interface StageMeta {
  stage: LeadStage;
  label: string;
  /** Waarom deze prospect nu deze status heeft — zichtbaar in het portaal. */
  reason: string;
  dot: string;
  chip: string;
  priority: number;
}

/** Woorden die in een WhatsApp-gesprek op koopintentie wijzen. */
const BUYING_SIGNALS = [
  "prijs", "prijzen", "tarief", "tarieven", "kosten", "wat kost",
  "offerte", "contract", "abonnement", "aanmelden", "starten",
  "wanneer kan", "hoe snel", "interesse", "afspraak", "inplannen",
];

export function detectBuyingSignals(item: ClientSessionItem): string[] {
  const found = new Set<string>();
  for (const m of item.session.messages) {
    if (m.sender !== "user") continue;
    const text = m.text.toLowerCase();
    for (const signal of BUYING_SIGNALS) {
      if (text.includes(signal)) found.add(signal);
    }
  }
  return Array.from(found).slice(0, 4);
}

export function getLeadStage(item: ClientSessionItem): StageMeta {
  const hasBooking = item.session.messages.some((m) => m.isBookingCard);

  if (hasBooking) {
    return {
      stage: "geconverteerd",
      label: "Geconverteerd",
      reason: "Afspraak bevestigd in de agenda",
      dot: "bg-[#2196F3]",
      chip: "bg-[#2196F3]/10 text-[#1565C0] dark:text-[#64B5F6] border-[#2196F3]/25",
      priority: 0,
    };
  }

  const signals = detectBuyingSignals(item);
  if (signals.length >= 1 || item.messageCount >= 4) {
    return {
      stage: "hot",
      label: "Hot lead",
      reason: signals.length
        ? `Koopsignaal: ${signals.slice(0, 2).join(", ")}`
        : `${item.messageCount} berichten uitgewisseld`,
      dot: "bg-[#FF9100]",
      chip: "bg-[#FF9100]/10 text-[#B35F00] dark:text-[#FF9100] border-[#FF9100]/30",
      priority: 1,
    };
  }

  if (item.hasStarted && item.messageCount > 0) {
    return {
      stage: "gesprek",
      label: "In gesprek",
      reason: `${item.messageCount} ${item.messageCount === 1 ? "bericht" : "berichten"} tot nu toe`,
      dot: "bg-emerald-500",
      chip: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
      priority: 2,
    };
  }

  return {
    stage: "gereed",
    label: "Gereed",
    reason: "Klaar om te versturen, nog niet geopend",
    dot: "bg-slate-400",
    chip: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-400/25",
    priority: 3,
  };
}

export interface OutreachTemplate {
  id: string;
  channel: "whatsapp" | "email";
  name: string;
  hint: string;
  subject?: string;
  body: string;
}

/**
 * Gepersonaliseerde outreach, afgestemd op waar de prospect in de funnel staat.
 * Alles is kopieerbare tekst: er wordt nooit automatisch namens de gebruiker verzonden.
 */
export function buildOutreachTemplates(
  item: ClientSessionItem,
  origin: string
): OutreachTemplate[] {
  const p = item.profile;
  const stage = getLeadStage(item);
  const link = `${origin}/live/${p.slug}`;
  const portal = `${origin}/portal/${p.slug}`;
  const firstService = p.services[0]?.title || "uw behandelingen";
  const site = p.websiteUrl || p.businessName;

  const opener =
    stage.stage === "geconverteerd"
      ? `U heeft zojuist een afspraak vastgelegd via de assistent — precies zoals uw klanten dat straks doen.`
      : stage.stage === "hot"
      ? `Ik zag dat u de assistent uitgebreid heeft getest.`
      : `Ik heb iets voor ${p.businessName} klaargezet.`;

  return [
    {
      id: "wa-eerste",
      channel: "whatsapp",
      name: "WhatsApp — eerste benadering",
      hint: "Hoogste responspercentage. Kort houden, link doet het werk.",
      body: `Goedendag,

Veel bezoekers van ${site} kijken 's avonds rond en haken af op het contactformulier — precies de momenten waarop uw balie dicht is.

Ik heb alvast een werkende WhatsApp-assistent voor ${p.businessName} ingericht, met uw eigen ${firstService.toLowerCase()} en tarieven erin. U kunt hem hier zelf uitproberen:

${link}

Benieuwd wat u ervan vindt.`,
    },
    {
      id: "wa-opvolging",
      channel: "whatsapp",
      name: "WhatsApp — opvolging na test",
      hint: "Stuur binnen 24 uur nadat de prospect heeft getest.",
      body: `${opener}

Zal ik hem deze week live zetten op ${site}? Dat is één regel code op uw site, en de koppeling met uw Google Agenda regel ik erbij. U bent binnen twee minuten operationeel:

${portal}

Wanneer schikt een kort belmoment?`,
    },
    {
      id: "mail-voorstel",
      channel: "email",
      name: "E-mail — inhoudelijk voorstel",
      hint: "Voor praktijkmanagers en beslissers die het schriftelijk willen.",
      subject: `WhatsApp-afsprakenassistent voor ${p.businessName} — werkend voorbeeld`,
      body: `Geachte heer/mevrouw,

Ik heb voor ${p.businessName} een werkende WhatsApp-afsprakenassistent ingericht op basis van de informatie op ${site}. Hij kent uw diensten, tarieven en openingstijden en kan zelfstandig afspraken vastleggen in uw Google Agenda.

U kunt hem vrijblijvend testen:
${link}

Wat het concreet oplevert:
• Afspraken worden ook buiten kantoortijden vastgelegd, wanneer ruim vier op de tien aanvragen binnenkomen.
• WhatsApp wordt in 98% van de gevallen binnen enkele minuten gelezen; e-mail blijft rond de 20% steken.
• Uw balie wordt niet meer onderbroken voor standaard inplanvragen.

Live gaan kost twee minuten: één scriptregel op uw website en het delen van uw agenda. De implementatiepagina staat klaar:
${portal}

Ik hoor graag of het interessant is.

Met vriendelijke groet,`,
    },
    {
      id: "mail-herinnering",
      channel: "email",
      name: "E-mail — vriendelijke herinnering",
      hint: "Stuur na vijf werkdagen zonder reactie.",
      subject: `Nog even over de assistent voor ${p.businessName}`,
      body: `Geachte heer/mevrouw,

Vorige week stuurde ik u een werkend voorbeeld van een WhatsApp-afsprakenassistent voor ${p.businessName}. Het voorbeeld staat nog steeds klaar:

${link}

Mocht het nu niet uitkomen, dan hoor ik dat ook prima — dan laat ik het hierbij.

Met vriendelijke groet,`,
    },
  ];
}
