import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const cwdDataDir = join(process.cwd(), "data");
const dataDir = existsSync(cwdDataDir) ? cwdDataDir : join(rootDir, "data");

const readJson = (name) => JSON.parse(readFileSync(join(dataDir, name), "utf8"));

export const sources = readJson("sources.json");
export const rulesets = readJson("rulesets.json");
export const classifications = readJson("classifications.json");
export const gripContexts = readJson("grip-contexts.json");
export const techniques = readJson("techniques.json");
export const variants = readJson("variants.json");
export const legality = readJson("legality.json");
export const safetyAdvisories = readJson("safety-advisories.json");
export const comboEdges = readJson("combo-edges.json");

export const DEFAULT_RULESET_ID = rulesets.find((ruleset) => ruleset.default)?.id ?? "IJF_SENIOR_2026";

const searchableText = (technique) =>
  [
    technique.slug,
    technique.names.english,
    technique.names.japaneseRomaji,
    technique.names.japanese,
    technique.names.kana,
    ...technique.names.aliases,
    ...technique.classifications
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const safeLevels = new Set(["normal", "caution"]);
const legalStatuses = new Set(["legal"]);

export function getTechnique(slug) {
  const technique = techniques.find((item) => item.slug === slug);
  if (!technique) return undefined;

  return {
    ...technique,
    variants: variants.filter((variant) => variant.baseTechniqueSlug === slug),
    safetyAdvisories: safetyAdvisories.filter((advisory) => advisory.subjectSlug === slug)
  };
}

export function searchTechniques(query, filters = {}) {
  const normalized = query.trim().toLowerCase();
  return techniques.filter((technique) => {
    if (normalized && !searchableText(technique).includes(normalized)) return false;
    if (filters.classification && !technique.classifications.includes(filters.classification)) return false;
    if (filters.domain && !technique.domains.includes(filters.domain)) return false;
    return true;
  });
}

export function getByGrouping(groupSlug) {
  return techniques.filter((technique) => technique.classifications.includes(groupSlug));
}

export function getClassification(slug) {
  return classifications.find((classification) => classification.slug === slug);
}

export function getVariantsFor(baseTechniqueSlug, filters = {}) {
  const rulesetId = filters.rulesetId ?? DEFAULT_RULESET_ID;
  return variants.filter((variant) => {
    if (variant.baseTechniqueSlug !== baseTechniqueSlug) return false;
    if (filters.legalOnly && !isLegal(variant.slug, rulesetId)) return false;
    if (filters.practiceSafeOnly && !isPracticeSafe(variant.slug)) return false;
    return true;
  });
}

export function getLegality(subjectSlug, rulesetId = DEFAULT_RULESET_ID) {
  return legality.find((record) => record.subjectSlug === subjectSlug && record.rulesetId === rulesetId);
}

export function isLegal(subjectSlug, rulesetId = DEFAULT_RULESET_ID) {
  const record = getLegality(subjectSlug, rulesetId);
  return record ? legalStatuses.has(record.status) : false;
}

export function getSafetyAdvisories(subjectSlug, context) {
  return safetyAdvisories.filter((advisory) => {
    if (advisory.subjectSlug !== subjectSlug) return false;
    if (context && !advisory.context.includes(context)) return false;
    return true;
  });
}

export function isPracticeSafe(subjectSlug, context = "randori") {
  const advisories = getSafetyAdvisories(subjectSlug, context);
  if (advisories.length === 0) return true;
  return advisories.every((advisory) => safeLevels.has(advisory.level));
}

export function getCombosFor(subjectSlug, filters = {}) {
  const rulesetId = filters.rulesetId ?? DEFAULT_RULESET_ID;

  return comboEdges.filter((edge) => {
    if (edge.fromSlug !== subjectSlug) return false;
    if (filters.pattern && edge.pattern !== filters.pattern) return false;
    if (filters.stanceContext && edge.stanceContext !== "any" && edge.stanceContext !== filters.stanceContext) return false;
    if (filters.toriSide && edge.toriSide !== "any" && edge.toriSide !== filters.toriSide) return false;
    if (filters.legalOnly && (!isLegal(edge.fromSlug, rulesetId) || !isLegal(edge.toSlug, rulesetId))) return false;
    if (filters.practiceSafeOnly && (!isPracticeSafe(edge.fromSlug) || !isPracticeSafe(edge.toSlug))) return false;
    return true;
  });
}

export function getCountersFor(subjectSlug, filters = {}) {
  return getCombosFor(subjectSlug, { ...filters, pattern: "counter-sequence" });
}

export function explainCompetitionUse(baseTechniqueSlug, rulesetId = DEFAULT_RULESET_ID) {
  const technique = getTechnique(baseTechniqueSlug);
  if (!technique) return undefined;

  return {
    technique,
    rulesetId,
    variants: variants
      .filter((variant) => variant.baseTechniqueSlug === baseTechniqueSlug)
      .map((variant) => ({
        variant,
        legality: getLegality(variant.slug, rulesetId),
        safetyAdvisories: getSafetyAdvisories(variant.slug)
      }))
  };
}
