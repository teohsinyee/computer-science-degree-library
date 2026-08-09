# Public Course Catalogue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the public, searchable course catalogue described in Issue #1 without exposing restricted course materials.

**Architecture:** A static ES-module site renders curated public course metadata in the browser. Pure catalogue functions provide search, filtering, hash navigation, and reference formatting; a small Node validation layer protects the public data boundary. GitHub Pages serves the files without a framework, build step, server, or Rust component.

**Tech Stack:** HTML, CSS, browser JavaScript ES modules, Node.js v24 built-ins (`node:assert/strict`, `node:fs`, `node:url`), GitHub Pages.

## Global Constraints

- Keep the course title primary and the course code secondary; present the site as a personal historical course library, not an official university catalogue.
- Include exactly the 33 organised courses across the existing eight categories.
- Publish only curated course metadata, high-level topics or chapter titles, citations, and non-affiliate HTTPS book links.
- Never commit source folder paths, raw filenames, course files, slides, scans, planner contents, Drive URLs, credentials, textbook PDFs, or direct downloads.
- Every reference requires an author, title, and HTTPS `bookUrl`; use a publisher product page first, then a reputable retailer page for the exact edition.
- Use no third-party runtime or build dependency. `package.json` exists only to mark local `.js` files as ES modules and provide Node check commands.
- Do not add progress, Firebase, learner counts, Drive links, or relationship logic in this Issue.

---

## File structure

| File | Responsibility |
| --- | --- |
| `package.json` | Native Node commands and ES-module mode; no dependencies. |
| `data/courses.js` | The complete, curated public course catalogue and category order. |
| `assets/catalogue.js` | Pure search, filter, hash, and citation-formatting functions. |
| `assets/app.js` | DOM rendering and interaction wiring only. |
| `assets/styles.css` | Approved light map-inspired visual system and responsive layout. |
| `index.html` | Accessible static document shell. |
| `scripts/validate-data.mjs` | Validates all public catalogue data and prohibited content. |
| `scripts/test-catalogue.mjs` | Unit checks for pure catalogue behavior. |

## Task 1: Establish the curated catalogue contract

**Files:**
- Create: `package.json`
- Create: `data/courses.js`
- Create: `scripts/validate-data.mjs`
- Test: `scripts/validate-data.mjs`

**Interfaces:**
- Produces `CATEGORIES` as the eight display labels, in their existing order.
- Produces `COURSES` as `ReadonlyArray<Course>`, where `Course` has `id`, `title`, `category`, `summary`, `topics`, `chapters`, `references`, and `materialsUrl: null`.
- Each `Reference` has `id`, `authors`, `title`, optional `edition`, optional `year`, and `bookUrl`.

- [ ] **Step 1: Create the failing catalogue validator**

Write `scripts/validate-data.mjs` so it imports `CATEGORIES` and `COURSES`, asserts that 33 courses exist, and fails while `data/courses.js` is absent.

```js
import assert from "node:assert/strict";
import { CATEGORIES, COURSES } from "../data/courses.js";

assert.equal(CATEGORIES.length, 8, "Expected eight categories");
assert.equal(COURSES.length, 33, "Expected 33 public courses");
```

- [ ] **Step 2: Run the validator and confirm the red state**

Run: `node scripts/validate-data.mjs`

Expected: failure because `data/courses.js` does not exist.

- [ ] **Step 3: Add native module configuration and the public catalogue**

Create `package.json` with no dependencies:

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "validate:data": "node scripts/validate-data.mjs",
    "test": "node scripts/test-catalogue.mjs"
  }
}
```

Create `data/courses.js` with the eight categories and one public object for each of these exact course ids. Derive public titles, summaries, topics, ordered chapter titles, and reference metadata from the organised collection; do not copy source filenames or file contents.

```js
export const REQUIRED_COURSE_IDS = [
  "CPT113", "CPT212", "CPT316",
  "CAT201", "CAT304", "CPT341", "CSE241", "CSE441",
  "CMT221", "CMT321", "CMT427", "CPC351", "CPC451",
  "CPC151", "CPC251", "CPC353", "CPC453",
  "CST232", "CST235",
  "CPT115", "CPT411",
  "ACCOUNTING", "AKP201", "AKP202", "AKP302", "AKW103", "CAT402",
  "HFF225", "LHP456", "LSP404", "WCC110", "WSU101", "WUS101"
];
```

Use this object shape for every course:

```js
{
  id: "CSE241",
  title: "Foundations of Software Engineering",
  category: "Software Engineering",
  summary: "Introduces core software-engineering practices.",
  topics: ["Requirements", "Design", "Testing"],
  chapters: [{ id: "01", title: "Introduction" }],
  references: [{
    id: "R01",
    authors: ["Ian Sommerville"],
    title: "Software Engineering",
    edition: "10th ed.",
    year: 2016,
    bookUrl: "https://www.pearson.com/en-us/subject-catalog/p/software-engineering/P200000003258"
  }],
  materialsUrl: null
}
```

- [ ] **Step 4: Complete data validation**

Extend `scripts/validate-data.mjs` to assert all of the following:

```js
const ids = new Set();
for (const course of COURSES) {
  assert.match(course.id, /^(?:[A-Z]+\d+|ACCOUNTING)$/);
  assert.ok(!ids.has(course.id), `Duplicate course id: ${course.id}`);
  ids.add(course.id);
  assert.ok(CATEGORIES.includes(course.category));
  assert.ok(course.title.trim() && course.summary.trim());
  assert.ok(course.topics.length > 0 && course.chapters.length > 0);
  assert.equal(course.materialsUrl, null);
  for (const reference of course.references) {
    assert.ok(reference.id && reference.title && reference.authors.length);
    assert.equal(new URL(reference.bookUrl).protocol, "https:");
    assert.ok(!/[?&](utm_|ref=|tag=)/i.test(reference.bookUrl));
  }
}
assert.deepEqual([...ids].sort(), [...REQUIRED_COURSE_IDS].sort());
```

Read the serialised `COURSES` value in the same validator and fail if it contains a Windows path, `drive.google.com`, `.pdf`, or the phrase `lecture notes`.

- [ ] **Step 5: Run the green data check**

Run: `npm run validate:data`

Expected: exit code 0 after all 33 curated course records pass validation.

- [ ] **Step 6: Commit the catalogue contract**

```powershell
git add package.json data/courses.js scripts/validate-data.mjs
git commit -m "feat: add public course catalogue data" -m "Co-authored-by: Codex <codex@openai.com>"
```

## Task 2: Build the accessible static shell and visual system

**Files:**
- Create: `index.html`
- Create: `assets/styles.css`
- Test: `scripts/validate-shell.mjs`

**Interfaces:**
- `index.html` exposes `#course-search`, `#category-filters`, `#result-summary`, `#course-grid`, and `#course-detail` for `assets/app.js`.
- `#course-detail` is an `aside` with an accessible name and is initially empty.

- [ ] **Step 1: Write the failing shell check**

Create `scripts/validate-shell.mjs` with checks for the required semantic elements and DOM ids.

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
for (const fragment of [
  '<input id="course-search"',
  'id="category-filters"',
  'id="result-summary"',
  'id="course-grid"',
  '<aside id="course-detail"'
]) assert.ok(html.includes(fragment), `Missing ${fragment}`);
```

- [ ] **Step 2: Run the shell check and confirm the red state**

Run: `node scripts/validate-shell.mjs`

Expected: failure because `index.html` does not exist.

- [ ] **Step 3: Create the HTML shell and CSS**

Build `index.html` with a `header`, a labeled search input, a category-filter `nav`, a live result summary, a `main` course-card grid, and an `aside` detail region. Load `assets/styles.css` and `assets/app.js` with `type="module"`.

Create `assets/styles.css` with the approved warm-white background, dark editorial typography, colourful category districts, visible focus rings, and these responsive rules:

```css
@media (min-width: 900px) {
  .catalogue-layout { grid-template-columns: minmax(0, 1fr) minmax(20rem, 28rem); }
}

@media (max-width: 899px) {
  .catalogue-layout { display: block; }
  #course-detail[data-open="true"] { position: fixed; inset: 0; overflow: auto; }
}
```

Use real text from the approved mockup: `Find a course. Continue learning.` Do not add a product name, a material button, learner counts, or progress controls.

- [ ] **Step 4: Run the shell check and inspect the static page**

Run: `node scripts/validate-shell.mjs`

Expected: exit code 0.

Start a local static server:

```powershell
Start-Process python -ArgumentList '-m','http.server','4173','--directory','.' -WorkingDirectory . -WindowStyle Hidden
```

Open `http://localhost:4173` and confirm that the search label, empty card grid, filter region, and detail region are keyboard reachable at desktop and narrow mobile widths.

- [ ] **Step 5: Commit the static shell**

```powershell
git add index.html assets/styles.css scripts/validate-shell.mjs
git commit -m "feat: add course catalogue shell" -m "Co-authored-by: Codex <codex@openai.com>"
```

## Task 3: Implement catalogue behavior and course rendering

**Files:**
- Create: `assets/catalogue.js`
- Create: `assets/app.js`
- Create: `scripts/test-catalogue.mjs`
- Modify: `scripts/validate-shell.mjs`
- Test: `scripts/test-catalogue.mjs`

**Interfaces:**
- `normalise(value: string): string` returns lower-cased, trimmed search text.
- `filterCourses(courses, query, category): Course[]` searches `id`, `title`, `category`, `summary`, and `topics`.
- `getCourseIdFromHash(hash: string): string | null` parses `#course/<id>`.
- `formatReference(reference): string` formats `R01 · Author — Title (edition, year)` without empty punctuation.
- `assets/app.js` imports these functions and `COURSES`, but does not contain course data.

- [ ] **Step 1: Write the failing pure-function tests**

Create `scripts/test-catalogue.mjs` using Node assertions.

```js
import assert from "node:assert/strict";
import {
  filterCourses,
  formatReference,
  getCourseIdFromHash
} from "../assets/catalogue.js";

const courses = [{
  id: "CSE241", title: "Foundations of Software Engineering",
  category: "Software Engineering", summary: "Engineering practice",
  topics: ["Requirements"], chapters: [], references: [], materialsUrl: null
}];

assert.equal(filterCourses(courses, "requirements", "All").length, 1);
assert.equal(filterCourses(courses, "", "Software Engineering").length, 1);
assert.equal(getCourseIdFromHash("#course/CSE241"), "CSE241");
assert.equal(getCourseIdFromHash("#filters"), null);
assert.equal(
  formatReference({ id: "R01", authors: ["Ian Sommerville"], title: "Software Engineering", edition: "10th ed.", year: 2016 }),
  "R01 · Ian Sommerville — Software Engineering (10th ed., 2016)"
);
```

- [ ] **Step 2: Run the tests and confirm the red state**

Run: `npm test`

Expected: failure because `assets/catalogue.js` does not exist.

- [ ] **Step 3: Implement the pure catalogue functions**

Create `assets/catalogue.js`. Keep matching case-insensitive and make category `All` bypass category filtering.

```js
export function getCourseIdFromHash(hash) {
  const match = /^#course\/([A-Z]+\d+|ACCOUNTING)$/.exec(hash);
  return match?.[1] ?? null;
}

export function formatReference(reference) {
  const details = [reference.edition, reference.year].filter(Boolean).join(", ");
  return `${reference.id} · ${reference.authors.join(", ")} — ${reference.title}${details ? ` (${details})` : ""}`;
}
```

- [ ] **Step 4: Implement DOM rendering and interactions**

Create `assets/app.js` that:

1. renders all category buttons from `CATEGORIES` plus `All`;
2. re-renders cards when `#course-search` changes or a category button is selected;
3. changes `window.location.hash` to `#course/<id>` when a card is selected;
4. renders the selected course in `#course-detail` on `hashchange` and initial load;
5. renders each book link as `<a target="_blank" rel="noopener noreferrer">Find this book ↗</a>`;
6. omits all material-link markup because every `materialsUrl` is `null`;
7. reports `No courses match this search.` in `#result-summary` when filtering yields zero courses.

Use `textContent` for course and reference text. Do not use `innerHTML` for metadata values.

- [ ] **Step 5: Run automated checks and the browser smoke test**

Run:

```powershell
npm run validate:data
npm test
node scripts/validate-shell.mjs
```

Expected: all commands exit 0.

In the already running local site, verify:

- searching `CSE241`, a full title, and a topic each finds the intended course;
- every category filter yields only that category;
- `#course/CSE241` opens that course and browser Back restores the prior state;
- a missing search produces the explicit empty state;
- every `Find this book ↗` link opens a non-affiliate HTTPS publisher or retailer page in a new tab;
- keyboard focus is visible across search, filters, cards, close/back control, and reference links;
- no course page contains material buttons or restricted content.

- [ ] **Step 6: Commit interactive catalogue behavior**

```powershell
git add assets/catalogue.js assets/app.js scripts/test-catalogue.mjs scripts/validate-shell.mjs
git commit -m "feat: add searchable course catalogue" -m "Co-authored-by: Codex <codex@openai.com>"
```

## Task 4: Final public-boundary audit and Issue evidence

**Files:**
- Modify: `README.md`
- Test: repository and browser checks

**Interfaces:**
- README links to the live catalogue only after deployment in Issue #4; this task adds no deployment URL.

- [ ] **Step 1: Add local verification instructions to README**

Add a `## Verify the public catalogue` section under the project direction with these three commands in a PowerShell code block:

```powershell
npm run validate:data
npm test
node scripts/validate-shell.mjs
```

- [ ] **Step 2: Run the public-boundary scan**

Run:

```powershell
rg -n -i 'C:\\Users|drive\.google\.com|\.pdf|lecture notes|api[_-]?key|secret' README.md index.html assets data
```

Expected: no matches. If the scanner reports a harmless documentation phrase, remove the phrase rather than adding an exception.

- [ ] **Step 3: Re-run all checks and visual verification**

Run:

```powershell
npm run validate:data
npm test
node scripts/validate-shell.mjs
git diff --check
git status --short
```

Expected: the three validation commands exit 0; `git diff --check` has no output; `git status --short` lists only intended files before staging.

Repeat the Task 3 browser smoke test at desktop width and a narrow mobile viewport.

- [ ] **Step 4: Commit and update Issue #1**

```powershell
git add README.md
git commit -m "docs: add catalogue verification" -m "Co-authored-by: Codex <codex@openai.com>"
git push origin main
```

Comment on Issue #1 with the commit links, the three command results, and the browser checks performed. Leave the Issue open until GitHub Pages deployment is completed in Issue #4.

## Plan self-review

- Spec coverage: Tasks 1–3 cover the data model, public boundary, visual shell, search, filters, hash navigation, citation links, empty state, and accessibility. Task 4 covers the required repository audit and evidence.
- Scope: Guest progress, Firebase, learner counts, Drive links, and course relationships remain out of scope.
- Type consistency: `Course`, `Reference`, `CATEGORIES`, `COURSES`, and the pure-function names are defined before later tasks consume them.
- No placeholders: The source course ids, commands, files, acceptance checks, and commit messages are explicit.
