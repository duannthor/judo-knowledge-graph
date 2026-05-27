# Technical Machine v1.0 Release Notes

## Overview
Technical Machine is a static-first judo technique browser for lookup, promotion study, competition legality, safety notes, and technique relationships. v1.0 is still a private prototype, but it now has enough structure to show coaches, collect corrections, and keep improving the graph without locking the project into a database too early.

## Who It's For
- **Judo students** preparing for belt promotions
- **Instructors** building lesson plans and technique references
- **Competitors** checking IJF Senior legality, variants, and cautions
- **Enthusiasts** exploring the taxonomy of judo movement

## Core Features

### Technique Catalog
- Technique records across throwing, grappling, counter, and escape families
- Kodokan-style family ordering with nearby counters and response techniques grouped in context
- Japanese names, kana, kanji, English names, and aliases for fast lookup
- Chiral notes for right-handed and left-handed tori where turn direction affects interpretation
- Modeled variants including drop entries, modified competition-legal forms, and reverse-turn seoi entries

### Rules, Safety, And Variants
- IJF Senior competition legality labeled as the default ruleset context
- Separate safety advisories so practice caution does not get flattened into competition legality
- Illegal, restricted, caution, and competition-legal tags with consistent color treatment
- Variant cards that show when a base technique contains both legal and restricted forms
- Safety notes for high-risk throws, spine-risk reversals, arm-risk seoi variants, standing chokes, standing locks, and non-elbow joint locks

### Search And Filters
- Search across English, romaji, kana, kanji, aliases, grips, roles, and contexts
- Slim family tabs for nage-waza and katame-waza instead of bulky family cards
- Quick presets for competition study, promotion study, combos, counters, groundwork, and opposite-side stance
- Multi-select role filters so a technique can be found as both an attack and a counter
- Grip and position contexts including kumi-kata, aiyotsu, kenkayotsu, mount, guard, side control, and north-south
- Content filters for video linked, video not linked, author edited, and pending review

### Technique Details And Relationships
- Kuzushi, tsukuri, and kake captured for every listed promotion technique through shodan
- Technique videos embedded where mapped, with graceful fallback sections when no video source exists yet
- Combination links separated from counters and defenses on technique detail pages
- Combo patterns for same-direction pressure, alternating-direction reaction, direct follow-up, and counter sequences
- Counters connected to their source techniques, including examples such as o-soto-gari to o-soto-gaeshi
- Escapes linked back to the pins, chokes, and locks they answer

### Promotion And Kata
- USJF Senior promotion ranks modeled through shodan
- Rank-colored promotion filters and a dedicated promotion requirements page
- Green belt fundamentals documented with English-speaker annotations
- Open-ended exam requirement prompts linked back to useful catalog filters
- Nage-no-kata guide with set breaks, etiquette notes, role matrix, right/left sequence notes, and Kodokan video reference

### Review And Integration
- Anonymous "Suggest a correction" form on technique pages, wired for Splitforms hosted submissions
- Hidden correction metadata for technique slug, technique name, and page URL
- Pending review and author-edited content status support for future coach review workflows
- Technical Machine styles scoped under a mini-app wrapper so the app can live inside a larger personal site
- App-specific header/navigation retained, with a main-site link for future hosting inside the broader website

### Modern UI/UX
- Light and dark modes with smooth theme transitions
- Responsive card layout tuned for study rather than marketing clutter
- Soft brush-style kanji display reconciled across technique and kata pages
- Audit cleanup for iframe loading and accessible filter controls
- GitHub Pages base URL support for prototype hosting

## What's Next
- Connect the hosted Splitforms access key and triage anonymous correction submissions
- Promote reviewed technique pages from pending review to author edited
- Add source timestamps and more complete video mapping
- Build dedicated breakout pages for each promotion rank
- Deepen combo examples with stance, side, and pressure-pattern filters
- Consider a graph export path for Neo4j or another local graph viewer
