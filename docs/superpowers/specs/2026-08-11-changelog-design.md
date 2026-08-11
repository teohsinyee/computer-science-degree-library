# Learner-Facing Changelog Design

## Purpose

Add a public Changelog that lets returning learners see meaningful changes to
the course library since their last visit. It is a course-library update feed,
not a Git history or a personal study journal.

## Scope

- Add **Changelog** to the primary navigation without replacing **Journal**.
- Show a dedicated Changelog view at `#changelog`.
- Keep the GitHub Changelog reading pattern: newest first, month groups, date,
  change type, title, short explanation, tags, and filters.
- Link a course-related entry to its atlas course detail where one exists.
- Seed the view with real delivered milestones only:
  - Initial public course catalogue.
  - CSE442 Software Testing added.
  - CMT425 Enterprise Architecture and Systems added.
  - Data and Databases chapter, subtopic, and reference-book enrichment.

## Information Architecture

The site keeps three distinct destinations:

| Navigation item | Purpose |
| --- | --- |
| Atlas | Search and open courses. |
| Changelog | Read public learner-facing library updates. |
| Journal | Continue the current browser's private chapter progress. |

`Pathways` and `About` retain their current controls.

The Changelog is a page-level view, not a long section appended below the
Atlas. Selecting it makes the Changelog the active primary content and marks
the Changelog navigation item active. The browser URL is shareable through
`#changelog`.

## Data Model

Create `data/changelog.js` as the single source of truth. Each entry has:

- `date` in ISO `YYYY-MM-DD` format;
- `type`: `Release`, `Added`, `Improved`, `Corrected`, or `Retired`;
- learner-facing `title` and `summary`;
- optional `courseId` that must exist in `COURSES`;
- optional `category` that must exist in `CATEGORIES`.

Entries are sorted by date descending in the UI, then grouped by the month and
year represented by their date. The public data contains no local paths,
Google Drive links, material filenames, access lists, Git commits, or PR
numbers.

## User Interface

The Changelog follows the approved Knowledge City wireframe and uses GitHub
Changelog's familiar reading rhythm rather than its branding:

- A short heading and learner-facing introduction.
- Filter controls for change type and category, with an explicit all-updates
  state.
- A date-ordered list, grouped under month headings.
- Each row presents date, type, title, summary, and relevant tags in a stable
  scan order.
- A course tag is a link that opens the relevant atlas course detail.
- Empty filter results explain that no updates match and provide a clear way to
  reset filters.

The visual system keeps the existing off-white grid background, black
editorial headings, monospace metadata, coral active state, and category
accents. It must remain readable at narrow mobile widths, where rows may stack
but preserve date-before-content order.

## Behaviour and Accessibility

- Navigation and filters are keyboard-operable buttons/links with accurate
  active states.
- Filter changes update the visible list without a full page reload.
- The results summary is announced through a polite live region.
- A direct `#course/<id>` URL continues to open the Atlas and the requested
  course; `#changelog` opens the Changelog.
- Browser history responds correctly when users move between Atlas, Changelog,
  Journal, and course-detail hashes.

## Validation

- Add automated data validation for valid dates, supported change types,
  required copy, known course IDs, known categories, and the required four
  initial milestones.
- Extend catalogue behaviour tests for route selection, filtering, grouping,
  and course links.
- Run the existing shell, visual-contract, data, and test checks before review.

## Out of Scope

- A Git commit or pull-request feed.
- Publishing any course files or Google Drive access information.
- Editing Changelog entries from the public site.
- Replacing Journal or adding sign-in/sync.

## Decisions

- Use static structured data because GitHub Pages has no required backend for
  this learner-facing content.
- Keep Journal separate because it represents private browser progress, while
  Changelog is public and shared.
- Use the GitHub Changelog information hierarchy to reduce cognitive workload,
  then adapt it to the approved Knowledge City visual identity.
