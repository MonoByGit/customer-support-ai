import assert from "node:assert/strict";
import test from "node:test";
import { ensureAiDisclosureGreeting, humanHandoffReply, requestsHuman } from "../lib/conversation-policy";
import { BusinessProfileSchema } from "../lib/schemas";

const profile = BusinessProfileSchema.parse({
  businessName: "Autobedrijf De Waal",
  slug: "autobedrijf-de-waal",
  industry: "garage",
  services: [],
  faqs: [],
  customGreeting: "Welkom. Waarmee kunnen we u helpen?",
});

test("een expliciet verzoek om een mens wordt altijd herkend", () => {
  assert.equal(requestsHuman("Ik wil graag een mens spreken over schade."), true);
  assert.equal(requestsHuman("Kan een collega mij terugbellen?"), true);
  assert.equal(requestsHuman("Wat kost een APK?"), false);
});

test("de overdracht stelt geen inhoudelijke vervolgvraag", () => {
  const reply = humanHandoffReply(profile);
  assert.match(reply, /telefoonnummer/);
  assert.doesNotMatch(reply, /wat is er gebeurd|vertel.*schade/i);
});

test("een gegenereerde begroeting noemt Verdi als digitale collega", () => {
  assert.match(ensureAiDisclosureGreeting(profile), /Verdi, de digitale collega/);
});

test("een bestaande AI-openheid wordt niet dubbel toegevoegd", () => {
  const disclosed = { ...profile, customGreeting: "Hoi, ik ben Verdi, de digitale assistent." };
  assert.equal(ensureAiDisclosureGreeting(disclosed), disclosed.customGreeting);
});
