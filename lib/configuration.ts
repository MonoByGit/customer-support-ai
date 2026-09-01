import {
  BusinessProfile,
  CustomerConfiguration,
  CustomerConfigurationSchema,
  QualityCheckStatusSchema,
} from "./schemas";
import { ensureAiDisclosureGreeting } from "./conversation-policy";

export type QualityCheckName = keyof CustomerConfiguration["quality"];
export type ConfigurationStage = CustomerConfiguration["stage"];

const NEXT_STAGES: Record<ConfigurationStage, ConfigurationStage[]> = {
  draft: ["testing", "archived"],
  testing: ["draft", "approved", "archived"],
  approved: ["testing", "active", "archived"],
  active: ["archived"],
  archived: [],
};

function nowIso(): string {
  return new Date().toISOString();
}

export function createDraftConfiguration(sourceUrl: string): CustomerConfiguration {
  const timestamp = nowIso();
  return CustomerConfigurationSchema.parse({
    source: { url: sourceUrl, ingestedAt: timestamp },
    channels: { whatsapp: {}, voice: {} },
    quality: {},
    release: {},
    updatedAt: timestamp,
  });
}

export function attachDraftConfiguration(profile: BusinessProfile, sourceUrl: string): BusinessProfile {
  return {
    ...profile,
    websiteUrl: profile.websiteUrl || sourceUrl,
    customGreeting: ensureAiDisclosureGreeting(profile),
    configuration: createDraftConfiguration(sourceUrl),
  };
}

export function updateQualityCheck(
  configuration: CustomerConfiguration,
  check: QualityCheckName,
  status: unknown
): CustomerConfiguration {
  const validatedStatus = QualityCheckStatusSchema.parse(status);
  const timestamp = nowIso();
  const quality = { ...configuration.quality, [check]: validatedStatus };

  return CustomerConfigurationSchema.parse({
    ...configuration,
    revision: configuration.revision + 1,
    quality,
    release: {
      ...configuration.release,
      testedAt: Object.values(quality).every((value) => value === "passed")
        ? timestamp
        : configuration.release.testedAt,
    },
    updatedAt: timestamp,
  });
}

export function transitionConfiguration(
  configuration: CustomerConfiguration,
  nextStage: ConfigurationStage
): CustomerConfiguration {
  if (!NEXT_STAGES[configuration.stage].includes(nextStage)) {
    throw new Error(`Overgang van ${configuration.stage} naar ${nextStage} is niet toegestaan.`);
  }

  if (nextStage === "approved" && !Object.values(configuration.quality).every((value) => value === "passed")) {
    throw new Error("Goedkeuren kan pas nadat alle kwaliteitscontroles zijn geslaagd.");
  }

  const timestamp = nowIso();
  return CustomerConfigurationSchema.parse({
    ...configuration,
    revision: configuration.revision + 1,
    stage: nextStage,
    release: {
      ...configuration.release,
      testOnly: nextStage !== "active",
      approvedAt: nextStage === "approved" ? timestamp : configuration.release.approvedAt,
      activatedAt: nextStage === "active" ? timestamp : configuration.release.activatedAt,
    },
    updatedAt: timestamp,
  });
}
