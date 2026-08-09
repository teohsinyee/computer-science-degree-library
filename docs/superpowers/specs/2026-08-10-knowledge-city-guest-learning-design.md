# Knowledge City Atlas and Guest Learning Design

**Status:** Approved for planning on 2026-08-10

## Goal

Replace the current generic course catalogue shell with the approved Knowledge City experience: a bright, white, map-inspired public course atlas where a visitor can discover courses and their relationships, inspect properly cited reference books, and privately track chapter revision in the current browser.

This design treats the approved Figma exploration and the agreed product decisions as acceptance criteria. It is not an institutional course catalogue or a public mirror of the owner's files.

## Release boundary

This release includes:

- the responsive Knowledge City Atlas visual system and course-detail experience;
- course discovery by code, course title, category, summary, and topics;
- a curated, explicitly non-prerequisite course-connection map;
- properly cited reference books with exact external book links; and
- guest-first chapter progress stored privately in the browser, including a Journal view that helps a learner resume revision.

This release does not include Google sign-in, cloud synchronization, public learner counts, Firebase, analytics, or Google Drive material links. Those features must use the same course and progress identities when they are added later.

## Public-data boundary

The public data may contain course code, title, category, summary, high-level topics, ordered chapter titles, relationship metadata, and bibliographic reference entries. It must not contain course files, raw note filenames, Drive URLs, credentials, planner contents, scans, slides, textbook PDFs, or a learner's progress.

The site identifies itself as a personal historical course library. Course codes are secondary historic labels; course titles are the primary label. Course relationships are labelled **Related learning connections** and must never claim to be official prerequisite rules.

## Visual thesis

Warm white paper, fine contour-grid texture, crisp dark editorial typography, and a small number of saturated district colours make the catalogue feel like an explorable city rather than a school portal. The first viewport is a map poster: big title at left, a city sketch and connection network at right, and the course districts below.

## Information architecture

### Header

- `KNOWLEDGE CITY` is the product identity.
- `A digital course atlas for Computer Science` is its short descriptor.
- `Atlas` selects the course-map view.
- `Journal` scrolls to the learner's saved revision state.
- `Pathways` enables relationship-focused browsing.
- `About` opens a concise statement of the personal-library and material-access boundary.
- Search remains prominent and keyboard reachable.

### Atlas

- Search matches course code, title, category, summary, and topics without case sensitivity.
- Eight colour-coded districts filter the map. Every filter button retains keyboard focus after the result rerenders.
- Course blocks form the city. A block shows a coloured district marker, secondary code, and primary course title.
- Selecting a course opens the detail panel on desktop. On small screens, it opens a full-viewport dialog with focus containment, Escape close, and sensible focus restoration.
- A query or selected course is represented in the URL hash where possible, so a course can be shared or reopened.

### Pathways

- The map can reveal a small, curated set of dotted connection lines and connection points.
- Each connection is an explicit data record with a short human-readable reason, such as a shared concept or a complementary learning area.
- Connections are discoverable without relying only on colour or line position: the selected course panel contains a labelled list of related courses and the reason for each connection.
- No relationship is rendered until it exists in the curated connection data. The interface must not infer or present prerequisites from proximity, code order, or category.

### Course detail

The detail view contains:

1. A small district marker, secondary code, and primary course title.
2. A concise high-level summary and topics.
3. Honest derived metadata: chapter count, reference-book count, and this browser's chapter progress. It must not invent credits, semester, level, or learner count.
4. A `Related learning connections` section when curated relationships exist.
5. Ordered chapters, each with a guest progress checkbox.
6. A reference shelf where every entry reads in the form `R01 · Author — Title (edition, year)` and offers `Find this book ↗` to an exact publisher or reputable retailer page.
7. No Drive or material action while no safe restricted-folder link has been explicitly configured.

### Journal

- The Journal derives its content only from local guest progress.
- It lists courses with at least one completed chapter but unfinished revision, ordered by most recently changed progress.
- It shows completed chapter count and a `Continue` action that reopens the course detail at its next unfinished chapter.
- If nothing has been marked complete, it gives a short empty-state invitation to begin from Atlas.

## Guest-progress model

- Store progress under one versioned localStorage key, such as `knowledge-city.guest-progress.v1`.
- The record is keyed by course ID and chapter ID, and stores only completion state plus a local update time for Journal ordering.
- Toggling a chapter updates the visible course progress and Journal immediately.
- Invalid, unavailable, or corrupt browser storage never removes a visible checkbox or breaks browsing. The site operates for the current page session and explains that saving is unavailable when it cannot persist.
- Progress is private to the browser and is never rendered into public course data, URL parameters, learner counts, or analytics.
- A later sign-in flow will read this record, merge completed chapter IDs with the private cloud record, and preserve local completion before clearing or superseding it.

## Responsive and accessibility requirements

- Desktop follows the approved composition: editorial header, oversized atlas title, map visual, coloured districts, city blocks, and fixed-in-layout right detail panel.
- At narrow widths, header navigation wraps cleanly, district controls remain operable, city blocks become a readable list/grid, and the detail view becomes a true viewport dialog with no inherited margin showing page content behind it.
- The atlas remains usable by keyboard and screen reader: labelled search, semantic filter controls, result live region, visible focus states, a named detail region or dialog, explicit card names with separators, and focus restoration after closing the detail.
- Visual map texture, colours, and connection lines are decorative supplements. Text, controls, and relationship lists carry all essential meaning.

## Implementation shape

Continue using static HTML, CSS, and browser JavaScript so GitHub Pages can host the site without a build server. Keep public course data, relationship data, progress persistence, rendering, and small pure query helpers separate so they can be tested with Node's built-in tooling.

- `data/courses.js`: public course and reference metadata only.
- `data/connections.js`: curated relationships only, with labels and reasons.
- `assets/catalogue.js`: pure search, filtering, formatting, relationship lookup, and progress-derived helpers.
- `assets/progress.js`: local guest-progress load, validation, update, and resume helpers.
- `assets/app.js`: DOM rendering, URL state, keyboard behaviour, and browser-local persistence wiring.
- `assets/styles.css`: map visual system, responsive layouts, detail panel/dialog, and motion reduced for users who prefer less movement.

## Acceptance checks

- The desktop browser view is recognisably the approved white Knowledge City composition, not a generic list of native controls.
- Search finds courses by code, title, category, summary, and topic; Enter does not submit or clear a query.
- Filters preserve focus and update result text and the visible course map.
- A selected course can be opened by click, keyboard, and direct hash link; closing direct mobile links restores focus to a logical page control.
- Pathways exposes only curated, labelled related-learning connections and does not claim prerequisites.
- A chapter checked in guest mode remains checked after refresh in the same browser; Journal shows the next unfinished chapter for an in-progress course.
- Every public reference has author, title, and a safe exact HTTPS book link; edition and year appear when known.
- No Drive URL, material file, raw note filename, credential, planner content, learner identity, or guest progress record appears in public source or generated page content.
- Narrow viewport and keyboard checks verify focus trapping, Escape close, no background-modal bleed, and readable course details.

