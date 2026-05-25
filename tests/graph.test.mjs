import assert from "node:assert/strict";
import test from "node:test";
import {
  explainCompetitionUse,
  getByGrouping,
  getClassification,
  getCombosFor,
  getLegality,
  getSafetyAdvisories,
  getVariantsFor,
  isLegal,
  isPracticeSafe
} from "../src/query.mjs";

test("ma-sutemi-waza classification includes translation and kana", () => {
  const classification = getClassification("ma-sutemi-waza");

  assert.equal(classification.english, "rear sacrifice techniques");
  assert.equal(classification.japanese, "真捨身技");
  assert.equal(classification.kana, "ますてみわざ");
});

test("ma-sutemi-waza catalog chunk contains the five base throws with kana", () => {
  const throws = getByGrouping("ma-sutemi-waza");
  const slugs = throws.map((technique) => technique.slug).sort();

  assert.deepEqual(slugs, [
    "hikikomi-gaeshi",
    "sumi-gaeshi",
    "tawara-gaeshi",
    "tomoe-nage",
    "ura-nage"
  ]);
  assert.ok(throws.every((technique) => technique.names.kana));
});

test("traditional leg-grab kata-guruma is not returned in IJF-legal variant searches", () => {
  const legalVariants = getVariantsFor("kata-guruma", { legalOnly: true });
  assert.ok(!legalVariants.some((variant) => variant.slug === "kata-guruma-traditional-leg-grab"));
});

test("modified no-leg-grab kata-guruma is returned as IJF-legal", () => {
  const legalVariants = getVariantsFor("kata-guruma", { legalOnly: true });
  assert.ok(legalVariants.some((variant) => variant.slug === "kata-guruma-modified-no-leg-grab"));
  assert.equal(getLegality("kata-guruma-modified-no-leg-grab").status, "legal");
});

test("kata-guruma competition explanation separates base technique from variants", () => {
  const explanation = explainCompetitionUse("kata-guruma");
  const traditional = explanation.variants.find((entry) => entry.variant.slug === "kata-guruma-traditional-leg-grab");
  const modified = explanation.variants.find((entry) => entry.variant.slug === "kata-guruma-modified-no-leg-grab");

  assert.equal(traditional.legality.status, "illegal");
  assert.equal(modified.legality.status, "legal");
});

test("standing shime-waza and standing kansetsu-waza are restricted", () => {
  assert.equal(getLegality("hadaka-jime-standing").status, "restricted");
  assert.ok(getLegality("hadaka-jime-standing").reasons.includes("standing-shime-waza"));

  assert.equal(getLegality("ude-garami-standing").status, "restricted");
  assert.ok(getLegality("ude-garami-standing").reasons.includes("standing-kansetsu-waza"));
});

test("wrist-lock variants are illegal as non-elbow joint locks", () => {
  const record = getLegality("kote-gaeshi-wrist-lock");
  assert.equal(record.status, "illegal");
  assert.ok(record.reasons.includes("joint-lock-not-elbow"));
});

test("ura-nage can be competition legal while carrying practice caution", () => {
  assert.ok(isLegal("ura-nage-standard"));
  assert.equal(isPracticeSafe("ura-nage-standard", "randori"), false);

  const advisories = getSafetyAdvisories("ura-nage-standard", "randori");
  assert.ok(advisories.some((advisory) => advisory.level === "avoid-in-randori"));
});

test("combo search distinguishes same-direction pressure from alternating-direction reaction", () => {
  const sameDirection = getCombosFor("o-uchi-gari-right", {
    legalOnly: true,
    practiceSafeOnly: true,
    pattern: "same-direction-pressure",
    stanceContext: "aiyotsu",
    toriSide: "right"
  });

  const alternating = getCombosFor("ko-uchi-gari-right", {
    legalOnly: true,
    practiceSafeOnly: true,
    pattern: "alternating-direction-reaction",
    stanceContext: "aiyotsu",
    toriSide: "right"
  });

  assert.equal(sameDirection.length, 1);
  assert.equal(sameDirection[0].toSlug, "ko-uchi-gari-right");
  assert.equal(alternating.length, 1);
  assert.equal(alternating[0].toSlug, "seoi-nage-right-turn");
});
