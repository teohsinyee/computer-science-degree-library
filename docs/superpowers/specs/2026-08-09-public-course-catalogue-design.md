# Public Course Catalogue Design

**Issue:** #1
**Status:** Ready for review

## Goal

Publish a fast, public course catalogue that helps a visitor find a course, understand its high-level learning topics, and identify its main reference books. It must not expose course files or act as a university catalogue.

## Chosen approach

Use plain HTML, CSS, and browser JavaScript with no framework, build step, server, or Rust component. GitHub Pages can serve the files directly. This is the smallest architecture that supports the approved interface and keeps future Firebase work isolated to Issue #3.

## Public data model

Keep all public course metadata in one JavaScript module. One course has:

```js
{
  id: "CSE241",
  title: "Software Engineering",
  category: "Software Engineering",
  summary: "Introduces core software-engineering practices.",
  topics: ["Requirements", "Design", "Testing"],
  chapters: [{ id: "01", title: "Introduction" }],
  references: [
    {
      id: "R01",
      authors: ["Ian Sommerville"],
      title: "Software Engineering",
      edition: "10th ed.",
      year: 2016,
      bookUrl: "https://www.pearson.com/en-us/subject-catalog/p/software-engineering/P200000003258"
    }
  ],
  materialsUrl: null
}
```

`materialsUrl` remains `null` in this Issue. `references` entries require a non-empty `id`, `authors`, `title`, and HTTPS `bookUrl`; `edition` and `year` are optional. `bookUrl` first uses a publisher's product page that lets a visitor learn about or buy the book. When that is unavailable, it uses a reputable retailer's page for that exact edition. Course data must be curated from the organised collection; it must never contain raw filenames, Drive credentials, course files, scans, slides, planner contents, or textbook PDFs.

## Page structure and navigation

- `index.html` provides the static document shell.
- One CSS file provides the approved light map-inspired visual system and responsive layout.
- One JavaScript entry point renders the catalogue, search, category filter, course cards, and course detail view from the data module.
- The URL hash identifies an open course, for example `#course/CSE241`, so a course can be linked and the browser back button works without a routing library.
- On desktop, selecting a card opens the course detail panel. On small screens, the same selection becomes a full-width view.

## Required behaviour

- Search matches course code, title, category, summary, and topics without case sensitivity.
- Category filters use the eight existing subject categories.
- A course card and its detail view show the code as secondary metadata and the title as the primary label.
- A course detail view shows the summary, ordered chapters, and formatted references: `R01 · Ian Sommerville — Software Engineering (10th ed., 2016)`.
- Every reference has a visible `Find this book ↗` link that opens its `bookUrl` in a new tab. Links use no affiliate or tracking parameters and include safe external-link attributes.
- When no search or filter result exists, show an explicit empty state.
- The material button is omitted while `materialsUrl` is absent; it is not a disabled or broken link.
- Use semantic controls, visible focus styles, keyboard-operable search and filters, and a readable small-screen layout.

## Explicitly excluded from Issue #1

- Saving chapter progress.
- Google sign-in, Firebase, public learner counts, and analytics.
- Drive links, access requests, or material permissions.
- Course relationships and relationship visualisation.

## Validation

- A small Node-based data-validation script checks that every public course has a unique id, title, category, summary, at least one topic, and correctly shaped reference entries with HTTPS book URLs.
- Manual browser checks cover code/title/topic search, each category filter, hash navigation, empty state, keyboard navigation, and a narrow mobile viewport.
- Repository checks confirm that no restricted files, Drive URLs, credentials, or local Windows paths enter the public source.

## File boundaries

```text
index.html                 Static page shell
assets/styles.css          All visual and responsive styles
assets/app.js              Rendering, search, filtering, and hash navigation
data/courses.js            Curated public course metadata only
scripts/validate-data.mjs  Catalogue data validation
```

No package manager or third-party dependency is required for this Issue.
