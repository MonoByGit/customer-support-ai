import fs from "fs";
import path from "path";
import { BusinessProfile, BusinessProfileSchema } from "./schemas";

const PROFILES_DIR = path.join(process.cwd(), "data", "profiles");

export function ensureStorageDir(): void {
  if (!fs.existsSync(PROFILES_DIR)) {
    fs.mkdirSync(PROFILES_DIR, { recursive: true });
  }
}

export function getAllProfiles(): BusinessProfile[] {
  ensureStorageDir();
  try {
    const files = fs.readdirSync(PROFILES_DIR);
    const profiles: BusinessProfile[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(PROFILES_DIR, file);
        const content = fs.readFileSync(filePath, "utf-8");
        try {
          const parsed = JSON.parse(content);
          const valid = BusinessProfileSchema.parse(parsed);
          profiles.push(valid);
        } catch (err) {
          console.warn(`[storage] Could not parse profile file ${file}:`, err);
        }
      }
    }

    return profiles;
  } catch (error) {
    console.error("[storage] Error listing profiles:", error);
    return [];
  }
}

export function getProfileBySlug(slug: string): BusinessProfile | null {
  ensureStorageDir();
  const filePath = path.join(PROFILES_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    // If asking for default demo and file doesn't exist, provide fallback
    if (slug === "tandarts-demo") {
      return DEFAULT_TANDARTS_PROFILE;
    }
    return null;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return BusinessProfileSchema.parse(parsed);
  } catch (error) {
    console.error(`[storage] Error loading profile for slug '${slug}':`, error);
    return null;
  }
}

export function saveProfile(profile: BusinessProfile): BusinessProfile {
  ensureStorageDir();
  const valid = BusinessProfileSchema.parse(profile);
  const filePath = path.join(PROFILES_DIR, `${valid.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(valid, null, 2), "utf-8");
  return valid;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export const DEFAULT_TANDARTS_PROFILE: BusinessProfile = {
  businessName: "Tandartspraktijk De Groene Gracht",
  slug: "tandarts-demo",
  industry: "dental",
  tagline: "Moderne mondzorg in het hart van de stad met persoonlijke aandacht.",
  phone: "+31 20 555 1234",
  email: "afspraken@degroenegracht.nl",
  address: "Keizersgracht 482, 1016 EG Amsterdam",
  openingHours: "Maandag t/m Vrijdag: 08:30 - 17:30 | Zaterdag & Zondag: Gesloten (spoedlijn beschikbaar)",
  websiteUrl: "https://tandartspraktijk-degroenegracht.nl",
  services: [
    {
      id: "controle",
      title: "Periodieke Gebitscontrole",
      durationMinutes: 30,
      price: "€27,50",
      description: "Grondige halfjaarlijkse controle van uw gebit inclusief tandvleescheck en indien nodig röntgenfoto's.",
    },
    {
      id: "reiniging",
      title: "Gebitsreiniging & Preventie",
      durationMinutes: 45,
      price: "€65,00",
      description: "Verwijderen van tandsteen, plaque en polijsten van tanden voor een stralend schoon gevoel.",
    },
    {
      id: "spoed",
      title: "Spoedconsult (Pijnklachten)",
      durationMinutes: 30,
      price: "Vanaf €45,00",
      description: "Directe verlichting bij acute kiespijn, afgebroken tand of abces. Dezelfde dag geholpen.",
    },
    {
      id: "bleken",
      title: "Professionele Tandenbleekbehandeling",
      durationMinutes: 60,
      price: "€225,00",
      description: "Veilige en effectieve whitening behandeling onder begeleiding van de tandarts.",
    },
  ],
  faqs: [
    {
      question: "Nemen jullie op dit moment nieuwe patiënten aan?",
      answer: "Ja! Wij hebben momenteel ruimte voor nieuwe inschrijvingen en kunnen direct een intake plannen.",
    },
    {
      question: "Worden de behandelingen vergoed door mijn zorgverzekering?",
      answer: "Kinderen tot 18 jaar zijn 100% verzekerd via de basisverzekering. Voor volwassenen hangt het af van uw aanvullende tandartsverzekering.",
    },
    {
      question: "Hoe kan ik een afspraak verzetten of annuleren?",
      answer: "Kosteloos annuleren kan tot 24 uur van tevoren, gewoon via dit WhatsApp nummer of telefonisch.",
    },
  ],
  toneOfVoice: "Warm, betrouwbaar, vlot en geruststellend. Spreekt de klant beleefd en natuurlijk aan.",
  customGreeting: "Hoi! Welkom bij Tandartspraktijk De Groene Gracht. 👋 Ik ben de digitale assistent. Hoe kan ik je vandaag helpen? Wil je een afspraak inplannen voor een controle of heb je een specifieke vraag?",
  avatarUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=150&auto=format&fit=crop&q=80",
};
