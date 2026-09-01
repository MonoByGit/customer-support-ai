import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { scrapeWebsite } from "@/lib/scraper";
import { extractBusinessProfileWithDeepSeek } from "@/lib/deepseek";
import { saveProfile } from "@/lib/storage";
import { attachDraftConfiguration } from "@/lib/configuration";

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string" || url.trim().length === 0) {
      return NextResponse.json(
        { error: "Valid target website URL is required." },
        { status: 400 }
      );
    }

    console.log(`[api/ingest] Starting scraping for URL: ${url}`);
    const scrapedData = await scrapeWebsite(url);

    console.log(`[api/ingest] Extracting business profile via DeepSeek Flash AI...`);
    const profile = await extractBusinessProfileWithDeepSeek(scrapedData);

    const configuredProfile = attachDraftConfiguration(profile, scrapedData.url);
    console.log(`[api/ingest] Saving generated draft configuration: ${profile.slug}`);
    const saved = saveProfile(configuredProfile);

    return NextResponse.json({
      success: true,
      slug: saved.slug,
      simulatorUrl: `/live/${saved.slug}`,
      lab: {
        stage: saved.configuration?.stage,
        revision: saved.configuration?.revision,
        testOnly: saved.configuration?.release.testOnly,
      },
      profile: saved,
    });
  } catch (error: any) {
    console.error("[api/ingest] Extraction failure:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process website ingestion." },
      { status: 500 }
    );
  }
}
