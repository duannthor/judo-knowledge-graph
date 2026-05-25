import type {
  ComboEdge,
  ComboFilters,
  Classification,
  GripContext,
  Ruleset,
  RulesetLegality,
  SafetyAdvisory,
  SafetyContext,
  Source,
  Technique,
  TechniqueVariant
} from "./types";

export const sources: Source[];
export const rulesets: Ruleset[];
export const classifications: Classification[];
export const gripContexts: GripContext[];
export const techniques: Technique[];
export const variants: TechniqueVariant[];
export const legality: RulesetLegality[];
export const safetyAdvisories: SafetyAdvisory[];
export const comboEdges: ComboEdge[];
export const DEFAULT_RULESET_ID: string;

export function getTechnique(slug: string): (Technique & {
  variants: TechniqueVariant[];
  safetyAdvisories: SafetyAdvisory[];
}) | undefined;
export function searchTechniques(query: string, filters?: {
  classification?: string;
  domain?: "standing" | "ground";
}): Technique[];
export function getByGrouping(groupSlug: string): Technique[];
export function getClassification(slug: string): Classification | undefined;
export function getVariantsFor(baseTechniqueSlug: string, filters?: {
  legalOnly?: boolean;
  practiceSafeOnly?: boolean;
  rulesetId?: string;
}): TechniqueVariant[];
export function getLegality(subjectSlug: string, rulesetId?: string): RulesetLegality | undefined;
export function isLegal(subjectSlug: string, rulesetId?: string): boolean;
export function getSafetyAdvisories(subjectSlug: string, context?: SafetyContext): SafetyAdvisory[];
export function isPracticeSafe(subjectSlug: string, context?: SafetyContext): boolean;
export function getCombosFor(subjectSlug: string, filters?: ComboFilters): ComboEdge[];
export function getCountersFor(subjectSlug: string, filters?: ComboFilters): ComboEdge[];
export function explainCompetitionUse(baseTechniqueSlug: string, rulesetId?: string): {
  technique: Technique & {
    variants: TechniqueVariant[];
    safetyAdvisories: SafetyAdvisory[];
  };
  rulesetId: string;
  variants: Array<{
    variant: TechniqueVariant;
    legality: RulesetLegality | undefined;
    safetyAdvisories: SafetyAdvisory[];
  }>;
} | undefined;
