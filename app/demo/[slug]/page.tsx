import { permanentRedirect } from "next/navigation";
import { resolveSlug } from "@/lib/storage";

/**
 * Historische route. Links die al bij prospects liggen (of in een geplaatste widget staan)
 * blijven werken en landen permanent op de commerciële /live route.
 */
export default async function LegacyDemoRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/live/${resolveSlug(slug)}`);
}
