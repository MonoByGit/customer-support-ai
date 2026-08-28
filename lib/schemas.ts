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
