# Invited learner materials and Atlas UX verification — 2026-08-10

## Implemented behaviour

- `data/materials.js` is the only configured source for Google Drive folder URLs.
- Thirty courses have verified direct Google Drive folder URLs. `ACCOUNTING`, `WCC110`, and `WUS101` have no discovered course folder and intentionally render no materials section.
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

## Google Drive sharing audit

The connected Google Drive audit checked the `bachelor_computer_science` root, 38 descendant folders, and 242 descendant files: 280 objects in total.

- `anyone` principals: 0
- `domain` principals: 0
- `allowFileDiscovery=true`: 0
- unreadable permission metadata: 0
- scan errors: 0

Every discovered course folder is `Restricted`; no organization-wide or anyone-with-link sharing was found. A public GitHub Pages course-folder URL therefore remains only a navigation entry point: Google Drive still denies material access to an account that has not been invited.
