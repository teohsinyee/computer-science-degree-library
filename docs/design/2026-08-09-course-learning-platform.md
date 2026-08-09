# Working product design

**Status:** Draft. Visual direction and technical direction are confirmed; implementation starts only after this design is reviewed.

## Product shape

The platform is a neutral, public course-learning library. It should help a visitor locate a course quickly and help a learner resume revision without reopening a local folder tree.

The interface uses a bright editorial map language: warm white background, fine map/grid texture, dark typography, and colour-coded subject districts. It must feel contemporary rather than like an institutional course catalogue.

The editable visual exploration is in [Figma](https://www.figma.com/design/u7rAMXSB9IcbFpzNocTm8Y). It currently includes desktop Explore and Course views.

## Explore experience

- Search by course code, course name, or topic.
- Filter by the existing eight course categories.
- Browse clear course cards containing a course code, name, category, and progress state when available.
- Use a selected-card detail panel on desktop; use a full course view on small screens.

## Course experience

Each course view includes:

1. Course code, title, category, and a short description. The title is the primary label; the code is a smaller historical navigation label, not an official university listing.
2. `View All Course Materials ↗`, which opens the course's single Google Drive folder.
3. Public learner interest, written as `1,284 learners explored this course`.
4. Ordered chapters generated from the numbered course notes.
5. A checkbox for each chapter, a progress summary, and a continue-learning action.
6. A separate, properly cited list of `R##` reference books for deeper study. Each entry shows author, book title, edition, and year where known; for example, `R01 · Ian Sommerville — Software Engineering (10th ed., 2016)`.

## Learning state

1. A visitor can check chapters immediately; the state is stored in the current browser.
2. When useful, the visitor is invited to sign in with Google to sync across devices.
3. On the first sign-in, locally completed chapters merge into the private cloud record.
4. A learner's progress is private and never appears in public counts or public profiles.

## Public learner counts

Course pages show a human-readable count of anonymous learners who explored the course. The count is intended to avoid refresh inflation, but is inherently approximate because anonymous browser identifiers can be cleared or reset.

## Data boundaries

The public catalogue contains course codes and titles, high-level course structure, curated topic or chapter titles, properly cited reference books, categories, and Drive folder URLs. It contains no course files, raw lecture-note filenames, scanned pages, slides, textbooks, or planner contents. Google Drive remains the sole authority for material access.

The catalogue must label itself as a personal historical course library, not an official university catalogue. It must not use university branding or imply institutional endorsement.

## Deferred work

Course relationship definitions and an interactive relationship map are deliberately deferred. The catalogue data should leave room for relationships later, but the first release must not invent or imply prerequisite links.

## Failure behaviour

- Missing Drive URL: show that materials are not available yet; do not show a broken button.
- Drive permission denied: Google Drive explains the restriction.
- Offline or failed sync: preserve browser progress and show that cloud sync is pending.
- Public-count failure: hide the count rather than showing a false value.

## Acceptance checks before release

- Search finds a course by code, title, and relevant topic.
- Category filtering works on desktop and mobile.
- Guest progress survives a refresh in the same browser.
- Google sign-in merges guest progress without losing completed chapters.
- One learner cannot read or update another learner's progress.
- Reference books and chapters are rendered in their existing numbered order.
- Every public reference-book entry shows at least author and title; edition and year appear when known.
- Missing or restricted Drive folders fail clearly and safely.
