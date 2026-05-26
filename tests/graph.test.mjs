import assert from "node:assert/strict";
import test from "node:test";
import {
  explainCompetitionUse,
  getByGrouping,
  getClassification,
  getTechnique,
  getCombosFor,
  getCountersFor,
  getLegality,
  getSafetyAdvisories,
  getVariantsFor,
  gripContexts,
  isLegal,
  isPracticeSafe,
  kataMemberships,
  promotionRequirements,
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

test("koshi-waza catalog chunk contains the hip throws with kana", () => {
  const throws = getByGrouping("koshi-waza");
  const slugs = throws.map((technique) => technique.slug).sort();

  assert.deepEqual(slugs, [
    "hane-goshi",
    "harai-goshi",
    "ko-tsuri-goshi",
    "koshi-guruma",
    "o-goshi",
    "o-tsuri-goshi",
    "sode-tsurikomi-goshi",
    "tsuri-goshi",
    "tsurikomi-goshi",
    "uki-goshi",
    "ushiro-goshi",
    "utsuri-goshi"
  ]);
  assert.ok(throws.every((technique) => technique.names.kana));
});

test("te-waza catalog chunk contains the hand throws with kana", () => {
  const throws = getByGrouping("te-waza");
  const slugs = throws.map((technique) => technique.slug).sort();

  assert.deepEqual(slugs, [
    "eri-seoi-nage",
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
  const techniques = getByGrouping("katame-waza").filter((technique) => technique.sourceIds.includes("kodokan-repertoire"));

  assert.equal(techniques.length, 32);
  assert.ok(techniques.every((technique) => technique.names.kana));
});

test("osaekomi-waza catalog chunk contains hold-down techniques", () => {
  const techniques = getByGrouping("osaekomi-waza");
  const slugs = techniques.map((technique) => technique.slug).sort();

  assert.deepEqual(slugs, [
    "kami-shiho-gatame",
    "kata-gatame",
    "kesa-gatame",
    "kuzure-kami-shiho-gatame",
    "kuzure-kesa-gatame",
    "kuzure-yoko-shiho-gatame",
    "makura-kesa-gatame",
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
    "collar-sleeve-control",
    "frame-control",
    "georgian-grip",
    "guard",
    "kenkayotsu",
    "leg-control",
    "mount",
    "north-south",
    "over-back-belt-control",
    "side-control",
    "standard-kumi-kata",
    "underhook-hip-control"
  ]);

  const oUchi = getVariantsFor("o-uchi-gari").find((variant) => variant.slug === "o-uchi-gari-right");
  const hikikomi = getVariantsFor("hikikomi-gaeshi").find((variant) => variant.slug === "hikikomi-gaeshi-georgian-grip");

  assert.ok(oUchi.gripContextSlugs.includes("standard-kumi-kata"));
  assert.ok(oUchi.gripContextSlugs.includes("aiyotsu"));
  assert.ok(hikikomi.gripContextSlugs.includes("georgian-grip"));
  assert.equal(gripContexts.find((context) => context.slug === "aiyotsu").shortGloss, "same-side stance");
  assert.equal(gripContexts.find((context) => context.slug === "kenkayotsu").shortGloss, "opposite-side stance");
});

test("USJF senior promotion requirements tag concrete graph techniques by rank", () => {
  const ranks = promotionRequirements.map((rank) => rank.id);

  assert.deepEqual(ranks, [
    "usjf-senior-2026-go-kyu",
    "usjf-senior-2026-yon-kyu",
    "usjf-senior-2026-san-kyu",
    "usjf-senior-2026-ni-kyu",
    "usjf-senior-2026-ikkyu",
    "usjf-senior-2026-shodan"
  ]);
  assert.ok(promotionRequirements.find((rank) => rank.id === "usjf-senior-2026-go-kyu").techniqueSlugs.includes("o-soto-gari"));
  assert.ok(promotionRequirements.find((rank) => rank.id === "usjf-senior-2026-yon-kyu").techniqueSlugs.includes("seoi-nage"));
  assert.ok(promotionRequirements.find((rank) => rank.id === "usjf-senior-2026-shodan").techniqueSlugs.includes("morote-gari"));
});

test("USJF promotion requirements map named techniques and preserve requirement stubs", () => {
  const ranks = promotionRequirements;
  const niKyu = promotionRequirements.find((rank) => rank.id === "usjf-senior-2026-ni-kyu");
  const shodan = promotionRequirements.find((rank) => rank.id === "usjf-senior-2026-shodan");

  assert.ok(ranks.every((rank) => rank.unmappedItems.length === 0));
  assert.ok(shodan.techniqueSlugs.includes("ashi-guruma"));
  assert.ok(niKyu.requirementStubs.some((stub) => stub.type === "combination"));
  assert.ok(niKyu.requirementStubs.some((stub) => stub.type === "counter"));
  assert.ok(ranks.every((rank) => !rank.requirementStubs.some((stub) => ["defense", "aggregate-requirement"].includes(stub.type))));
});

test("USJF promotion requirements map shime and kansetsu defenses to concrete nodes", () => {
  const yonKyu = promotionRequirements.find((rank) => rank.id === "usjf-senior-2026-yon-kyu");
  const sanKyu = promotionRequirements.find((rank) => rank.id === "usjf-senior-2026-san-kyu");
  const niKyu = promotionRequirements.find((rank) => rank.id === "usjf-senior-2026-ni-kyu");
  const ikkyu = promotionRequirements.find((rank) => rank.id === "usjf-senior-2026-ikkyu");
  const shodan = promotionRequirements.find((rank) => rank.id === "usjf-senior-2026-shodan");

  assert.ok(yonKyu.techniqueSlugs.includes("hadaka-jime-defense"));
  assert.ok(yonKyu.techniqueSlugs.includes("okuri-eri-jime-defense"));
  assert.ok(yonKyu.techniqueSlugs.includes("ude-hishigi-juji-gatame-defense"));
  assert.ok(sanKyu.techniqueSlugs.includes("nami-juji-jime-defense"));
  assert.ok(sanKyu.techniqueSlugs.includes("ude-garami-defense"));
  assert.ok(niKyu.techniqueSlugs.includes("kataha-jime-defense"));
  assert.ok(niKyu.techniqueSlugs.includes("ude-hishigi-waki-gatame-defense"));
  assert.ok(ikkyu.techniqueSlugs.includes("sode-guruma-jime-defense"));
  assert.ok(ikkyu.techniqueSlugs.includes("ude-hishigi-sankaku-gatame-defense"));
  assert.ok(shodan.techniqueSlugs.includes("tsukkomi-jime-defense"));
  assert.ok(shodan.techniqueSlugs.includes("ryote-jime-defense"));
});

test("USJF upper-rank all-osaekomi requirements include new hold and escape nodes", () => {
  const ikkyu = promotionRequirements.find((rank) => rank.id === "usjf-senior-2026-ikkyu");
  const shodan = promotionRequirements.find((rank) => rank.id === "usjf-senior-2026-shodan");

  for (const slug of ["makura-kesa-gatame", "kuzure-yoko-shiho-gatame", "kesa-gatame-frame-turn-in-escape"]) {
    assert.ok(ikkyu.techniqueSlugs.includes(slug));
    assert.ok(shodan.techniqueSlugs.includes(slug));
  }
});

test("USJF syllabus-specific escape requirements map to concrete escape nodes", () => {
  const yonKyu = promotionRequirements.find((rank) => rank.id === "usjf-senior-2026-yon-kyu");
  const sanKyu = promotionRequirements.find((rank) => rank.id === "usjf-senior-2026-san-kyu");

  assert.ok(yonKyu.techniqueSlugs.includes("kesa-gatame-frame-turn-in-escape"));
  assert.ok(sanKyu.techniqueSlugs.includes("side-control-frame-shrimp-escape"));
  assert.ok(!yonKyu.unmappedItems.includes("One escape from kesa-gatame"));
  assert.ok(!sanKyu.unmappedItems.includes("One escape from yoko-shiho-gatame"));
});

test("Nage-no-kata membership tags existing graph techniques and stubs missing throws", () => {
  const nageNoKata = kataMemberships.find((kata) => kata.id === "nage-no-kata");

  assert.ok(nageNoKata.techniqueSlugs.includes("uki-otoshi"));
  assert.ok(nageNoKata.techniqueSlugs.includes("okuri-ashi-harai"));
  assert.ok(nageNoKata.techniqueSlugs.includes("sasae-tsurikomi-ashi"));
  assert.ok(nageNoKata.techniqueSlugs.includes("kata-guruma"));
  assert.ok(nageNoKata.techniqueSlugs.includes("uki-waza"));
  assert.equal(nageNoKata.unmappedItems.length, 0);
});

test("engagement contexts are split by standing and ground phase", () => {
  const standing = gripContexts
    .filter((context) => context.phase === "standing")
    .map((context) => context.slug)
    .sort();
  const ground = gripContexts
    .filter((context) => context.phase === "ground")
    .map((context) => context.slug)
    .sort();

  assert.deepEqual(standing, [
    "aiyotsu",
    "georgian-grip",
    "kenkayotsu",
    "leg-control",
    "standard-kumi-kata"
  ]);
  assert.deepEqual(ground, [
    "collar-sleeve-control",
    "frame-control",
    "guard",
    "mount",
    "north-south",
    "over-back-belt-control",
    "side-control",
    "underhook-hip-control"
  ]);
});

test("standing throwing techniques are hydrated with baseline kumi-kata context", () => {
  const legControlTechniques = new Set(["sukui-nage", "morote-gari", "kuchiki-taoshi", "kibisu-gaeshi"]);
  const missing = techniques
    .filter((technique) => technique.classifications.includes("nage-waza") && technique.domains.includes("standing"))
    .filter((technique) => !legControlTechniques.has(technique.slug))
    .filter((technique) => !technique.gripContextSlugs?.includes("standard-kumi-kata"))
    .map((technique) => technique.slug);

  assert.deepEqual(missing, []);
});

test("classic leg-control techniques are not hydrated as standard kumi-kata", () => {
  const legControlTechniques = ["sukui-nage", "morote-gari", "kuchiki-taoshi", "kibisu-gaeshi"];

  for (const slug of legControlTechniques) {
    const technique = techniques.find((item) => item.slug === slug);
    assert.ok(technique.gripContextSlugs.includes("leg-control"));
    assert.ok(!technique.gripContextSlugs.includes("standard-kumi-kata"));
  }
});

test("contextual grip filters have reviewed technique seeds", () => {
  const aiyotsuTechniques = techniques.filter((technique) => technique.gripContextSlugs?.includes("aiyotsu"));
  const kenkayotsuTechniques = techniques.filter((technique) => technique.gripContextSlugs?.includes("kenkayotsu"));
  const georgianGripTechniques = techniques.filter((technique) => technique.gripContextSlugs?.includes("georgian-grip"));
  const mountTechniques = techniques.filter((technique) => technique.gripContextSlugs?.includes("mount"));
  const northSouthTechniques = techniques.filter((technique) => technique.gripContextSlugs?.includes("north-south"));
  const guardTechniques = techniques.filter((technique) => technique.gripContextSlugs?.includes("guard"));
  const collarSleeveTechniques = techniques.filter((technique) => technique.gripContextSlugs?.includes("collar-sleeve-control"));
  const sideControlTechniques = techniques.filter((technique) => technique.gripContextSlugs?.includes("side-control"));
  const overBackBeltTechniques = techniques.filter((technique) => technique.gripContextSlugs?.includes("over-back-belt-control"));

  assert.ok(aiyotsuTechniques.some((technique) => technique.slug === "seoi-nage"));
  assert.ok(kenkayotsuTechniques.some((technique) => technique.slug === "harai-goshi"));
  assert.ok(georgianGripTechniques.some((technique) => technique.slug === "hikikomi-gaeshi"));
  assert.ok(mountTechniques.some((technique) => technique.slug === "tate-shiho-gatame"));
  assert.ok(northSouthTechniques.some((technique) => technique.slug === "kami-shiho-gatame"));
  assert.ok(guardTechniques.some((technique) => technique.slug === "sankaku-jime"));
  assert.ok(collarSleeveTechniques.some((technique) => technique.slug === "ude-hishigi-juji-gatame"));
  assert.ok(sideControlTechniques.some((technique) => technique.slug === "side-control-frame-shrimp-escape"));
  assert.ok(overBackBeltTechniques.some((technique) => technique.slug === "side-control-underhook-hip-escape"));
});

test("practical ground escape nodes are searchable and legal defensive actions", () => {
  const escapes = getByGrouping("ne-waza-escape");
  const slugs = escapes.map((technique) => technique.slug).sort();

  for (const slug of [
    "kesa-gatame-frame-turn-in-escape",
    "mount-bridge-and-roll-escape",
    "mount-elbow-knee-escape",
    "north-south-frame-turn-in-escape",
    "side-control-frame-shrimp-escape",
    "side-control-underhook-hip-escape",
    "hadaka-jime-defense",
    "ude-hishigi-juji-gatame-defense"
  ]) {
    assert.ok(slugs.includes(slug));
  }
  assert.ok(escapes.every((technique) => technique.roles.includes("escape")));
  assert.ok(escapes.every((technique) => getLegality(technique.slug).status === "legal"));
  assert.ok(escapes.every((technique) => technique.names.japanese.includes("逃れ方") || technique.names.japanese.includes("防ぎ方")));
  assert.ok(escapes.every((technique) => technique.names.kana.includes("のがれかた") || technique.names.kana.includes("ふせぎかた")));
});

test("hold-down techniques are linked to practical escape counters", () => {
  const kamiCounters = getCountersFor("kami-shiho-gatame");
  const kesaCounters = getCountersFor("kesa-gatame");
  const yokoCounters = getCountersFor("yoko-shiho-gatame");
  const tateCounters = getCountersFor("tate-shiho-gatame");

  assert.ok(kamiCounters.some((edge) => edge.toSlug === "north-south-frame-turn-in-escape"));
  assert.ok(kesaCounters.some((edge) => edge.toSlug === "kesa-gatame-frame-turn-in-escape"));
  assert.ok(yokoCounters.some((edge) => edge.toSlug === "side-control-frame-shrimp-escape"));
  assert.ok(yokoCounters.some((edge) => edge.toSlug === "side-control-underhook-hip-escape"));
  assert.ok(tateCounters.some((edge) => edge.toSlug === "mount-bridge-and-roll-escape"));
  assert.ok(tateCounters.some((edge) => edge.toSlug === "mount-elbow-knee-escape"));
});

test("standing attacks are linked to named counter techniques", () => {
  const oSotoCounters = getCountersFor("o-soto-gari");
  const deAshiCounters = getCountersFor("de-ashi-harai");
  const oUchiCounters = getCountersFor("o-uchi-gari");
  const koUchiCounters = getCountersFor("ko-uchi-gari");
  const koUchiRightCounters = getCountersFor("ko-uchi-gari-right", { stanceContext: "aiyotsu", toriSide: "right" });
  const haneGoshiCounters = getCountersFor("hane-goshi");
  const haraiGoshiCounters = getCountersFor("harai-goshi");
  const uchiMataCounters = getCountersFor("uchi-mata");

  assert.ok(oSotoCounters.some((edge) => edge.toSlug === "o-soto-gaeshi"));
  assert.ok(deAshiCounters.some((edge) => edge.toSlug === "tsubame-gaeshi"));
  assert.ok(oUchiCounters.some((edge) => edge.toSlug === "o-uchi-gaeshi"));
  assert.ok(koUchiCounters.some((edge) => edge.toSlug === "ko-uchi-gaeshi-evasion-counter"));
  assert.ok(koUchiCounters.some((edge) => edge.toSlug === "ko-uchi-gaeshi-pressure-counter"));
  assert.ok(koUchiRightCounters.some((edge) => edge.toSlug === "ko-uchi-gaeshi-evasion-counter"));
  assert.ok(koUchiRightCounters.some((edge) => edge.toSlug === "ko-uchi-gaeshi-pressure-counter"));
  assert.ok(haneGoshiCounters.some((edge) => edge.toSlug === "hane-goshi-gaeshi"));
  assert.ok(haraiGoshiCounters.some((edge) => edge.toSlug === "harai-goshi-gaeshi"));
  assert.ok(uchiMataCounters.some((edge) => edge.toSlug === "uchi-mata-sukashi"));
  assert.ok(uchiMataCounters.some((edge) => edge.toSlug === "uchi-mata-gaeshi"));
});

test("ko-uchi-gaeshi variants distinguish evasion and pressure counters", () => {
  const variants = getVariantsFor("ko-uchi-gaeshi");
  const evasion = variants.find((variant) => variant.slug === "ko-uchi-gaeshi-evasion-counter");
  const pressure = variants.find((variant) => variant.slug === "ko-uchi-gaeshi-pressure-counter");

  assert.ok(evasion.modifiers.includes("evasion"));
  assert.ok(pressure.modifiers.includes("pressure"));
  assert.equal(getLegality("ko-uchi-gaeshi-evasion-counter").status, "legal");
  assert.equal(getLegality("ko-uchi-gaeshi-pressure-counter").status, "legal");
});

test("ground hold aliases include common positional names", () => {
  const kamiShiho = getTechnique("kami-shiho-gatame");
  const kuzureKamiShiho = getTechnique("kuzure-kami-shiho-gatame");
  const yokoShiho = getTechnique("yoko-shiho-gatame");

  assert.ok(kamiShiho.names.aliases.includes("north-south"));
  assert.ok(kuzureKamiShiho.names.aliases.includes("modified north-south"));
  assert.ok(yokoShiho.names.aliases.includes("side control"));
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
  assert.equal(getLegality("de-ashi-harai").status, "legal");
  assert.equal(getLegality("tsubame-gaeshi").status, "legal");
  assert.equal(getLegality("o-soto-gari").status, "legal");
  assert.equal(getLegality("o-soto-gaeshi").status, "legal");
  assert.equal(getLegality("o-uchi-gaeshi").status, "legal");
  assert.equal(getLegality("uchi-mata").status, "legal");
  assert.equal(getLegality("uchi-mata-gaeshi").status, "legal");
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

test("spine-risk sacrifice throws carry practice safety advisories", () => {
  const sumiGaeshi = getSafetyAdvisories("sumi-gaeshi", "randori");
  const hikikomiGaeshi = getSafetyAdvisories("hikikomi-gaeshi", "drilling");

  assert.ok(sumiGaeshi.some((advisory) => (
    advisory.level === "supervision-only" &&
    advisory.reasons.includes("spine-risk")
  )));
  assert.ok(hikikomiGaeshi.some((advisory) => (
    advisory.level === "supervision-only" &&
    advisory.reasons.includes("spine-risk")
  )));
});

test("trapped-arm and reverse seoi-nage risks are represented separately from legality", () => {
  const baseAdvisories = getSafetyAdvisories("seoi-nage", "randori");
  const reverseAdvisories = getSafetyAdvisories("eri-seoi-nage", "randori");

  assert.ok(isLegal("seoi-nage"));
  assert.equal(getLegality("eri-seoi-nage").status, "penalty-risk");
  assert.ok(baseAdvisories.some((advisory) => advisory.reasons.includes("trapped-arm-risk")));
  assert.ok(reverseAdvisories.some((advisory) => (
    advisory.level === "avoid-in-randori" &&
    advisory.reasons.includes("arm-lock-risk")
  )));
});

test("eri-seoi-nage is searchable as its own named reverse and Korean seoi technique", () => {
  const technique = getTechnique("eri-seoi-nage");

  assert.equal(technique.names.japaneseRomaji, "eri-seoi-nage");
  assert.ok(technique.names.aliases.includes("reverse seoi nage"));
  assert.ok(technique.names.aliases.includes("korean seoi nage"));
  assert.ok(technique.classifications.includes("te-waza"));
});

test("drop-entry shoulder variants are legal searchable standing variants", () => {
  const seoiDrops = getVariantsFor("seoi-nage", { legalOnly: true });
  const ipponDrops = getVariantsFor("ippon-seoi-nage", { legalOnly: true });
  const sodeDrops = getVariantsFor("sode-tsurikomi-goshi", { legalOnly: true });

  assert.ok(seoiDrops.some((variant) => variant.slug === "seoi-nage-drop-entry"));
  assert.ok(ipponDrops.some((variant) => variant.slug === "ippon-seoi-nage-drop-entry"));
  assert.ok(sodeDrops.some((variant) => variant.slug === "sode-tsurikomi-goshi-drop-entry"));
  assert.equal(getLegality("seoi-nage-drop-entry").status, "legal");
  assert.ok(getSafetyAdvisories("seoi-nage-drop-entry", "randori").some((advisory) => advisory.reasons.includes("drop-entry")));
});

test("seoi-nage and ippon-seoi-nage expose right and left turn chiral variants", () => {
  const seoiTurns = getVariantsFor("seoi-nage", { legalOnly: true });
  const ipponTurns = getVariantsFor("ippon-seoi-nage", { legalOnly: true });
  const rightIppon = ipponTurns.find((variant) => variant.slug === "ippon-seoi-nage-right-turn");
  const leftIppon = ipponTurns.find((variant) => variant.slug === "ippon-seoi-nage-left-turn");

  assert.ok(seoiTurns.some((variant) => variant.slug === "seoi-nage-right-turn"));
  assert.ok(seoiTurns.some((variant) => variant.slug === "seoi-nage-left-turn"));
  assert.equal(rightIppon.chirality.toriSide, "right");
  assert.equal(rightIppon.chirality.turn, "clockwise");
  assert.equal(leftIppon.chirality.toriSide, "left");
  assert.equal(leftIppon.chirality.turn, "counter-clockwise");
  assert.equal(getLegality("ippon-seoi-nage-right-turn").status, "legal");
});

test("forbidden scissors, entanglements, body scissors, and wrist locks carry safety bans", () => {
  for (const slug of ["kani-basami", "kawazu-gake", "ashi-garami", "do-jime", "kote-gaeshi"]) {
    const advisories = getSafetyAdvisories(slug, "competition");

    assert.ok(advisories.some((advisory) => advisory.level === "banned-in-competition"));
  }
});

test("chokes and elbow locks carry controlled-application safety advisories", () => {
  const chokeAdvisories = getSafetyAdvisories("hadaka-jime", "randori");
  const elbowLockAdvisories = getSafetyAdvisories("ude-hishigi-juji-gatame", "drilling");

  assert.ok(chokeAdvisories.some((advisory) => advisory.reasons.includes("shime-waza")));
  assert.ok(elbowLockAdvisories.some((advisory) => advisory.reasons.includes("elbow-lock-risk")));
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
