import { BusinessProfile } from "./schemas";

const HUMAN_REQUEST = /\b(mens|medewerker|collega|echt persoon|iemand spreken|teruggebeld|terugbellen)\b/i;
const AI_DISCLOSURE = /\b(ai|digitale (?:collega|assistent)|virtuele (?:collega|assistent))\b/i;

export function requestsHuman(message: string): boolean {
  return HUMAN_REQUEST.test(message);
}

export function humanHandoffReply(profile: BusinessProfile): string {
  if (profile.phone?.trim()) {
    return `Natuurlijk. U kunt een collega bereiken op ${profile.phone.trim()}. Wilt u liever teruggebeld worden, stuur dan uw nummer en een passend moment.`;
  }
  return "Natuurlijk. Stuur uw telefoonnummer en een passend moment, dan kan een collega u terugbellen.";
}

export function ensureAiDisclosureGreeting(profile: BusinessProfile): string {
  const greeting = profile.customGreeting?.trim() || "Waarmee kan ik u helpen?";
  if (AI_DISCLOSURE.test(greeting)) return greeting;
  return `Hoi, u spreekt met Verdi, de digitale collega van ${profile.businessName}. ${greeting}`;
}
