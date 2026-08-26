import { permanentRedirect } from "next/navigation";
import { resolveSlug } from "@/lib/storage";

/**
 * Historische route. Links die al bij prospects liggen (of in een geplaatste widget staan)
 * blijven werken en landen permanent op de commerciële /live route.
 */
export default function LegacyDemoRedirect({ params }: { params: { slug: string } }) {
  permanentRedirect(`/live/${resolveSlug(params.slug)}`);
}
