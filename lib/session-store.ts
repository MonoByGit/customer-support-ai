import fs from "fs";
import path from "path";
import { readEnv } from "./env";

export interface ClientSession {
  slug: string;
  businessName: string;
  startTime: number | null; // null if not started yet
  maxDurationMinutes: number; // default 10 minutes
  messageCount: number;
  maxMessages: number; // default 15
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
    maxDurationMinutes: 10,
    messageCount: 0,
    maxMessages: 30,
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
    if (elapsedMinutes >= session.maxDurationMinutes || session.messageCount >= session.maxMessages) {
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

export function extendSession(slug: string, extraMinutes: number = 10, extraMessages: number = 10): ClientSession {
  const session = getSession(slug);
  session.maxDurationMinutes += extraMinutes;
  session.maxMessages += extraMessages;
  session.isExpired = false;
  saveSession(session);
  return session;
}

export function resetSession(slug: string): ClientSession {
  const session = getSession(slug);
  session.startTime = null;
  session.messageCount = 0;
  session.isExpired = false;
  session.messages = [];
  saveSession(session);
  return session;
}
