import fs from "fs";
import path from "path";
import { readEnv } from "./env";

export interface ClientSession {
  slug: string;
  businessName: string;
  startTime: number | null; // null if not started yet
  maxDurationMinutes: number; // default 10 minutes
  messageCount: number;
  maxMessages: number;
  /** Verbruikte DeepSeek-tokens in deze sessie (prompt plus completion). */
  tokensUsed: number;
  /** Hard plafond per sessie; beschermt tegen een uitlopende rekening. */
  maxTokens: number;
  isExpired: boolean;
  messages: Array<{
    id: string;
    sender: "user" | "agent" | "system";
    text: string;
    timestamp: string;
    quickReplies?: string[];
    isBookingCard?: boolean;
    bookingDetails?: {
      service: string;
      slot: string;
      clientName: string;
      clientPhone: string;
      calendarEventId?: string;
    };
  }>;
  lastActive: number;
}

const DATA_ROOT = readEnv("DATA_DIR") || path.join(process.cwd(), "data");

/**
 * Sessieplafonds. Een prospect moet het product echt kunnen uitproberen —
 * dienst opvragen, prijzen vergelijken, boeken, eventueel verzetten — maar
 * niet eindeloos op onze rekening doorpraten.
 *
 * De drie limieten zijn bewust op elkaar afgestemd: bij ongeveer 2.500 tokens
 * per beurt raakt het tokenbudget rond dezelfde beurt op als de berichtenteller.
 * Zo is er nooit één limiet die de andere twee stilletjes overbodig maakt.
 */
export const DEFAULT_MAX_MINUTES = Number(readEnv("SESSION_MAX_MINUTES") || 10);
export const DEFAULT_MAX_MESSAGES = Number(readEnv("SESSION_MAX_MESSAGES") || 15);
export const DEFAULT_MAX_TOKENS = Number(readEnv("SESSION_MAX_TOKENS") || 40000);

/** Welke limiet als eerste is geraakt — bepaalt wat de bezoeker te zien krijgt. */
export function expiryReason(session: ClientSession): "tijd" | "berichten" | "tokens" | null {
  if (session.tokensUsed >= session.maxTokens) return "tokens";
  if (session.messageCount >= session.maxMessages) return "berichten";
  if (session.startTime) {
    const elapsed = (Date.now() - session.startTime) / (1000 * 60);
    if (elapsed >= session.maxDurationMinutes) return "tijd";
  }
  return null;
}
const SESSIONS_DIR = path.join(DATA_ROOT, "sessions");

function ensureSessionsDir() {
  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  }
}

export function getSession(slug: string): ClientSession {
  ensureSessionsDir();
  const filePath = path.join(SESSIONS_DIR, `${slug}.json`);

  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      // Sessies van vóór het tokenbudget missen deze velden.
      if (typeof data.tokensUsed !== "number") data.tokensUsed = 0;
      if (typeof data.maxTokens !== "number") data.maxTokens = DEFAULT_MAX_TOKENS;
      return data;
    } catch (e) {
      console.error("Error reading session:", e);
    }
  }

  // Default new session
  return {
    slug,
    businessName: slug,
    startTime: null,
    maxDurationMinutes: DEFAULT_MAX_MINUTES,
    messageCount: 0,
    maxMessages: DEFAULT_MAX_MESSAGES,
    tokensUsed: 0,
    maxTokens: DEFAULT_MAX_TOKENS,
    isExpired: false,
    messages: [],
    lastActive: Date.now(),
  };
}

export function saveSession(session: ClientSession): void {
  ensureSessionsDir();
  const filePath = path.join(SESSIONS_DIR, `${session.slug}.json`);
  session.lastActive = Date.now();

  // Check if expired based on duration or message limit
  if (session.startTime) {
    const elapsedMinutes = (Date.now() - session.startTime) / (1000 * 60);
    if (
      elapsedMinutes >= session.maxDurationMinutes ||
      session.messageCount >= session.maxMessages ||
      session.tokensUsed >= session.maxTokens
    ) {
      session.isExpired = true;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(session, null, 2), "utf-8");
}

export function listAllSessions(): ClientSession[] {
  ensureSessionsDir();
  const files = fs.readdirSync(SESSIONS_DIR);
  const sessions: ClientSession[] = [];

  for (const file of files) {
    if (file.endsWith(".json")) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(SESSIONS_DIR, file), "utf-8"));
        sessions.push(data);
      } catch (e) {
        console.error("Error parsing session file:", file, e);
      }
    }
  }

  return sessions.sort((a, b) => b.lastActive - a.lastActive);
}

export function extendSession(
  slug: string,
  extraMinutes: number = 10,
  extraMessages: number = 10,
  extraTokens: number = DEFAULT_MAX_TOKENS
): ClientSession {
  const session = getSession(slug);
  session.maxDurationMinutes += extraMinutes;
  session.maxMessages += extraMessages;
  session.maxTokens += extraTokens;
  session.isExpired = false;
  saveSession(session);
  return session;
}

export function resetSession(slug: string): ClientSession {
  const session = getSession(slug);
  session.startTime = null;
  session.messageCount = 0;
  session.tokensUsed = 0;
  session.maxDurationMinutes = DEFAULT_MAX_MINUTES;
  session.maxMessages = DEFAULT_MAX_MESSAGES;
  session.maxTokens = DEFAULT_MAX_TOKENS;
  session.isExpired = false;
  session.messages = [];
  saveSession(session);
  return session;
}
