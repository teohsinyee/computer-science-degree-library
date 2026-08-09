# Computer Science Degree Library

A public, map-inspired course atlas for revisiting a Computer Science degree.

## Purpose

This is a public course-learning platform, not a file mirror. It makes it easy to:

- find a course or concept quickly;
- see the chapters and properly cited key reference books for a course;
- continue unfinished revision from the next chapter, privately in the current browser; and
- explore hand-curated course connections without presenting them as official prerequisites.

It deliberately publishes no lecture notes, course planners, Drive links, or learner data. Reference shelves contain bibliographic information and external book-detail links only.

## Current direction

- Frontend: GitHub Pages.
- Progress: guest-first browser local storage; it does not leave the visitor's device.
- Course relationships: explicit, hand-curated learning connections with a visible reason.
- Visual direction: a light, map-inspired course explorer with colourful subject districts.
- Product identity: neutral course-learning platform; no personal name or university branding.

## Planned next

- Optional sign-in to sync a visitor's own revision progress across devices.
- Aggregated public learner counts, only after privacy and measurement rules are defined.
- A restricted Google Drive course-material entry point, only after the owner has added an approved link and confirmed the access boundary.

## Verify the public catalogue

```powershell
npm run validate:data
npm test
node scripts/validate-shell.mjs
npm run validate:visual
```

## Content inventory

The initial catalogue currently contains:

- 33 course folders across 8 categories;
- 29 course planners;
- 311 numbered chapter/lecture-note files; and
- 21 `R##`-prefixed reference files: 19 identifiable books that are publicly cited below, plus two restricted solution manuals that are not represented as public books.

### Public reference audit

| Course | Local reference IDs | Public treatment |
| --- | --- | --- |
| CPT212 | R01-R06 | Six identifiable books are cited. |
| CPT316 | R01-R03 | Three identifiable books are cited. |
| CSE241 | R12-R14, R17 | Four identifiable books are cited. R15-R16 are solution manuals and remain private. |
| CMT427 | R01, R03 | Two identifiable books are cited. |
| CPC251 | R04, R06 | Two identifiable books are cited. |
| CPC453 | R17 | One identifiable book is cited. |
| AKP302 | R01 | One identifiable book is cited. |

## Project record

- [Project start record](docs/process/2026-08-09-project-start.md)
- [Working product design](docs/design/2026-08-09-course-learning-platform.md)
- [Architecture decision](docs/decisions/0001-platform-architecture.md)
- [Public catalogue boundary](docs/decisions/0002-public-catalogue-boundary.md)
- [Backlog](docs/backlog.md)

## Boundaries

- Do not commit course files, reference books, or Google Drive credentials.
- Do not copy materials from Google Drive into this repository.
- Do not expose a learner's progress or identity publicly.
- Do not render a Google Drive course-material link until its permission model and public copy have been reviewed.
