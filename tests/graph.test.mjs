import assert from "node:assert/strict";
import test from "node:test";
import {
  explainCompetitionUse,
  getByGrouping,
  getClassification,
  getTechnique,
  getCombosFor,
  getLegality,
  getSafetyAdvisories,
  getVariantsFor,
  gripContexts,
  isLegal,
  isPracticeSafe,
  techniques
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

test("koshi-waza catalog chunk contains the ten hip throws with kana", () => {
  const throws = getByGrouping("koshi-waza");
  const slugs = throws.map((technique) => technique.slug).sort();

  assert.deepEqual(slugs, [
    "hane-goshi",
    "harai-goshi",
    "koshi-guruma",
    "o-goshi",
    "sode-tsurikomi-goshi",
    "tsuri-goshi",
    "tsurikomi-goshi",
    "uki-goshi",
    "ushiro-goshi",
    "utsuri-goshi"
  ]);
  assert.ok(throws.every((technique) => technique.names.kana));
});

test("te-waza catalog chunk contains the sixteen hand throws with kana", () => {
  const throws = getByGrouping("te-waza");
  const slugs = throws.map((technique) => technique.slug).sort();

  assert.deepEqual(slugs, [
    "ippon-seoi-nage",
    "kata-guruma",
    "kibisu-gaeshi",
    "ko-uchi-gaeshi",
    "kuchiki-taoshi",
    "morote-gari",
    "obi-otoshi",
    "obi-tori-gaeshi",
    "seoi-nage",
    "seoi-otoshi",
    "sukui-nage",
    "sumi-otoshi",
    "tai-otoshi",
    "uchi-mata-sukashi",
    "uki-otoshi",
    "yama-arashi"
  ]);
  assert.ok(throws.every((technique) => technique.names.kana));
});

test("yoko-sutemi-waza catalog chunk contains the sixteen side sacrifice throws with kana", () => {
  const throws = getByGrouping("yoko-sutemi-waza");
  const slugs = throws.map((technique) => technique.slug).sort();

  assert.deepEqual(slugs, [
    "daki-wakare",
    "hane-makikomi",
    "harai-makikomi",
    "kani-basami",
    "kawazu-gake",
    "ko-uchi-makikomi",
    "o-soto-makikomi",
    "soto-makikomi",
    "tani-otoshi",
    "uchi-makikomi",
    "uchi-mata-makikomi",
    "uki-waza",
    "yoko-gake",
    "yoko-guruma",
    "yoko-otoshi",
    "yoko-wakare"
  ]);
  assert.ok(throws.every((technique) => technique.names.kana));
});

test("katame-waza catalog contains the thirty-two grappling techniques with kana", () => {
  const techniques = getByGrouping("katame-waza");

  assert.equal(techniques.length, 32);
  assert.ok(techniques.every((technique) => technique.names.kana));
});

test("osaekomi-waza catalog chunk contains the ten hold-down techniques", () => {
  const techniques = getByGrouping("osaekomi-waza");
  const slugs = techniques.map((technique) => technique.slug).sort();

  assert.deepEqual(slugs, [
    "kami-shiho-gatame",
    "kata-gatame",
    "kesa-gatame",
    "kuzure-kami-shiho-gatame",
    "kuzure-kesa-gatame",
    "tate-shiho-gatame",
    "uki-gatame",
    "ura-gatame",
    "ushiro-kesa-gatame",
    "yoko-shiho-gatame"
  ]);
});

test("shime-waza catalog chunk contains the twelve choking techniques", () => {
  const techniques = getByGrouping("shime-waza");
  const slugs = techniques.map((technique) => technique.slug).sort();

  assert.deepEqual(slugs, [
    "do-jime",
    "gyaku-juji-jime",
    "hadaka-jime",
    "kata-juji-jime",
    "kataha-jime",
    "katate-jime",
    "nami-juji-jime",
    "okuri-eri-jime",
    "ryote-jime",
    "sankaku-jime",
    "sode-guruma-jime",
    "tsukkomi-jime"
  ]);
});

test("kansetsu-waza catalog chunk contains the ten joint lock techniques", () => {
  const techniques = getByGrouping("kansetsu-waza");
  const slugs = techniques
    .filter((technique) => technique.sourceIds.includes("kodokan-repertoire"))
    .map((technique) => technique.slug)
    .sort();

  assert.deepEqual(slugs, [
    "ashi-garami",
    "ude-garami",
    "ude-hishigi-ashi-gatame",
    "ude-hishigi-hara-gatame",
    "ude-hishigi-hiza-gatame",
    "ude-hishigi-juji-gatame",
    "ude-hishigi-sankaku-gatame",
    "ude-hishigi-te-gatame",
    "ude-hishigi-ude-gatame",
    "ude-hishigi-waki-gatame"
  ]);
});

test("every technique has an IJF senior legality record", () => {
  const missing = techniques
    .filter((technique) => !getLegality(technique.slug))
    .map((technique) => technique.slug);

  assert.deepEqual(missing, []);
});

test("grip and stance contexts are available for filtering", () => {
  const slugs = gripContexts.map((context) => context.slug).sort();

  assert.deepEqual(slugs, [
    "aiyotsu",
    "georgian-grip",
    "kenkayotsu",
    "standard-kumi-kata"
  ]);

  const oUchi = getVariantsFor("o-uchi-gari").find((variant) => variant.slug === "o-uchi-gari-right");
  const hikikomi = getVariantsFor("hikikomi-gaeshi").find((variant) => variant.slug === "hikikomi-gaeshi-georgian-grip");

  assert.ok(oUchi.gripContextSlugs.includes("standard-kumi-kata"));
  assert.ok(oUchi.gripContextSlugs.includes("aiyotsu"));
  assert.ok(hikikomi.gripContextSlugs.includes("georgian-grip"));
});

test("traditional leg-grab kata-guruma is not returned in IJF-legal variant searches", () => {
  const legalVariants = getVariantsFor("kata-guruma", { legalOnly: true });
  assert.ok(!legalVariants.some((variant) => variant.slug === "kata-guruma-traditional-leg-grab"));
});

test("known IJF forbidden or leg-grab techniques are illegal or restricted", () => {
  assert.equal(getLegality("kani-basami").status, "illegal");
  assert.equal(getLegality("kawazu-gake").status, "illegal");
  assert.equal(getLegality("do-jime").status, "illegal");
  assert.equal(getLegality("ashi-garami").status, "illegal");
  assert.equal(getLegality("morote-gari").status, "illegal");
  assert.equal(getLegality("kuchiki-taoshi").status, "illegal");
  assert.equal(getLegality("kibisu-gaeshi").status, "illegal");
  assert.equal(getLegality("sukui-nage").status, "illegal");
  assert.equal(getLegality("kata-guruma").status, "restricted");
});

test("representative competition techniques are legal at base level", () => {
  assert.equal(getLegality("seoi-nage").status, "legal");
  assert.equal(getLegality("o-goshi").status, "legal");
  assert.equal(getLegality("tomoe-nage").status, "legal");
  assert.equal(getLegality("kesa-gatame").status, "legal");
  assert.equal(getLegality("hadaka-jime").status, "legal");
  assert.equal(getLegality("ude-garami").status, "legal");
  assert.equal(getLegality("ude-hishigi-juji-gatame").status, "legal");
});

test("kata-guruma separates base technique theme from variant mechanics", () => {
  const kataGuruma = getTechnique("kata-guruma");
  const traditional = getVariantsFor("kata-guruma").find((variant) => variant.slug === "kata-guruma-traditional-leg-grab");
  const modified = getVariantsFor("kata-guruma").find((variant) => variant.slug === "kata-guruma-modified-no-leg-grab");

  assert.ok(kataGuruma.mechanicsTheme.includes("Shoulder-wheel family"));
  assert.ok(traditional.mechanics.kuzushi.summary.includes("Draw uke forward"));
  assert.ok(traditional.mechanics.tsukuri.summary.includes("leg"));
  assert.ok(modified.mechanics.kuzushi.summary.includes("without using prohibited"));
  assert.ok(modified.mechanics.tsukuri.summary.includes("upper-body control"));
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
