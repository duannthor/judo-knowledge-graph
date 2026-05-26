Yes. Nothing scary, but there are a few “prototype grew into product” seams showing.

Biggest concerns:

1. **Page files are getting heavy**
   - `src/pages/index.astro`: ~1023 lines
   - `src/pages/techniques/[slug].astro`: ~635 lines
   - `src/styles/global.css`: ~1663 lines

   This is normal for a fast prototype, but the next pain point will be editing one thing and accidentally disturbing three unrelated UI areas.

2. **Repeated base URL helper**
   `urlFor` is duplicated in `BaseLayout`, catalog, technique detail, promotion, kata, release notes. I’d extract this into a tiny shared utility before more pages appear.

3. **Shared UI should become components**
   Good candidates:
   - `ToriSideSwitch`
   - `TechniqueCard`
   - `FilterPill`
   - `VideoEmbed`
   - `PageIntro`
   - `RankBadge`
   - `TechniqueLinkRow`

   This would reduce duplication and make audit fixes less whack-a-mole-y.

4. **Catalog filter logic is now substantial**
   The main page has a real client-side filtering app embedded inline. It works, but it is now complex enough to deserve extraction into `src/scripts/catalogFilters.js` or an Astro component script.

5. **CSS is becoming a global grab bag**
   `global.css` is still manageable, but it mixes layout, theme, components, cards, kata, promotion, detail pages, filters, and utilities. I’d split eventually into:
   - `global.css`
   - `theme.css`
   - `components.css`
   - `catalog.css`
   - `detail.css`
   - `promotion.css`

6. **Data provenance is the real long-term risk**
   A lot is tagged `local-practice-advisory-v1`. That’s honest, which is good, but before presenting this as authoritative you’ll want clearer source tiers:
   - Kodokan official
   - IJF rule
   - USJF promotion
   - coach advisory
   - personal note / prototype

7. **Validation should keep growing**
   `scripts/validate.mjs` is a good start. Next valuable checks:
   - Every `sourceId` exists.
   - Every variant `baseTechniqueSlug` exists.
   - Every combo edge endpoint exists.
   - Every video `subjectSlug` exists.
   - Every promotion technique slug exists.
   - No duplicate slugs across techniques/variants.

My suggested next cleanup order:

1. Extract shared `urlFor`.
2. Extract `ToriSideSwitch` and filter pill/toggle markup.
3. Add stronger graph validation.
4. Split `global.css` after components stabilize.

I would not rush a full refactor yet. The app is still changing shape, but those four steps would make it feel a lot less “held together by brave Astro pages.”