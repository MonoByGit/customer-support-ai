import { NextResponse } from "next/server";
import path from "path";
import { envState, readEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

type IntegrationState = "live" | "sandbox" | "placeholder" | "niet-gekoppeld";

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
 * Leest uitsluitend óf variabelen een echte waarde hebben — er gaat geen enkele
 * sleutel of geheim mee terug naar de client, alleen de status en een instructie.
 * Een klaargezette placeholder telt nadrukkelijk niet als gekoppeld: liever een
 * eerlijke "nog invullen" dan een groen vinkje dat bij de eerste API-call breekt.
 */
export async function GET() {
  const deepseek = envState("DEEPSEEK_API_KEY");
  const calendar = envState("GOOGLE_CLIENT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_CALENDAR_ID");
  const meta = envState("META_WHATSAPP_ACCESS_TOKEN", "META_PHONE_NUMBER_ID");
  const storage = envState("DATA_DIR");

  const integrations: Integration[] = [
    {
      id: "deepseek",
      name: "DeepSeek Flash V4",
      state: deepseek === "configured" ? "live" : deepseek === "placeholder" ? "placeholder" : "sandbox",
      detail:
        deepseek === "configured"
          ? `Model ${readEnv("DEEPSEEK_MODEL") || "deepseek-chat"} actief`
          : deepseek === "placeholder"
          ? "Variabele staat klaar, de sleutel moet nog worden ingevuld"
          : "Draait op de deterministische fallback-receptionist",
      action:
        deepseek === "configured"
          ? undefined
          : "Vervang DEEPSEEK_API_KEY in de Railway variables door je sleutel van platform.deepseek.com",
    },
    {
      id: "calendar",
      name: "Google Agenda",
      state: calendar === "configured" ? "live" : calendar === "placeholder" ? "placeholder" : "sandbox",
      detail:
        calendar === "configured"
          ? "Service account gekoppeld, tweerichtingssynchronisatie actief"
          : calendar === "placeholder"
          ? "Variabelen staan klaar, het serviceaccount moet nog worden ingevuld"
          : "Sandbox-agenda met realistische tijdsloten",
      action:
        calendar === "configured"
          ? undefined
          : "Maak het serviceaccount aan, deel de agenda ermee en vul GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY en GOOGLE_CALENDAR_ID in",
    },
    {
      id: "meta",
      name: "Meta WhatsApp Cloud API",
      state: meta === "configured" ? "live" : meta === "placeholder" ? "placeholder" : "niet-gekoppeld",
      detail:
        meta === "configured"
          ? `Nummer-ID ${String(readEnv("META_PHONE_NUMBER_ID")).slice(-4).padStart(8, "•")} verbonden`
          : meta === "placeholder"
          ? "Variabelen staan klaar, het nummer moet nog worden gekoppeld"
          : "Gesprekken lopen nog via de simulator, niet via een echt nummer",
      action:
        meta === "configured"
          ? undefined
          : "Koppel een nummer in Meta for Developers en vul META_WHATSAPP_ACCESS_TOKEN en META_PHONE_NUMBER_ID in",
    },
    {
      id: "storage",
      name: "Persistente opslag",
      state: storage === "configured" ? "live" : storage === "placeholder" ? "placeholder" : "niet-gekoppeld",
      detail:
        storage === "configured"
          ? `Volume gekoppeld op ${readEnv("DATA_DIR")}`
          : "Klantprofielen staan op de container-schijf en gaan verloren bij de volgende deploy",
      action:
        storage === "configured"
          ? undefined
          : "Koppel een Railway Volume en zet DATA_DIR op het mountpad (bijv. /data)",
    },
  ];

  return NextResponse.json({
    success: true,
    checkedAt: new Date().toISOString(),
    dataDir: readEnv("DATA_DIR") || path.join(process.cwd(), "data"),
    liveCount: integrations.filter((i) => i.state === "live").length,
    pendingCount: integrations.filter((i) => i.state === "placeholder").length,
    total: integrations.length,
    integrations,
  });
}
