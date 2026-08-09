# Invited learner materials and Atlas UX verification — 2026-08-10

## Implemented behaviour

- `data/materials.js` is the only configured source for Google Drive folder URLs.
- A course with no registry entry has `materialsUrl: null` and the detail panel renders no materials section.
- A configured course will render `Course materials`, the invited-learner explanation, and `View course materials ↗` with a safe new-tab link.
- Google Drive remains the access authority; this repository contains no Drive credential or material file.

## Automated checks

```text
npm test
npm run validate:data
node scripts/validate-shell.mjs
npm run validate:visual
git diff --check
```

The validation suite checks the optional material-registry shape, known course IDs, Google Drive folder URL format, invited-learner copy, safe external links, sticky header rules, non-overlapping filter rules, and public-file boundary.

## Browser checks

At 1880px wide, all nine district controls rendered as complete, readable chips with no overlap. After scrolling through the course map, the Atlas header remained pinned above the content.

At 390px wide, the compact header remained visible while scrolling the two-column map. District controls use a deliberate horizontal scroll row rather than fractional grid tracks.

## Remaining owner input

`MATERIAL_URLS` is intentionally empty until the owner supplies approved Google Drive **folder** URLs. A real configured-course click test cannot be completed without those URLs and the associated Google Drive sharing configuration.
