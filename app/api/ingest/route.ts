import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/scraper";
import { extractBusinessProfileWithDeepSeek } from "@/lib/deepseek";
import { saveProfile } from "@/lib/storage";

export async function POST(req: NextRequest) {
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

    console.log(`[api/ingest] Saving generated profile: ${profile.slug}`);
    const saved = saveProfile(profile);

    return NextResponse.json({
      success: true,
      slug: saved.slug,
      simulatorUrl: `/live/${saved.slug}`,
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
