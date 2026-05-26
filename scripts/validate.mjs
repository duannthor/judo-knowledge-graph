import assert from "node:assert/strict";
import {
  comboEdges,
  classifications,
  gripContexts,
  kataMemberships,
  legality,
  promotionRequirements,
  rulesets,
  safetyAdvisories,
  sources,
  techniqueVideos,
  techniques,
  variants
} from "../src/query.mjs";

const sourceIds = new Set(sources.map((source) => source.id));
const rulesetIds = new Set(rulesets.map((ruleset) => ruleset.id));
const techniqueSlugs = new Set(techniques.map((technique) => technique.slug));
const classificationSlugs = new Set(classifications.map((classification) => classification.slug));
const gripContextSlugs = new Set(gripContexts.map((gripContext) => gripContext.slug));
const variantSlugs = new Set(variants.map((variant) => variant.slug));
const graphSlugs = new Set([...techniqueSlugs, ...variantSlugs]);

const assertSources = (record) => {
  assert.ok(Array.isArray(record.sourceIds) && record.sourceIds.length > 0, `${record.subjectSlug ?? record.slug ?? record.id} needs sources`);
  for (const sourceId of record.sourceIds) {
    assert.ok(sourceIds.has(sourceId), `Unknown sourceId ${sourceId}`);
  }
};

const assertMechanicsSources = (owner, mechanics) => {
  if (!mechanics) return;

  for (const phaseName of ["kuzushi", "tsukuri", "kake"]) {
    if (mechanics[phaseName]) {
      assertSources({ ...mechanics[phaseName], slug: `${owner}.${phaseName}` });
    }
  }
};

for (const technique of techniques) {
  assert.ok(technique.slug, "Technique needs slug");
  assert.ok(technique.names?.english, `${technique.slug} needs English name`);
  assert.ok(technique.names?.japaneseRomaji, `${technique.slug} needs Japanese romanization`);
  assert.ok(technique.names?.kana, `${technique.slug} needs kana`);
  assert.ok(Array.isArray(technique.classifications) && technique.classifications.length > 0, `${technique.slug} needs classifications`);
  for (const classification of technique.classifications) {
    assert.ok(classificationSlugs.has(classification), `${technique.slug} has unknown classification ${classification}`);
  }
  for (const gripContextSlug of technique.gripContextSlugs ?? []) {
    assert.ok(gripContextSlugs.has(gripContextSlug), `${technique.slug} has unknown grip context ${gripContextSlug}`);
  }
  assertSources(technique);
  assertMechanicsSources(technique.slug, technique.phases);
}

for (const classification of classifications) {
  assert.ok(classification.slug, "Classification needs slug");
  assert.ok(classification.english, `${classification.slug} needs English translation`);
  assert.ok(classification.japaneseRomaji, `${classification.slug} needs Japanese romanization`);
  assert.ok(classification.kana, `${classification.slug} needs kana`);
  assertSources(classification);
}

for (const gripContext of gripContexts) {
  assert.ok(gripContext.slug, "Grip context needs slug");
  assert.ok(gripContext.label, `${gripContext.slug} needs label`);
  assert.ok(gripContext.type, `${gripContext.slug} needs type`);
  assert.ok(gripContext.phase, `${gripContext.slug} needs phase`);
  assertSources(gripContext);
}

for (const variant of variants) {
  assert.ok(techniqueSlugs.has(variant.baseTechniqueSlug), `${variant.slug} points to missing base ${variant.baseTechniqueSlug}`);
  for (const gripContextSlug of variant.gripContextSlugs ?? []) {
    assert.ok(gripContextSlugs.has(gripContextSlug), `${variant.slug} has unknown grip context ${gripContextSlug}`);
  }
  assertSources(variant);
  assertMechanicsSources(variant.slug, variant.mechanics);
}

for (const record of legality) {
  assert.ok(rulesetIds.has(record.rulesetId), `${record.subjectSlug} has unknown ruleset ${record.rulesetId}`);
  assert.ok(record.status, `${record.subjectSlug} needs legality status`);
  assert.ok(record.reasons.length > 0, `${record.subjectSlug} needs legality reasons`);
  assertSources(record);

  if (record.status === "illegal" && record.subjectType === "variant") {
    const variant = variants.find((item) => item.slug === record.subjectSlug);
    assert.ok(variant, `Illegal variant ${record.subjectSlug} must exist`);
    assert.ok(techniqueSlugs.has(variant.baseTechniqueSlug), `Illegal variant ${record.subjectSlug} must remain connected to base technique`);
  }
}

for (const technique of techniques) {
  assert.ok(
    legality.some((record) => record.subjectSlug === technique.slug && record.subjectType === "technique"),
    `${technique.slug} needs a technique-level legality record`
  );
}

for (const advisory of safetyAdvisories) {
  assert.ok(graphSlugs.has(advisory.subjectSlug), `${advisory.subjectSlug} advisory points to missing graph node`);
  assert.ok(advisory.level, `${advisory.subjectSlug} advisory needs level`);
  assert.ok(advisory.context.length > 0, `${advisory.subjectSlug} advisory needs context`);
  assert.ok(advisory.reasons.length > 0, `${advisory.subjectSlug} advisory needs reasons`);
  assertSources(advisory);
}

for (const edge of comboEdges) {
  assert.ok(graphSlugs.has(edge.fromSlug), `${edge.fromSlug} combo source does not exist`);
  assert.ok(graphSlugs.has(edge.toSlug), `${edge.toSlug} combo target does not exist`);
  assert.ok(edge.pattern, `${edge.fromSlug} -> ${edge.toSlug} needs combo pattern`);
  assertSources(edge);
}

for (const requirement of promotionRequirements) {
  assert.ok(requirement.id, "Promotion requirement needs id");
  assert.ok(requirement.rulesetId, `${requirement.id} needs rulesetId`);
  assert.ok(requirement.label, `${requirement.id} needs label`);
  assert.ok(requirement.japanese, `${requirement.id} needs Japanese rank text`);
  assert.ok(requirement.beltColor, `${requirement.id} needs beltColor`);
  assert.ok(Array.isArray(requirement.techniqueSlugs), `${requirement.id} needs techniqueSlugs`);
  for (const techniqueSlug of requirement.techniqueSlugs) {
    assert.ok(techniqueSlugs.has(techniqueSlug), `${requirement.id} points to missing technique ${techniqueSlug}`);
  }
  for (const stub of requirement.requirementStubs ?? []) {
    assert.ok(stub.id, `${requirement.id} has requirement stub without id`);
    assert.ok(stub.type, `${stub.id} needs type`);
    assert.ok(stub.label, `${stub.id} needs label`);
    for (const techniqueSlug of stub.exampleSlugs ?? []) {
      assert.ok(techniqueSlugs.has(techniqueSlug), `${stub.id} example points to missing technique ${techniqueSlug}`);
    }
    if (stub.action) {
      assert.ok(stub.action.label, `${stub.id} action needs label`);
      assert.ok(stub.action.href, `${stub.id} action needs href`);
    }
  }
  assertSources(requirement);
}

const phaseRequiredPromotionRankIds = new Set([
  "usjf-senior-2026-go-kyu",
  "usjf-senior-2026-yon-kyu",
  "usjf-senior-2026-san-kyu",
  "usjf-senior-2026-ni-kyu",
  "usjf-senior-2026-ikkyu",
  "usjf-senior-2026-shodan"
]);
for (const requirement of promotionRequirements.filter((item) => phaseRequiredPromotionRankIds.has(item.id))) {
  for (const techniqueSlug of requirement.techniqueSlugs) {
    const technique = techniques.find((item) => item.slug === techniqueSlug);
    assert.ok(technique?.phases?.kuzushi, `${requirement.id} technique ${techniqueSlug} needs kuzushi`);
    assert.ok(technique?.phases?.tsukuri, `${requirement.id} technique ${techniqueSlug} needs tsukuri`);
    assert.ok(technique?.phases?.kake, `${requirement.id} technique ${techniqueSlug} needs kake`);
  }
}

for (const kata of kataMemberships) {
  assert.ok(kata.id, "Kata membership needs id");
  assert.ok(kata.label, `${kata.id} needs label`);
  assert.ok(Array.isArray(kata.techniqueSlugs), `${kata.id} needs techniqueSlugs`);
  for (const techniqueSlug of kata.techniqueSlugs) {
    assert.ok(techniqueSlugs.has(techniqueSlug), `${kata.id} points to missing technique ${techniqueSlug}`);
  }
  assertSources(kata);
}

for (const video of techniqueVideos) {
  assert.ok(techniqueSlugs.has(video.techniqueSlug), `${video.techniqueSlug} video points to missing technique`);
  assert.ok(video.title, `${video.techniqueSlug} video needs title`);
  assert.ok(video.youtubeId, `${video.techniqueSlug} video needs youtubeId`);
  assert.ok(video.playlistId, `${video.techniqueSlug} video needs playlistId`);
  assertSources(video);
}

console.log(`Validated ${techniques.length} techniques, ${classifications.length} classifications, ${variants.length} variants, ${legality.length} legality records, ${promotionRequirements.length} promotion ranks, ${kataMemberships.length} kata memberships, ${techniqueVideos.length} technique videos.`);
