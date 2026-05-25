# Judo Knowledge Graph

Static-first knowledge graph data for judo techniques, variants, competition legality, practice safety, and combo pressure patterns.

The canonical source of truth is JSON under `data/`. The TypeScript-facing contract lives in `src/types.ts`, and the lightweight runtime query helpers live in `src/query.mjs`.

## Commands

```sh
npm test
npm run validate
```

## v1 Defaults

- Ruleset: `IJF_SENIOR_2026`
- Legality and safety are separate assertions.
- Variants carry rule-sensitive action details, such as leg grabs or standing chokes.
- Combos distinguish same-direction pressure from alternating-direction reaction.
