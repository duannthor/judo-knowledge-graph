export type Direction =
  | "front"
  | "back"
  | "left"
  | "right"
  | "front-left"
  | "front-right"
  | "back-left"
  | "back-right"
  | "clockwise"
  | "counter-clockwise";

export type LegalityStatus = "legal" | "illegal" | "penalty-risk" | "restricted" | "unknown";
export type LegalityAppliesTo = "base-technique" | "variant" | "action-feature";
export type SafetyLevel = "normal" | "caution" | "supervision-only" | "avoid-in-randori" | "banned-in-competition";
export type SafetyContext = "competition" | "randori" | "drilling" | "kata" | "self-defense";
export type SafetyAuthority = "official-rule" | "coach-advisory" | "dojo-policy" | "personal-note";
export type ComboPattern =
  | "same-direction-pressure"
  | "alternating-direction-reaction"
  | "direct-follow-up"
  | "counter-sequence";
export type StanceContext = "aiyotsu" | "kenkayotsu" | "any";
export type ToriSide = "right" | "left" | "any";
export type GripContextType = "grip" | "stance-relation" | "position";
export type EngagementPhase = "standing" | "ground" | "any";

export type Source = {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  publishedDate?: string;
  authority: string;
  notes?: string;
};

export type Classification = {
  slug: string;
  english: string;
  japaneseRomaji: string;
  japanese?: string;
  kana: string;
  notes?: string;
  sourceIds: string[];
};

export type GripContext = {
  slug: string;
  label: string;
  japanese?: string;
  kana?: string;
  type: GripContextType;
  phase: EngagementPhase;
  notes?: string;
  sourceIds: string[];
};

export type Phase = {
  summary: string;
  directionHints?: Direction[];
  sourceIds: string[];
};

export type Mechanics = Partial<Record<"kuzushi" | "tsukuri" | "kake", Phase>> & {
  directionSequences?: DirectionSequence[];
};

export type Technique = {
  slug: string;
  names: {
    english: string;
    japaneseRomaji: string;
    japanese?: string;
    kana: string;
    aliases: string[];
  };
  classifications: string[];
  domains: Array<"standing" | "ground">;
  roles: Array<"attack" | "counter" | "escape" | "transition">;
  gripContextSlugs?: string[];
  mechanicsTheme?: string;
  phases: Partial<Record<"kuzushi" | "tsukuri" | "kake", Phase>>;
  sourceIds: string[];
};

export type DirectionSequence = {
  stanceContext: StanceContext;
  toriSide: ToriSide;
  directions: Direction[];
};

export type TechniqueVariant = {
  slug: string;
  name: string;
  baseTechniqueSlug: string;
  modifiers: string[];
  actionFeatures: string[];
  gripContextSlugs?: string[];
  chirality?: {
    toriSide?: "right" | "left";
    turn?: "clockwise" | "counterClockwise";
    turnRelation?: "standard" | "reverse";
  };
  directionSequences: DirectionSequence[];
  mechanics?: Mechanics;
  sourceIds: string[];
};

export type Ruleset = {
  id: string;
  name: string;
  organization: string;
  effectiveFrom: string;
  ageLevel: string;
  default: boolean;
  sourceIds: string[];
};

export type RulesetLegality = {
  subjectSlug: string;
  subjectType: "technique" | "variant" | "action-feature";
  rulesetId: string;
  status: LegalityStatus;
  reasons: string[];
  appliesTo: LegalityAppliesTo;
  notes?: string;
  sourceIds: string[];
};

export type SafetyAdvisory = {
  subjectSlug: string;
  subjectType: "technique" | "variant" | "action-feature";
  level: SafetyLevel;
  context: SafetyContext[];
  reasons: string[];
  authority: SafetyAuthority;
  sourceIds: string[];
};

export type TechniqueVideo = {
  techniqueSlug: string;
  title: string;
  youtubeId: string;
  playlistId: string;
  sourceIds: string[];
};

export type ComboEdge = {
  fromSlug: string;
  toSlug: string;
  pattern: ComboPattern;
  firstPressureDirection?: Direction;
  expectedUkeReaction?: Direction;
  finishingDirection?: Direction;
  stanceContext?: StanceContext;
  toriSide?: ToriSide;
  timing: "immediate" | "reaction" | "transition" | "unknown";
  confidence: "official" | "common" | "coach-advisory" | "personal-note";
  notes?: string;
  sourceIds: string[];
};

export type ComboFilters = {
  legalOnly?: boolean;
  practiceSafeOnly?: boolean;
  pattern?: ComboPattern;
  stanceContext?: StanceContext;
  toriSide?: ToriSide;
  rulesetId?: string;
};
