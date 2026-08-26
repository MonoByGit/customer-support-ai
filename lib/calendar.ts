import { google } from "googleapis";
import { readEnv, hasEnv } from "./env";
import { BookingConfirmation, ConfirmBookingInput } from "./schemas";
import { formatDutchDateTime, createGoogleCalendarWebUrl } from "./calendar-utils";

export { formatDutchDateTime, createGoogleCalendarWebUrl };

export interface AvailableSlot {
  iso: string;
  formatted: string;
  durationMinutes: number;
}

// In-memory sandbox-agenda: actief zolang er geen Google service account is gekoppeld
interface MockEvent {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceTitle: string;
  startTime: string; // ISO
  endTime: string;   // ISO
}

const mockBookings: MockEvent[] = [];

function isGoogleConfigured(): boolean {
  return Boolean(
    hasEnv("GOOGLE_CLIENT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_CALENDAR_ID")
  );
}

function getGoogleCalendarClient() {
  const clientEmail = readEnv("GOOGLE_CLIENT_EMAIL");
  let privateKey = readEnv("GOOGLE_PRIVATE_KEY") || "";

  // Handle escaped newlines in environment variable
  privateKey = privateKey.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  return google.calendar({ version: "v3", auth });
}

export async function checkFreeSlots(
  startDateStr?: string,
  durationMinutes: number = 30,
  preferredTimeOfDay?: "morning" | "afternoon" | "any"
): Promise<AvailableSlot[]> {
  // Determine base date
  let baseDate = new Date();
  if (startDateStr) {
    const parsed = new Date(startDateStr);
    if (!isNaN(parsed.getTime())) {
      baseDate = parsed;
    }
  }

  // If date is today or in past, check starting tomorrow during business days
  const now = new Date();
  if (baseDate <= now) {
    baseDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }

  // Avoid weekends
  while (baseDate.getDay() === 0 || baseDate.getDay() === 6) {
    baseDate.setDate(baseDate.getDate() + 1);
  }

  if (isGoogleConfigured()) {
    try {
      return await queryGoogleCalendarSlots(baseDate, durationMinutes, preferredTimeOfDay);
    } catch (err) {
      console.warn("[calendar] Google Calendar query failed, falling back to mock slots:", err);
    }
  }

  // Sandbox / Mock slot generator
  return generateMockSlots(baseDate, durationMinutes, preferredTimeOfDay);
}

function generateMockSlots(
  baseDate: Date,
  durationMinutes: number,
  preferredTimeOfDay?: "morning" | "afternoon" | "any"
): AvailableSlot[] {
  const slots: AvailableSlot[] = [];
  const candidateHours =
    preferredTimeOfDay === "morning"
      ? [9, 10, 11]
      : preferredTimeOfDay === "afternoon"
      ? [13, 14, 15, 16]
      : [10, 14, 16];

  for (let dayOffset = 0; dayOffset < 2; dayOffset++) {
    const currentDay = new Date(baseDate);
    currentDay.setDate(baseDate.getDate() + dayOffset);

    // Skip weekend
    if (currentDay.getDay() === 0 || currentDay.getDay() === 6) continue;

    for (const hour of candidateHours) {
      const slotTime = new Date(currentDay);
      slotTime.setHours(hour, 0, 0, 0);

      const iso = slotTime.toISOString();
      const isAlreadyBooked = mockBookings.some((b) => b.startTime === iso);

      if (!isAlreadyBooked) {
        slots.push({
          iso,
          formatted: formatDutchDateTime(slotTime),
          durationMinutes,
        });
      }

      if (slots.length >= 3) break;
    }
    if (slots.length >= 3) break;
  }

  return slots;
}

async function queryGoogleCalendarSlots(
  baseDate: Date,
  durationMinutes: number,
  preferredTimeOfDay?: "morning" | "afternoon" | "any"
): Promise<AvailableSlot[]> {
  const calendar = getGoogleCalendarClient();
  const calendarId = readEnv("GOOGLE_CALENDAR_ID")!;

  const timeMin = new Date(baseDate);
  timeMin.setHours(8, 0, 0, 0);

  const timeMax = new Date(baseDate);
  timeMax.setDate(baseDate.getDate() + 3);
  timeMax.setHours(18, 0, 0, 0);

  const freeBusyRes = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: calendarId }],
    },
  });

  const busySpans = freeBusyRes.data.calendars?.[calendarId]?.busy || [];
  const slots: AvailableSlot[] = [];

  // Iterate over next 3 business days
  for (let day = 0; day < 3; day++) {
    const dayDate = new Date(baseDate);
    dayDate.setDate(baseDate.getDate() + day);
    if (dayDate.getDay() === 0 || dayDate.getDay() === 6) continue;

    const startHour = preferredTimeOfDay === "afternoon" ? 13 : 9;
    const endHour = preferredTimeOfDay === "morning" ? 12 : 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const slotStart = new Date(dayDate);
        slotStart.setHours(hour, min, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

        // Check if overlaps with busy span
        const overlaps = busySpans.some((busy) => {
          const busyStart = new Date(busy.start || "");
          const busyEnd = new Date(busy.end || "");
          return slotStart < busyEnd && slotEnd > busyStart;
        });

        if (!overlaps) {
          slots.push({
            iso: slotStart.toISOString(),
            formatted: formatDutchDateTime(slotStart),
            durationMinutes,
          });
        }

        if (slots.length >= 3) return slots;
      }
    }
  }

  return slots.length > 0 ? slots : generateMockSlots(baseDate, durationMinutes, preferredTimeOfDay);
}

export async function createAppointment(
  input: ConfirmBookingInput,
  businessName: string = "WhatsApp Afspraak"
): Promise<BookingConfirmation> {
  const startDate = new Date(input.slotIsoString);
  const duration = 30; // Default 30 min if not calculated
  const endDate = new Date(startDate.getTime() + duration * 60000);

  const bookingId = `WA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  if (isGoogleConfigured()) {
    try {
      const calendar = getGoogleCalendarClient();
      const calendarId = readEnv("GOOGLE_CALENDAR_ID")!;

      const eventRes = await calendar.events.insert({
        calendarId,
        requestBody: {
          summary: `${input.serviceTitle} - ${input.customerName}`,
          description: `WhatsApp Boeking ID: ${bookingId}\nKlant: ${input.customerName}\nTelefoon: ${input.customerPhone}\nEmail: ${input.customerEmail || "N/A"}\nNotities: ${input.notes || "Geen"}`,
          start: {
            dateTime: startDate.toISOString(),
          },
          end: {
            dateTime: endDate.toISOString(),
          },
          attendees: input.customerEmail ? [{ email: input.customerEmail }] : undefined,
        },
      });

      return {
        success: true,
        bookingId,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        serviceTitle: input.serviceTitle,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        location: businessName,
        calendarLink: eventRes.data.htmlLink || createGoogleCalendarWebUrl(input.serviceTitle, businessName, startDate, endDate),
        isMock: false,
      };
    } catch (err) {
      console.warn("[calendar] Google Calendar event insertion failed, saving to mock store:", err);
    }
  }

  // Mock booking store
  mockBookings.push({
    id: bookingId,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    serviceTitle: input.serviceTitle,
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
  });

  const webCalendarUrl = createGoogleCalendarWebUrl(input.serviceTitle, businessName, startDate, endDate);

  return {
    success: true,
    bookingId,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    serviceTitle: input.serviceTitle,
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
    location: businessName,
    calendarLink: webCalendarUrl,
    isMock: true,
  };
}

export function getMockBookings(): MockEvent[] {
  return [...mockBookings];
}
