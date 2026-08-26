import { NextResponse } from "next/server";
import path from "path";

export const dynamic = "force-dynamic";

type IntegrationState = "live" | "sandbox" | "niet-gekoppeld";

interface Integration {
  id: string;
  name: string;
  state: IntegrationState;
  detail: string;
  /** Wat de eigenaar moet doen als dit nog niet live staat. */
  action?: string;
}

/**
 * Eerlijke koppelstatus voor het beheerdersportaal.
 *
 * Leest uitsluitend of environment-variabelen aanwezig zijn — er gaat geen enkele
 * sleutel of geheim mee terug naar de client, alleen de status en een instructie.
 */
export async function GET() {
  const hasDeepSeek = Boolean(process.env.DEEPSEEK_API_KEY);
  const hasCalendar = Boolean(
    process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CALENDAR_ID
  );
  const hasMeta = Boolean(process.env.META_WHATSAPP_ACCESS_TOKEN && process.env.META_PHONE_NUMBER_ID);
  const hasVolume = Boolean(process.env.DATA_DIR);

  const integrations: Integration[] = [
    {
      id: "deepseek",
      name: "DeepSeek Flash V4",
      state: hasDeepSeek ? "live" : "sandbox",
      detail: hasDeepSeek
        ? `Model ${process.env.DEEPSEEK_MODEL || "deepseek-chat"} actief`
        : "Draait op de deterministische fallback-receptionist",
      action: hasDeepSeek ? undefined : "Zet DEEPSEEK_API_KEY in de Railway variables",
    },
    {
      id: "calendar",
      name: "Google Agenda",
      state: hasCalendar ? "live" : "sandbox",
      detail: hasCalendar
        ? "Service account gekoppeld, tweerichtingssynchronisatie actief"
        : "Sandbox-agenda met realistische tijdsloten",
      action: hasCalendar
        ? undefined
        : "Deel de agenda met het serviceaccount en zet GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY en GOOGLE_CALENDAR_ID",
    },
    {
      id: "meta",
      name: "Meta WhatsApp Cloud API",
      state: hasMeta ? "live" : "niet-gekoppeld",
      detail: hasMeta
        ? `Nummer-ID ${String(process.env.META_PHONE_NUMBER_ID).slice(-4).padStart(8, "•")} verbonden`
        : "Gesprekken lopen nog via de simulator, niet via een echt nummer",
      action: hasMeta
        ? undefined
        : "Koppel een nummer in Meta for Developers en zet META_WHATSAPP_ACCESS_TOKEN en META_PHONE_NUMBER_ID",
    },
    {
      id: "storage",
      name: "Persistente opslag",
      state: hasVolume ? "live" : "niet-gekoppeld",
      detail: hasVolume
        ? `Volume gekoppeld op ${process.env.DATA_DIR}`
        : "Klantprofielen staan op de container-schijf en gaan verloren bij de volgende deploy",
      action: hasVolume
        ? undefined
        : "Koppel een Railway Volume en zet DATA_DIR op het mountpad (bijv. /data)",
    },
  ];

  return NextResponse.json({
    success: true,
    checkedAt: new Date().toISOString(),
    dataDir: process.env.DATA_DIR || path.join(process.cwd(), "data"),
    liveCount: integrations.filter((i) => i.state === "live").length,
    total: integrations.length,
    integrations,
  });
}
