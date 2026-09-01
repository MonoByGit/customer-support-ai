import assert from "node:assert/strict";
import test from "node:test";
import {
  createDraftConfiguration,
  transitionConfiguration,
  updateQualityCheck,
} from "../lib/configuration";

test("een nieuwe URL blijft in het lab en begint als versie 1", () => {
  const configuration = createDraftConfiguration("https://voorbeeldgarage.nl");

  assert.equal(configuration.revision, 1);
  assert.equal(configuration.stage, "draft");
  assert.equal(configuration.release.testOnly, true);
  assert.equal(configuration.channels.whatsapp.enabled, true);
  assert.equal(configuration.channels.voice.enabled, true);
});

test("goedkeuren wordt geblokkeerd zolang niet alle controles zijn geslaagd", () => {
  const draft = createDraftConfiguration("https://voorbeeldgarage.nl");
  const testing = transitionConfiguration(draft, "testing");

  assert.throws(
    () => transitionConfiguration(testing, "approved"),
    /alle kwaliteitscontroles zijn geslaagd/
  );
});

test("een volledig geteste configuratie kan gecontroleerd worden geactiveerd", () => {
  let configuration = transitionConfiguration(
    createDraftConfiguration("https://voorbeeldgarage.nl"),
    "testing"
  );

  configuration = updateQualityCheck(configuration, "sourceReviewed", "passed");
  configuration = updateQualityCheck(configuration, "profileReviewed", "passed");
  configuration = updateQualityCheck(configuration, "whatsappTested", "passed");
  configuration = updateQualityCheck(configuration, "voiceTested", "passed");
  configuration = transitionConfiguration(configuration, "approved");
  configuration = transitionConfiguration(configuration, "active");

  assert.equal(configuration.stage, "active");
  assert.equal(configuration.release.testOnly, false);
  assert.ok(configuration.release.testedAt);
  assert.ok(configuration.release.approvedAt);
  assert.ok(configuration.release.activatedAt);
});
