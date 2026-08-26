/**
 * Elk cijfer op de website staat hier, met zijn bron.
 *
 * Aanleiding: de eerste versie van de landingspagina stond vol plausibele maar
 * verzonnen percentages. Door de cijfers hier vast te leggen kan een claim niet
 * meer losraken van zijn herkomst — wie een getal wil wijzigen, ziet meteen
 * waar het vandaan komt en hoe hard het is.
 *
 * Gebruik geen enkel cijfer op de site dat hier niet staat.
 */

export type Confidence =
  /** Onafhankelijk onderzoek met gepubliceerde methode en steekproef. */
  | "onderzoek"
  /** Gemeten data, maar door een partij met belang bij de uitkomst. */
  | "platformdata"
  /** Rekenkundig gevolg van bovenstaande, geen eigen meting. */
  | "afgeleid";

export interface Claim {
  id: string;
  /** Het cijfer zoals het op de pagina komt te staan. */
  value: string;
  /** Wat het cijfer zegt, in gewone taal. */
  label: string;
  source: string;
  sourceUrl: string;
  confidence: Confidence;
  /** Waar dit cijfer níét over gaat — voorkomt dat het te ver wordt opgerekt. */
  caveat?: string;
}

/**
 * Belangrijke nuance bij de leadonderzoeken hieronder: ze zijn uitgevoerd op
 * B2B-verkoopleads, niet op tandartspraktijken of salons. Het mechanisme
 * (reactiesnelheid bepaalt de uitkomst) is overdraagbaar, de exacte
 * percentages zijn dat niet. Formuleer op de site dus als "onderzoek naar het
 * opvolgen van online aanvragen laat zien", nooit als "bij praktijken geldt".
 */
export const CLAIMS: Record<string, Claim> = {
  averageResponse: {
    id: "averageResponse",
    value: "42 uur",
    label: "gemiddelde reactietijd op een online aanvraag",
    source: "Harvard Business Review (2011), audit van 2.241 bedrijven",
    sourceUrl: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
    confidence: "onderzoek",
    caveat: "Gemeten bij Amerikaanse B2B-bedrijven, niet bij praktijken.",
  },

  neverRespond: {
    id: "neverRespond",
    value: "23%",
    label: "van de bedrijven reageert helemaal nooit",
    source: "Harvard Business Review (2011), audit van 2.241 bedrijven",
    sourceUrl: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
    confidence: "onderzoek",
  },

  respondWithinFive: {
    id: "respondWithinFive",
    value: "7%",
    label: "reageert binnen vijf minuten",
    source: "Drift Lead Response Report (2017), 433 bedrijven getest",
    sourceUrl: "https://www.drift.com/blog/lead-response-report/",
    confidence: "onderzoek",
  },

  noResponseFiveDays: {
    id: "noResponseFiveDays",
    value: "55%",
    label: "reageert niet binnen vijf werkdagen",
    source: "Drift Lead Response Report (2017), 433 bedrijven getest",
    sourceUrl: "https://www.drift.com/blog/lead-response-report/",
    confidence: "onderzoek",
  },

  qualifyOdds: {
    id: "qualifyOdds",
    value: "21×",
    label: "meer kans om een aanvraag te kwalificeren bij reactie binnen 5 minuten in plaats van 30",
    source: "MIT / InsideSales (2007), dr. James Oldroyd — 15.000 leads, 100.000 belpogingen",
    sourceUrl: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
    confidence: "onderzoek",
    caveat:
      "Wordt vaak aan Harvard toegeschreven; de meting komt van MIT/InsideSales, HBR citeerde hem later.",
  },

  contactOdds: {
    id: "contactOdds",
    value: "100×",
    label: "meer kans om überhaupt contact te krijgen bij reactie binnen 5 minuten in plaats van 30",
    source: "MIT / InsideSales (2007), dr. James Oldroyd",
    sourceUrl: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
    confidence: "onderzoek",
  },

  withinHour: {
    id: "withinHour",
    value: "7×",
    label: "meer kans op kwalificatie bij reactie binnen een uur",
    source: "Harvard Business Review (2011)",
    sourceUrl: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
    confidence: "onderzoek",
  },

  whatsappRead: {
    id: "whatsappRead",
    value: "60–80%",
    label: "leespercentage van WhatsApp-berichten",
    source: "Searchlab WhatsApp Business Statistics (2026)",
    sourceUrl: "https://www.skolbot.ai/en-US/blog/whatsapp-98-percent-open-rate-myth",
    confidence: "platformdata",
    caveat:
      "Het veelgeciteerde 98% komt uit vendor-marketing en lijkt een hergebruikt sms-cijfer uit 2010. Niet gebruiken.",
  },

  emailOpen: {
    id: "emailOpen",
    value: "~20%",
    label: "gemiddelde open rate van e-mail",
    source: "Branchebenchmarks, gerapporteerd door meerdere aanbieders",
    sourceUrl: "https://spotler.com/blog/what-is-the-average-open-rate-for-whatsapp-marketing",
    confidence: "platformdata",
    caveat: "Wordt onbetrouwbaarder door Apple Mail Privacy Protection.",
  },

  afterHours: {
    id: "afterHours",
    value: "ongeveer de helft",
    label: "van de afspraken wordt geboekt tussen 17:00 en 09:00",
    source: "Zocdoc, eigen platformdata",
    sourceUrl:
      "https://thescript.zocdoc.com/blog/article/why-not-offering-after-hours-booking-is-driving-away-patients/",
    confidence: "platformdata",
    caveat: "Zelfgerapporteerd, zonder gepubliceerde methode of periode.",
  },
};

/**
 * Claims die uitdrukkelijk NIET gebruikt mogen worden, met de reden.
 * Staat hier zodat niemand ze later per ongeluk opnieuw introduceert.
 */
export const REJECTED_CLAIMS = [
  {
    claim: "98% open rate op WhatsApp",
    reason:
      "Herleidbaar tot marketingmateriaal van MessengerPeople (nu Sinch Engage), zonder methode of steekproef. Lijkt bovendien een overgeschreven sms-cijfer uit circa 2010.",
  },
  {
    claim: "78% koopt bij het bedrijf dat als eerste reageert",
    reason: "Toegeschreven aan McKinsey; een dergelijke studie bestaat niet.",
  },
  {
    claim: "68% van de contactformulieren wordt nooit ingevuld",
    reason: "Had geen bron. Stond eerder op deze site en is verwijderd.",
  },
  {
    claim: "41% van de telefoontjes valt buiten openingstijden",
    reason: "Had geen bron. Stond eerder op deze site en is verwijderd.",
  },
] as const;

/** Verval van de kans op contact, voor de curve op de landingspagina. */
export const DECAY_CURVE = {
  source: CLAIMS.qualifyOdds,
  points: [
    { minute: 0, odds: 100, label: "direct" },
    { minute: 5, odds: 100, label: "5 min" },
    { minute: 10, odds: 62, label: "10 min" },
    { minute: 20, odds: 24, label: "20 min" },
    { minute: 30, odds: 5, label: "30 min" },
    { minute: 60, odds: 2, label: "1 uur" },
  ],
  note:
    "Geïndexeerd op de kans binnen vijf minuten. De vorm volgt de MIT-meting dat de kans op kwalificatie tussen 5 en 30 minuten met een factor 21 daalt; de tussenliggende punten zijn interpolatie, geen meting.",
} as const;
