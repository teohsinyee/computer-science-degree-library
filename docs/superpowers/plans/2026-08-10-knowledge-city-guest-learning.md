# Knowledge City Guest Learning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved Knowledge City course atlas with curated learning connections, bibliographic reference links, and private browser-local chapter revision progress.

**Architecture:** Keep the deployable site static for GitHub Pages. Public course and connection data remain in separate modules; pure catalogue and progress helpers are tested with Node built-ins; `assets/app.js` turns those results into an accessible map UI and persists only private guest progress in localStorage.

**Tech Stack:** HTML, CSS, browser JavaScript modules, localStorage, Node.js built-in `assert`, GitHub Pages.

## Global Constraints

- The approved Knowledge City white map composition is the visual acceptance target; native browser-looking controls and an unstyled generic grid do not meet it.
- No framework, build step, runtime backend, Firebase, analytics, Google login, Drive URL, course file, raw note filename, planner content, scan, slide, textbook PDF, credential, or learner identity may enter the public source.
- Course titles are primary; course codes are secondary historical labels. The site must identify itself as a personal historical course library rather than an official university catalogue.
- Relationships are curated `Related learning connections`, never inferred prerequisites.
- Guest progress is private browser-local state only and must survive refresh when localStorage is available.
- Every public reference entry must show author and title, show edition/year when known, and link by HTTPS to an exact publisher or reputable retailer product page without tracking parameters.
- Commit messages use Conventional Commits and include `Co-authored-by: Codex <codex@openai.com>`.

---

### Task 1: Complete the public data contract and connection data

**Files:**
- Create: `data/connections.js`
- Modify: `data/courses.js`
- Modify: `scripts/validate-data.mjs`
- Modify: `scripts/test-catalogue.mjs`
- Modify: `README.md`

**Interfaces:**
- Produces `CONNECTIONS`, an immutable array of `{ fromId, toId, reason }` records where both IDs exist and the pair is unique regardless of direction.
- Produces complete bibliographic `references` data for every source reference that is a real book; solution manuals and unidentified `R01_textbook.pdf` must be explicitly classified in the audit rather than silently represented as books.
- Consumes `COURSES`, `CATEGORIES`, and `REQUIRED_COURSE_IDS` from `data/courses.js`.

- [ ] **Step 1: Inventory the 21 local `R##` files and write the expected public-reference assertions**

Use the organised local collection only as a read-only bibliographic source:

```powershell
rg --files 'C:\Users\sinyee\Desktop\bachelor_computer_science' | rg '(?i)(^|\\)R\d+_'
```

Create a table in `README.md` that distinguishes `publicly cited books`, `solution manuals (not publicly cited as books)`, and `unidentified material awaiting metadata`. Include the course ID and source `R##` only; do not add a local path or filename to public data.

- [ ] **Step 2: Write failing data tests for references and relationships**

Add assertions with the following contract shape:

```js
import { CONNECTIONS } from "../data/connections.js";

const courseIds = new Set(COURSES.map(({ id }) => id));
const connectionKeys = new Set();
for (const { fromId, toId, reason } of CONNECTIONS) {
  assert.ok(courseIds.has(fromId));
  assert.ok(courseIds.has(toId));
  assert.notEqual(fromId, toId);
  assert.ok(reason.trim());
  const key = [fromId, toId].sort().join("::");
  assert.ok(!connectionKeys.has(key), `Duplicate connection: ${key}`);
  connectionKeys.add(key);
}

for (const reference of COURSES.flatMap(({ references }) => references)) {
  assert.match(reference.id, /^R\d{2}$/);
  assert.ok(reference.authors.every((author) => author.trim()));
  assert.equal(new URL(reference.bookUrl).protocol, "https:");
  assert.doesNotMatch(reference.bookUrl, /[?&](utm_|ref=|tag=)/i);
}
```

- [ ] **Step 3: Run the data test to verify the connection import fails**

Run: `npm run validate:data`

Expected: failure because `data/connections.js` does not exist yet.

- [ ] **Step 4: Curate records and implement the data modules**

Create `data/connections.js` with only defensible cross-course links, for example:

```js
export const CONNECTIONS = Object.freeze([
  Object.freeze({
    fromId: "CSE241",
    toId: "CSE441",
    reason: "Software processes and quality assurance build on shared engineering practice."
  }),
  Object.freeze({
    fromId: "CPT212",
    toId: "CPT115",
    reason: "Algorithm analysis and mathematical methods share formal problem-solving foundations."
  })
]);
```

For every real source book, replace placeholder or incorrect URLs with the exact edition page. In particular update CPC453 to Pearson product `P200000003224`, not the generic-search redirect. Keep public reference data bibliographic only.

- [ ] **Step 5: Run the complete data validation**

Run: `npm run validate:data`

Expected: exit 0; 33 course IDs, eight categories, valid references, and valid curated connection pairs.

- [ ] **Step 6: Commit the public data model**

```powershell
git add data/courses.js data/connections.js scripts/validate-data.mjs scripts/test-catalogue.mjs README.md
git commit -m "feat: add course connections and reference catalogue" -m "Co-authored-by: Codex <codex@openai.com>"
```

### Task 2: Add isolated guest-progress and relationship helper modules

**Files:**
- Create: `assets/progress.js`
- Modify: `assets/catalogue.js`
- Modify: `scripts/test-catalogue.mjs`
- Create: `scripts/test-progress.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces `loadGuestProgress(storage)`, `toggleChapter(progress, courseId, chapterId, now)`, `getCourseProgress(progress, course)`, and `getJournalCourses(progress, courses)`.
- Produces `getConnectionsForCourse(courseId, connections)` and `getConnectedCourseIds(courseId, connections)`.
- `GuestProgress` is `{ version: 1, courses: { [courseId]: { completedChapterIds: string[], updatedAt: string } } }`.

- [ ] **Step 1: Write failing progress tests**

Create `scripts/test-progress.mjs` with deterministic time and storage doubles:

```js
const storage = new Map();
const browserStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value)
};

assert.deepEqual(loadGuestProgress(browserStorage), { version: 1, courses: {} });
const onceComplete = toggleChapter({ version: 1, courses: {} }, "CSE241", "01", "2026-08-10T10:00:00.000Z");
assert.deepEqual(onceComplete.courses.CSE241.completedChapterIds, ["01"]);
const undone = toggleChapter(onceComplete, "CSE241", "01", "2026-08-10T10:01:00.000Z");
assert.deepEqual(undone.courses.CSE241.completedChapterIds, []);
```

Add catalogue tests proving that a connection is returned in both directions and that the same pair is not duplicated.

- [ ] **Step 2: Run the tests to verify missing exports fail**

Run: `node scripts/test-progress.mjs`

Expected: failure because `assets/progress.js` does not exist.

- [ ] **Step 3: Implement immutable progress and relationship helpers**

Implement the explicit functions below; do not access `window` or `localStorage` in this module:

```js
export const GUEST_PROGRESS_KEY = "knowledge-city.guest-progress.v1";

export function getConnectionsForCourse(courseId, connections) {
  return connections.filter(({ fromId, toId }) => fromId === courseId || toId === courseId);
}

export function getConnectedCourseIds(courseId, connections) {
  return getConnectionsForCourse(courseId, connections)
    .map(({ fromId, toId }) => (fromId === courseId ? toId : fromId));
}
```

`loadGuestProgress` must parse defensively and return the empty versioned record for malformed, missing, or unsupported data. `toggleChapter` must return a new record and update `updatedAt`; it must never mutate its input.

- [ ] **Step 4: Add the progress test command and verify it**

Set package scripts to:

```json
{
  "test": "node scripts/test-catalogue.mjs && node scripts/test-progress.mjs"
}
```

Run: `npm test`

Expected: exit 0 with both pure-helper suites passing.

- [ ] **Step 5: Commit the guest state foundation**

```powershell
git add assets/catalogue.js assets/progress.js scripts/test-catalogue.mjs scripts/test-progress.mjs package.json
git commit -m "feat: add guest learning progress model" -m "Co-authored-by: Codex <codex@openai.com>"
```

### Task 3: Rebuild the atlas document structure and map visual system

**Files:**
- Modify: `index.html`
- Modify: `assets/styles.css`
- Modify: `scripts/validate-shell.mjs`
- Create: `scripts/validate-visual-contract.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces landmarks and hooks: `#atlas`, `#journal`, `#pathways`, `#about`, `#course-search`, `#category-filters`, `#course-grid`, `#course-detail`, and `#journal-content`.
- Produces CSS classes: `.atlas-hero`, `.city-map`, `.map-network`, `.district`, `.course-card`, `.course-detail-panel`, `.pathway-mode`, and `.journal-section`.

- [ ] **Step 1: Write a failing visual-contract validator**

Create `scripts/validate-visual-contract.mjs` that reads HTML and CSS and asserts the non-negotiable composition hooks:

```js
assert.match(html, /id=["']atlas["']/);
assert.match(html, /id=["']journal["']/);
assert.match(html, /id=["']pathways["']/);
assert.match(html, /class=["'][^"']*atlas-hero/);
assert.match(html, /class=["'][^"']*city-map/);
assert.match(css, /\.course-grid\s*{[\s\S]*display:\s*grid/);
assert.match(css, /\.course-card\s*{[\s\S]*border:/);
assert.match(css, /\.map-network/);
assert.match(css, /@media \(max-width: 899px\)/);
```

- [ ] **Step 2: Run the visual-contract validator to verify it fails**

Run: `node scripts/validate-visual-contract.mjs`

Expected: failure because the generic shell lacks the Atlas and Journal structure.

- [ ] **Step 3: Replace the static shell with the approved information architecture**

Build semantic HTML for the header and sections:

```html
<header class="site-header">
  <a class="wordmark" href="#atlas">KNOWLEDGE CITY</a>
  <p class="descriptor">A digital course atlas for<br>Computer Science</p>
  <nav aria-label="Primary">
    <a href="#atlas">Atlas</a>
    <a href="#journal">Journal</a>
    <button type="button" id="pathways">Pathways</button>
    <button type="button" id="about">About</button>
  </nav>
</header>
```

Use CSS custom properties for the warm-paper surface, ink, rule, and eight district colours. Build the city illustration from decorative CSS/SVG layers and keep every meaning-bearing course, relationship, and control as text or semantic DOM. Implement the desktop map/grid and right-hand panel; make the narrow view a readable list and true fixed dialog with `margin: 0` when open.

- [ ] **Step 4: Strengthen shell accessibility validation**

Extend `scripts/validate-shell.mjs` to assert a named primary navigation, labelled map/course region, named detail panel, search form submit prevention hook, `prefers-reduced-motion` handling, and no visible material link hook.

- [ ] **Step 5: Verify the static visual contract and existing shell contract**

Run:

```powershell
node scripts/validate-visual-contract.mjs
node scripts/validate-shell.mjs
```

Expected: both exit 0.

- [ ] **Step 6: Commit the Knowledge City shell**

```powershell
git add index.html assets/styles.css scripts/validate-shell.mjs scripts/validate-visual-contract.mjs package.json
git commit -m "feat: build Knowledge City atlas shell" -m "Co-authored-by: Codex <codex@openai.com>"
```

### Task 4: Render the accessible atlas, pathways, and honest course detail

**Files:**
- Modify: `assets/app.js`
- Modify: `assets/styles.css`
- Modify: `scripts/validate-shell.mjs`

**Interfaces:**
- Consumes `COURSES`, `CATEGORIES`, `CONNECTIONS`, `filterCourses`, `getCourseIdFromHash`, `formatReference`, `getConnectionsForCourse`, and `getConnectedCourseIds`.
- Produces selected-course rendering, `pathway-mode` state, an accessible course detail panel/dialog, and linkable `#course/<id>` state.

- [ ] **Step 1: Write failing static behaviour checks**

Add checks that require the app to prevent form submission, preserve filter focus, attach a category modifier class, supply an explicit card accessible name, render connection reason text, and use the exact external-link safety attributes:

```js
assert.match(app, /searchForm\.addEventListener\(["']submit["'], \(event\) => event\.preventDefault\(\)\)/);
assert.match(app, /button\.className = `district district-\$\{categoryKey\}`/);
assert.match(app, /card\.setAttribute\(["']aria-label["']/);
assert.match(app, /Related learning connections/);
assert.match(app, /link\.rel = ["']noopener noreferrer["']/);
```

- [ ] **Step 2: Run validation to verify current app fails the new contract**

Run: `node scripts/validate-shell.mjs`

Expected: failure on the new rendering requirements.

- [ ] **Step 3: Implement map rendering and relationship mode**

Render district controls with a stable set of buttons rather than recreating the focused control. Set `aria-pressed` in place. Render each filtered course as a city block positioned by stable CSS grid placement and annotate it with `aria-label`, for example:

```js
card.setAttribute("aria-label", `${course.title}, ${course.id}, ${course.category}`);
```

When Pathways is enabled, add `pathway-mode` to the atlas and reveal only edges whose two endpoints are currently visible. Each edge needs a nonvisual equivalent in the selected course's `Related learning connections` list.

- [ ] **Step 4: Implement the truthful detail panel**

Render title first, code second, summary, topic tags, and derived count strip. Remove all invented academic metadata. The count strip must be built from `course.chapters.length`, `course.references.length`, and guest-progress helpers. Do not render `materialsUrl`, a Drive action, or learner count.

For a direct `#course/<id>` mobile visit, closing the dialog must move focus to `#course-search` when there is no card invoker. On mobile reset any desktop panel margin with `margin: 0`.

- [ ] **Step 5: Verify renderer and interaction contracts**

Run:

```powershell
npm test
node scripts/validate-shell.mjs
node scripts/validate-visual-contract.mjs
```

Expected: all commands exit 0.

- [ ] **Step 6: Commit atlas behaviour**

```powershell
git add assets/app.js assets/styles.css scripts/validate-shell.mjs
git commit -m "feat: render connected course atlas" -m "Co-authored-by: Codex <codex@openai.com>"
```

### Task 5: Wire chapter controls and Journal to private browser progress

**Files:**
- Modify: `assets/app.js`
- Modify: `assets/styles.css`
- Modify: `scripts/validate-shell.mjs`
- Modify: `scripts/test-progress.mjs`

**Interfaces:**
- Consumes `loadGuestProgress`, `saveGuestProgress`, `toggleChapter`, `getCourseProgress`, and `getJournalCourses` from `assets/progress.js`.
- Produces labelled chapter checkbox controls and Journal continuation links with `#course/<id>?chapter=<chapterId>` represented safely in hash-compatible state.

- [ ] **Step 1: Extend progress tests for persistence and resume order**

Add assertions that serialise and reload the record, ignore corrupt JSON, and rank later updates before earlier updates:

```js
const latest = getJournalCourses({ version: 1, courses: {
  CSE241: { completedChapterIds: ["01"], updatedAt: "2026-08-10T10:00:00.000Z" },
  CPT212: { completedChapterIds: ["01"], updatedAt: "2026-08-10T11:00:00.000Z" }
}}, courses);
assert.deepEqual(latest.map(({ id }) => id), ["CPT212", "CSE241"]);
```

- [ ] **Step 2: Run the progress suite and verify the new case fails**

Run: `node scripts/test-progress.mjs`

Expected: failure until Journal sorting and persistence are implemented.

- [ ] **Step 3: Render and persist chapter progress**

Use a checkbox with a label containing the chapter number and title. On each change, call the pure toggle helper, attempt to save via a small guarded browser adapter, rerender the detail progress strip and Journal, and retain the selected course and focus. On storage failure, show a polite inline message such as `Progress will remain for this tab, but this browser could not save it.`

- [ ] **Step 4: Render Journal**

For each in-progress course, render the title, `completed/total` text, next unfinished chapter, and a `Continue` button. Render the approved empty state if no in-progress record exists. Do not expose progress in any public card, course count, URL, or data module.

- [ ] **Step 5: Verify guest-learning behaviour**

Run:

```powershell
npm test
node scripts/validate-data.mjs
node scripts/validate-shell.mjs
```

Then manually verify in a browser:

1. Open `http://localhost:4173`, open CSE241, check chapter 01, refresh, and confirm it remains checked.
2. Open Journal and confirm CSE241 appears with chapter 02 as the next action.
3. Clear the `knowledge-city.guest-progress.v1` localStorage key and confirm Journal returns to its empty state.

- [ ] **Step 6: Commit private guest learning**

```powershell
git add assets/app.js assets/styles.css scripts/test-progress.mjs scripts/validate-shell.mjs
git commit -m "feat: add private guest revision journal" -m "Co-authored-by: Codex <codex@openai.com>"
```

### Task 6: Complete visual, privacy, and release verification

**Files:**
- Modify: `README.md`
- Modify: `scripts/validate-data.mjs`
- Modify: `scripts/validate-shell.mjs`
- Create: `docs/verification/2026-08-10-knowledge-city-atlas.md`

**Interfaces:**
- Produces a current README that separates shipped guest learning from later sign-in, sync, counts, and restricted material links.
- Produces a written audit with screenshots or exact manual browser observations for desktop and mobile.

- [ ] **Step 1: Add failing privacy scans for runtime source**

Add this validation pattern:

```js
const publicSource = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../assets/app.js", import.meta.url), "utf8"),
  readFile(new URL("../data/courses.js", import.meta.url), "utf8"),
  readFile(new URL("../data/connections.js", import.meta.url), "utf8")
]).then((files) => files.join("\n"));
assert.doesNotMatch(publicSource, /drive\.google\.com|[A-Z]:\\|\.pdf|lecture notes|course planner/i);
```

- [ ] **Step 2: Run the full suite before documentation changes**

Run:

```powershell
npm run validate:data
npm test
node scripts/validate-shell.mjs
node scripts/validate-visual-contract.mjs
```

Expected: all commands exit 0.

- [ ] **Step 3: Update public documentation and write verification evidence**

Update README so it calls the live product a public course atlas with browser-local private guest progress. Move Firebase, Google login, public learner counts, and restricted Drive folders under `Planned next` rather than presenting them as shipped.

Write `docs/verification/2026-08-10-knowledge-city-atlas.md` with exact commands, browser dimensions, desktop/mobile observations, keyboard results, localStorage persistence result, connection labels checked, and privacy-search results.

- [ ] **Step 4: Perform the final visual and accessibility browser audit**

Start the server:

```powershell
py -m http.server 4173
```

Audit `http://localhost:4173` at 1600×1000 and 390×844 against the approved Figma screenshot: header hierarchy, oversized title, warm-white map surface, coloured districts, city blocks, selected detail panel, and mobile dialog. Verify search Enter, filter focus, keyboard card selection, Escape close, direct hash close focus fallback, Pathways text equivalent, chapter persistence, and Journal continuation.

- [ ] **Step 5: Commit release evidence**

```powershell
git add README.md scripts/validate-data.mjs scripts/validate-shell.mjs docs/verification/2026-08-10-knowledge-city-atlas.md
git commit -m "docs: verify Knowledge City guest learning release" -m "Co-authored-by: Codex <codex@openai.com>"
```

