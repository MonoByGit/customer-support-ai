import { z } from "zod";

export const ServiceItemSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  title: z.string().describe("Name of the service (e.g., 'Periodieke Controle', 'Gebitsreiniging', 'Knippen & Stylen')"),
  durationMinutes: z.number().default(30).describe("Estimated duration in minutes"),
  price: z.string().optional().describe("Price or price range (e.g. '€45', 'Vanaf €25', 'Op aanvraag')"),
  description: z.string().optional().describe("Brief 1-sentence description of what this service entails"),
});

export type ServiceItem = z.infer<typeof ServiceItemSchema>;

export const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export type FAQItem = z.infer<typeof FAQItemSchema>;

export const QualityCheckStatusSchema = z.enum(["pending", "passed", "failed"]);

export const CustomerConfigurationSchema = z.object({
  schemaVersion: z.literal(1).default(1),
  revision: z.number().int().positive().default(1),
  stage: z.enum(["draft", "testing", "approved", "active", "archived"]).default("draft"),
  source: z.object({
    url: z.string().url(),
    ingestedAt: z.string().datetime(),
  }),
  channels: z.object({
    whatsapp: z.object({
      enabled: z.boolean().default(true),
      aiDisclosure: z.boolean().default(true),
      humanHandoff: z.boolean().default(true),
      style: z.string().default("Warm, persoonlijk en bondig"),
    }),
    voice: z.object({
      enabled: z.boolean().default(true),
      aiDisclosure: z.boolean().default(true),
      humanHandoff: z.boolean().default(true),
      voice: z.enum(["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse", "marin", "cedar"]).default("marin"),
      tempo: z.enum(["rustig", "natuurlijk", "levendig"]).default("natuurlijk"),
      language: z.enum(["volgt", "nl", "en", "de", "fr", "es"]).default("volgt"),
      accent: z.enum(["algemeen-nederlands", "amsterdams-licht", "rotterdams-licht", "brabants-licht", "vlaams-licht", "neutraal-internationaal"]).default("algemeen-nederlands"),
      character: z.enum(["warm-collega", "nuchter-vakmens", "kalme-balie", "energiek-gastvrij", "zakelijk-direct"]).default("warm-collega"),
    }),
  }),
  quality: z.object({
    sourceReviewed: QualityCheckStatusSchema.default("pending"),
    profileReviewed: QualityCheckStatusSchema.default("pending"),
    whatsappTested: QualityCheckStatusSchema.default("pending"),
    voiceTested: QualityCheckStatusSchema.default("pending"),
  }),
  release: z.object({
    testOnly: z.boolean().default(true),
    testedAt: z.string().datetime().optional(),
    approvedAt: z.string().datetime().optional(),
    activatedAt: z.string().datetime().optional(),
  }),
  updatedAt: z.string().datetime(),
});

export type CustomerConfiguration = z.infer<typeof CustomerConfigurationSchema>;

export const BusinessProfileSchema = z.object({
  businessName: z.string().describe("Official business name"),
  slug: z.string().describe("URL-friendly slug (lowercase, hyphens only)"),
  industry: z.enum(["dental", "salon", "trades", "garage", "beauty", "general"]).default("general"),
  tagline: z.string().optional().describe("Short tagline or value proposition"),
  phone: z.string().optional().describe("Phone number of the business"),
  email: z.string().optional().describe("Email address of the business"),
  address: z.string().optional().describe("Physical location or service area"),
  openingHours: z.string().optional().describe("Opening hours summary (e.g. 'Ma-Vr: 08:30 - 17:30, Za-Zo: Gesloten')"),
  websiteUrl: z.string().optional().describe("Original source URL"),
  services: z.array(ServiceItemSchema).default([]),
  faqs: z.array(FAQItemSchema).default([]),
  toneOfVoice: z.string().default("Vriendelijk, professioneel, behulpzaam en to-the-point").describe("Tone of voice guidance for the WhatsApp receptionist"),
  customGreeting: z.string().optional().describe("Opening welcome message sent automatically to new WhatsApp chats"),
  avatarUrl: z.string().optional().describe("Avatar/Logo image URL if extracted or placeholder"),
  configuration: CustomerConfigurationSchema.optional().describe("Versioned lab and release configuration shared by WhatsApp and voice"),
});

export type BusinessProfile = z.infer<typeof BusinessProfileSchema>;

export const CheckAvailabilityInputSchema = z.object({
  startDate: z.string().describe("Starting date in ISO format YYYY-MM-DD or date string to search from (e.g., '2026-08-27' or 'tomorrow')"),
  serviceDurationMinutes: z.number().default(30).describe("Duration of the appointment in minutes"),
  preferredTimeOfDay: z.enum(["morning", "afternoon", "any"]).optional().describe("Customer preferred time of day"),
});

export type CheckAvailabilityInput = z.infer<typeof CheckAvailabilityInputSchema>;

export const ConfirmBookingInputSchema = z.object({
  customerName: z.string().describe("Full name of the customer"),
  customerPhone: z.string().describe("Phone number of the customer"),
  customerEmail: z.string().optional().describe("Optional email address"),
  serviceTitle: z.string().describe("Title of the selected service"),
  serviceId: z.string().optional().describe("ID of the selected service"),
  slotIsoString: z.string().describe("Selected ISO 8601 start date-time string (e.g. '2026-08-27T10:00:00.000Z')"),
  notes: z.string().optional().describe("Optional customer comments or notes"),
});

export type ConfirmBookingInput = z.infer<typeof ConfirmBookingInputSchema>;

export const BookingConfirmationSchema = z.object({
  success: z.boolean(),
  bookingId: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  serviceTitle: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string().optional(),
  calendarLink: z.string().optional(),
  isMock: z.boolean().default(false),
});

export type BookingConfirmation = z.infer<typeof BookingConfirmationSchema>;

export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.string(),
  toolCalls: z.array(z.any()).optional(),
  bookingData: BookingConfirmationSchema.optional(),
  proposedSlots: z.array(z.object({
    iso: z.string(),
    formatted: z.string(),
    durationMinutes: z.number(),
  })).optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
