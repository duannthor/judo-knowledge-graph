import assert from "node:assert/strict";
import {
  comboEdges,
  classifications,
  legality,
  rulesets,
  safetyAdvisories,
  sources,
  techniques,
  variants
} from "../src/query.mjs";

const sourceIds = new Set(sources.map((source) => source.id));
const rulesetIds = new Set(rulesets.map((ruleset) => ruleset.id));
const techniqueSlugs = new Set(techniques.map((technique) => technique.slug));
const classificationSlugs = new Set(classifications.map((classification) => classification.slug));
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

for (const variant of variants) {
  assert.ok(techniqueSlugs.has(variant.baseTechniqueSlug), `${variant.slug} points to missing base ${variant.baseTechniqueSlug}`);
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

console.log(`Validated ${techniques.length} techniques, ${classifications.length} classifications, ${variants.length} variants, ${legality.length} legality records.`);
