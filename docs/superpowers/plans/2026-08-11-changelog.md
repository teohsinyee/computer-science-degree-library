# Learner-Facing Changelog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Build a public, filterable Changelog that records learner-facing course-library updates in a GitHub Changelog-style reading structure.

**Architecture:** Static Changelog entries live in data/changelog.js and are validated without a backend. Pure helpers in assets/changelog.js select, sort, group, and filter entries; assets/app.js renders the #changelog view and controls hash navigation. Existing Atlas and private Journal behaviour remain intact.

**Tech Stack:** HTML, CSS, browser-native ES modules, Node.js assertion scripts, GitHub Pages.

## Global Constraints

- Keep Journal as the private browser-progress destination; add, do not replace, Changelog.
- Use #changelog for the shareable Changelog view and preserve #course/<id> course links.
- Use learner-facing copy only. Never expose local paths, material filenames, Drive URLs, permissions, commits, or PR numbers.
- Entries use only Release, Added, Improved, Corrected, or Retired types.
- Retain the Knowledge City off-white grid, editorial heading, monospace metadata, coral active state, and category accents.
- Keep the existing no-dependency static GitHub Pages architecture.

---

## File Structure

| File | Responsibility |
| --- | --- |
| data/changelog.js | Immutable learner-facing historical entries and supported types. |
| assets/changelog.js | Pure valid-hash, filtering, sorting, and monthly grouping helpers. |
| assets/app.js | Route selection, navigation active state, filter controls, and DOM rendering. |
| index.html | Changelog navigation and named page region. |
| assets/styles.css | Changelog list/filter layout and responsive presentation. |
| scripts/test-changelog.mjs | Pure Changelog data/helper assertions. |
| scripts/validate-data.mjs | Public-data safety and milestone validation. |
| scripts/validate-shell.mjs | Semantic HTML and runtime accessibility contracts. |
| scripts/validate-visual-contract.mjs | Visual contracts for Changelog and sticky-header anchors. |
| package.json | Adds Changelog test to the existing test script. |

### Task 1: Changelog data and pure selection helpers

**Files:**
- Create: data/changelog.js
- Create: assets/changelog.js
- Create: scripts/test-changelog.mjs
- Modify: package.json
- Modify: scripts/validate-data.mjs

**Interfaces:**
- Consumes: CATEGORIES and COURSES from data/courses.js.
- Produces: CHANGE_TYPES, CHANGELOG_ENTRIES, isChangelogHash(hash), filterChangelogEntries(entries, type, category), and groupEntriesByMonth(entries).
- Invariant: groupEntriesByMonth returns descending groups shaped as { key, label, entries }; each group is date-descending.

- [ ] **Step 1: Write the failing test**

Create scripts/test-changelog.mjs:

~~~js
import assert from "node:assert/strict";
import { CHANGELOG_ENTRIES } from "../data/changelog.js";
import { filterChangelogEntries, groupEntriesByMonth, isChangelogHash } from "../assets/changelog.js";

assert.equal(isChangelogHash("#changelog"), true);
assert.equal(isChangelogHash("#course/CSE442"), false);
assert.deepEqual(
  filterChangelogEntries(CHANGELOG_ENTRIES, "Added", "All").map(({ courseId }) => courseId),
  ["CMT425", "CSE442"]
);
assert.deepEqual(groupEntriesByMonth(CHANGELOG_ENTRIES).map(({ key }) => key), ["2026-08"]);
assert.deepEqual(
  groupEntriesByMonth(CHANGELOG_ENTRIES)[0].entries.map(({ date }) => date),
  ["2026-08-11", "2026-08-10", "2026-08-10", "2026-08-10"]
);
~~~

Modify package.json:

~~~json
"test": "node scripts/test-catalogue.mjs && node scripts/test-progress.mjs && node scripts/test-changelog.mjs"
~~~

- [ ] **Step 2: Run the test to verify it fails**

Run: npm test

Expected: FAIL because the Changelog modules do not exist.

- [ ] **Step 3: Write minimal data and helper implementation**

Create data/changelog.js:

~~~js
export const CHANGE_TYPES = Object.freeze(["Release", "Added", "Improved", "Corrected", "Retired"]);

export const CHANGELOG_ENTRIES = Object.freeze([
  { date: "2026-08-11", type: "Improved", title: "Data and Databases course detail enriched", summary: "Added planner-based chapters, subtopics, and main reference books across five Data and Databases courses.", category: "Data and Databases" },
  { date: "2026-08-10", type: "Added", title: "CMT425 Enterprise Architecture and Systems added", summary: "Added a course overview with its planner-based chapter structure and reference shelf.", courseId: "CMT425", category: "Software Engineering" },
  { date: "2026-08-10", type: "Added", title: "CSE442 Software Testing added", summary: "Added a course overview with a lecture-material-based study outline.", courseId: "CSE442", category: "Software Engineering" },
  { date: "2026-08-10", type: "Release", title: "Knowledge City course library launched", summary: "Published the searchable course atlas with course detail, reference books, invited-learner materials access, and local revision progress." }
]);
~~~

Create assets/changelog.js with named functions. Treat All as no filter, sort a copied array by ISO date descending, and format labels with:

~~~js
new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" })
  .format(new Date(monthKey + "-01T00:00:00Z"));
~~~

Extend scripts/validate-data.mjs to assert an ISO date, supported type, non-empty title/summary, valid optional courseId/category, all four titles above, and no forbidden private terms.

- [ ] **Step 4: Run data and helper tests to verify they pass**

Run: npm test && npm run validate:data

Expected: PASS.

- [ ] **Step 5: Commit**

~~~bash
git add data/changelog.js assets/changelog.js scripts/test-changelog.mjs scripts/validate-data.mjs package.json
git commit -m "feat(changelog): add learner-facing update data"
~~~

Include the required Co-authored-by: Codex <codex@openai.com> trailer.

### Task 2: Hash navigation and semantic Changelog rendering

**Files:**
- Modify: index.html
- Modify: assets/app.js
- Modify: scripts/validate-shell.mjs
- Modify: scripts/test-catalogue.mjs

**Interfaces:**
- Consumes: Changelog data/helpers plus CATEGORIES and COURSES.
- Produces: the #changelog view, type/category filters, month groups, and Atlas course links.
- Invariant: only the active primary view is visible; #course/<id> opens Atlas and detail, #changelog shows Changelog, #journal shows Journal.

- [ ] **Step 1: Write the failing semantic contract**

Add to scripts/validate-shell.mjs:

~~~js
has(/<a\b[^>]*\bhref=["']#changelog["'][^>]*>Changelog<\/a>/, "Missing Changelog navigation link");
has(/<section\b[^>]*\bid=["']changelog["'][^>]*\baria-labelledby=["']changelog-title["']/, "Missing named Changelog section");
assert.match(app, /from "\.\/changelog\.js"/, "App must use the Changelog helper module");
assert.match(app, /function renderChangelog\(/, "App must render the Changelog");
assert.match(app, /changelog-results/, "Changelog needs an announced results summary");
~~~

Add this guard to scripts/test-catalogue.mjs:

~~~js
assert.equal(getCourseIdFromHash("#changelog"), null);
~~~

- [ ] **Step 2: Run the contract to verify it fails**

Run: node scripts/validate-shell.mjs && npm test

Expected: FAIL with a missing Changelog navigation or section assertion.

- [ ] **Step 3: Implement route-aware rendering**

Insert this primary-nav link between Atlas and Journal:

~~~html
<a href="#changelog">Changelog</a>
~~~

Add this section after Atlas workspace and before Journal:

~~~html
<section id="changelog" class="changelog-section" aria-labelledby="changelog-title" hidden>
  <div class="changelog-intro">
    <p class="section-kicker">Course library updates</p>
    <h2 id="changelog-title">Changelog</h2>
    <p>What changed in the course library.</p>
  </div>
  <div id="changelog-filters" class="changelog-filters" aria-label="Filter Changelog updates"></div>
  <p id="changelog-results" aria-live="polite"></p>
  <div id="changelog-content" class="changelog-content"></div>
</section>
~~~

In assets/app.js, import Changelog data/helpers, cache the new elements, and define:

~~~js
function currentView() {
  if (isChangelogHash(window.location.hash)) return "changelog";
  if (window.location.hash === "#journal") return "journal";
  return "atlas";
}
~~~

Implement renderChangelog to create type controls from ["All", ...CHANGE_TYPES] and category controls from ["All", ...CATEGORIES], call the helper functions, announce result count, render month sections/entry articles, and assign each course tag the URL "#course/" + entry.courseId.

Implement renderView to toggle hidden for Atlas, Changelog, and Journal; update aria-current="page"; call the correct renderer; and replace the current hashchange handler with renderView.

- [ ] **Step 4: Run semantic and behaviour checks**

Run: npm test && node scripts/validate-shell.mjs && npm run validate:data

Expected: PASS.

- [ ] **Step 5: Commit**

~~~bash
git add index.html assets/app.js scripts/validate-shell.mjs scripts/test-catalogue.mjs
git commit -m "feat(changelog): render filterable update feed"
~~~

Include the required Co-authored-by: Codex <codex@openai.com> trailer.

### Task 3: Knowledge City presentation and verification

**Files:**
- Modify: assets/styles.css
- Modify: scripts/validate-visual-contract.mjs

**Interfaces:**
- Consumes: semantic Changelog classes/IDs from Task 2.
- Produces: readable desktop/mobile layout matching the approved wireframe direction.
- Invariant: sticky header remains above Changelog and all primary anchors clear it.

- [ ] **Step 1: Write the failing visual contract**

Add to scripts/validate-visual-contract.mjs:

~~~js
assert.match(html, /id=["']changelog["']/);
assert.match(css, /\.changelog-section\s*{[\s\S]*max-width:/, "Changelog needs a readable content width");
assert.match(css, /\.changelog-entry\s*{[\s\S]*display:\s*grid/, "Changelog entries need a scanable desktop grid");
assert.match(css, /\.changelog-filters\s*{[\s\S]*display:\s*flex/, "Changelog filters need a responsive flex layout");
assert.match(css, /#atlas, #changelog, #journal\s*{[\s\S]*scroll-margin-top:/, "All primary anchors must clear the sticky header");
~~~

- [ ] **Step 2: Run visual validation to verify it fails**

Run: npm run validate:visual

Expected: FAIL with the missing Changelog visual-contract assertion.

- [ ] **Step 3: Add responsive styles**

Add focused styles for .changelog-section, .changelog-filters, .changelog-month, .changelog-entry, .changelog-entry-title, .changelog-entry-summary, .changelog-tags, .changelog-course-link, and .changelog-category-tag. Use a desktop grid with date/type metadata before content and an @media (max-width: 899px) stacked layout. Update the anchor selector from #atlas, #journal to #atlas, #changelog, #journal.

- [ ] **Step 4: Run the full automated suite**

Run:

~~~bash
npm test
npm run validate:data
node scripts/validate-shell.mjs
npm run validate:visual
git diff --check
~~~

Expected: every command succeeds without whitespace errors.

- [ ] **Step 5: Manually inspect the local site**

Serve the worktree and verify desktop plus narrow viewport:

- #changelog opens directly and marks Changelog active.
- Both filters combine and reset correctly.
- Entries are ordered correctly under August 2026.
- CSE442/CMT425 course tags open Atlas course detail.
- Atlas, Journal, search, chapter progress, materials, sticky header, and Pathways still work.

- [ ] **Step 6: Commit**

~~~bash
git add assets/styles.css scripts/validate-visual-contract.mjs
git commit -m "feat(changelog): style learner update history"
~~~

Include the required Co-authored-by: Codex <codex@openai.com> trailer.

### Task 4: Deliver through review and GitHub Pages

**Files:**
- Modify: README.md only if its navigation or feature description is inaccurate.

**Interfaces:**
- Consumes: Tasks 1–3 and their passing checks.
- Produces: a focused PR, merged main, and verified Pages deployment.

- [ ] **Step 1: Update necessary public documentation**

If README describes destinations, add one concise sentence distinguishing public Changelog updates from private browser Journal progress. Do not add implementation details or private resource information.

- [ ] **Step 2: Re-run final checks**

Run:

~~~bash
npm test
npm run validate:data
node scripts/validate-shell.mjs
npm run validate:visual
git diff --check
git status --short
~~~

Expected: all checks pass and only intentional files remain.

- [ ] **Step 3: Commit documentation only if it changed**

~~~bash
git add README.md
git commit -m "docs: describe public course library updates"
~~~

Include the required Co-authored-by: Codex <codex@openai.com> trailer.

- [ ] **Step 4: Push, PR, merge, and deploy**

Create a PR titled feat(changelog): publish learner-facing update feed, link Issue #11, and describe the month-grouped updates, filters, course links, static data, and private-data boundary. After merge, confirm the GitHub Pages workflow completed and fetch the homepage plus published data/changelog.js.

## Plan Self-Review

- Spec coverage: Tasks 1–3 implement data, month groups, types, filters, course links, #changelog, accessibility, responsive UI, and public-data safety. Task 4 delivers through PR and Pages.
- Placeholder scan: no deferred steps, undefined functions, or placeholder terms remain.
- Type consistency: CHANGELOG_ENTRIES, CHANGE_TYPES, isChangelogHash, filterChangelogEntries, and groupEntriesByMonth each have one named producer and consistent consumers.

