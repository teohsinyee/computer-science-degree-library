# Invited Learner Materials and Atlas UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add clear Google Drive material entry points for configured courses and make the Knowledge City header and district controls usable at every supported viewport.

**Architecture:** A separate public `data/materials.js` registry maps a course ID to its Google Drive folder URL. `data/courses.js` joins that optional URL into each course; `assets/app.js` renders the invited-learner message and safe external link only when it exists. CSS keeps the header sticky and turns district controls into non-overlapping, deliberate scrollable controls where space is constrained.

**Tech Stack:** Static HTML, CSS, browser ES modules, Node built-in assertions, Playwright CLI, GitHub Pages.

## Global Constraints

- Google Drive is the sole authority that grants or denies material access.
- Use the exact visible copy: `Available to invited learners through Google Drive. Sign in with the Google account that has been granted access.`
- Use the action text: `View course materials ↗`.
- Never commit course files, note filenames, planner contents, Drive credentials, or direct downloads.
- A public Drive folder URL is a navigation link, not a credential; it may appear only in `data/materials.js`.
- Do not render a material section when a course has no configured folder URL.
- Keep the approved warm-white Knowledge City visual language.

---

### Task 1: Model and render invited-learner Drive entries

**Files:**
- Create: `data/materials.js`
- Modify: `data/courses.js`
- Modify: `assets/app.js`
- Modify: `assets/styles.css`
- Modify: `scripts/validate-data.mjs`
- Modify: `scripts/validate-shell.mjs`

**Interfaces:**
- Produces `MATERIAL_URLS: Readonly<Record<string, string>>` from `data/materials.js`.
- Extends every course object with `materialsUrl: string | null`.
- `appendMaterials(course)` in `assets/app.js` appends nothing when `materialsUrl` is null and otherwise renders the required copy plus one safe external link.

- [ ] **Step 1: Write failing public-data and shell assertions**

Add assertions that a configured URL is HTTPS, Google Drive, and belongs to a known course ID; replace the old assertion that every `materialsUrl` is null. Add shell assertions for `appendMaterials`, the exact invited-learner copy, the `View course materials` label, and `noopener noreferrer`.

```js
for (const [courseId, materialsUrl] of Object.entries(MATERIAL_URLS)) {
  assert.ok(ids.has(courseId));
  assert.match(materialsUrl, /^https:\/\/drive\.google\.com\/drive\/folders\/[\w-]+/);
}
assert.match(app, /Available to invited learners through Google Drive/);
assert.match(app, /View course materials/);
```

- [ ] **Step 2: Run the checks to verify they fail**

Run: `npm run validate:data; node scripts/validate-shell.mjs`

Expected: failure because `MATERIAL_URLS` and `appendMaterials` do not yet exist.

- [ ] **Step 3: Add the optional material registry and course join**

Create `data/materials.js`:

```js
export const MATERIAL_URLS = Object.freeze({});
```

Import `MATERIAL_URLS` in `data/courses.js` and change the `course` helper so the final field is `materialsUrl: MATERIAL_URLS[id] ?? null`.

- [ ] **Step 4: Render safe, clearly described material entry**

Add `appendMaterials(course)` after the chapter list in `assets/app.js`. When `course.materialsUrl` is set, append the required heading and explanatory paragraph, then an anchor with `href = course.materialsUrl`, `target = "_blank"`, and `rel = "noopener noreferrer"`. When it is null, append no elements.

- [ ] **Step 5: Style the material section**

Add `.materials-copy` and `.materials-link` rules using the existing detail-panel typography, border, and blue external-action treatment. Keep the action visually distinct from reference-book links.

- [ ] **Step 6: Verify and commit**

Run: `npm test; npm run validate:data; node scripts/validate-shell.mjs; npm run validate:visual; git diff --check`

Expected: all commands exit 0.

```powershell
git add data/materials.js data/courses.js assets/app.js assets/styles.css scripts/validate-data.mjs scripts/validate-shell.mjs
git commit -m "feat: add invited learner material entries" -m "Co-authored-by: Codex <codex@openai.com>"
```

### Task 2: Make district controls readable and pin the header

**Files:**
- Modify: `assets/styles.css`
- Modify: `scripts/validate-visual-contract.mjs`
- Modify: `scripts/validate-shell.mjs`

**Interfaces:**
- Uses existing `.site-header`, `.category-filters`, and `.district` controls.
- Produces a sticky header with a stable stacking layer and readable, non-overlapping district controls at 320px, 768px, and desktop widths.

- [ ] **Step 1: Write failing visual assertions**

Add assertions for a sticky site header, safe header stacking, scroll margin for in-page anchors, and filter layout that uses a non-overlapping flex row rather than a fractional eight-column grid.

```js
assert.match(css, /\.site-header\s*{[\s\S]*position:\s*sticky/);
assert.match(css, /\.site-header\s*{[\s\S]*z-index:/);
assert.match(css, /\.category-filters\s*{[\s\S]*display:\s*flex/);
assert.match(css, /\.district\s*{[\s\S]*flex:\s*0 0 auto/);
```

- [ ] **Step 2: Run the visual check to verify it fails**

Run: `npm run validate:visual`

Expected: failure because the header is not sticky and filters use overlapping grid tracks.

- [ ] **Step 3: Implement desktop and narrow-width layout rules**

Set `.site-header` to `position: sticky; top: 0; z-index: 30;` with its opaque existing paper background. Replace the base `.category-filters` grid with `display: flex; flex-wrap: wrap;` and `.district { flex: 0 0 auto; }`. At widths below 899px, retain `overflow-x: auto` but force `flex-wrap: nowrap` so each complete control is available by deliberate horizontal scrolling rather than overlap.

- [ ] **Step 4: Keep anchor and dialog content clear of the header**

Add `scroll-margin-top` to `#atlas` and `#journal`. In the mobile detail rule, retain the fixed dialog stacking above the sticky header using a higher z-index. Confirm focus rings are not clipped by the filter container.

- [ ] **Step 5: Verify and commit**

Run: `node scripts/validate-shell.mjs; npm run validate:visual; git diff --check`

Expected: all commands exit 0.

```powershell
git add assets/styles.css scripts/validate-shell.mjs scripts/validate-visual-contract.mjs
git commit -m "fix: improve Atlas navigation usability" -m "Co-authored-by: Codex <codex@openai.com>"
```

### Task 3: Configure actual folders and perform browser verification

**Files:**
- Modify: `data/materials.js`
- Modify: `README.md`
- Create: `docs/verification/2026-08-10-invited-learner-materials-and-atlas-ux.md`

**Interfaces:**
- Consumes owner-provided Google Drive folder URLs in `MATERIAL_URLS`.
- Produces visible material entries only for configured courses and a verification record.

- [ ] **Step 1: Add owner-approved course-folder mappings**

For each Drive folder URL provided by the owner, add exactly one registry entry:

```js
export const MATERIAL_URLS = Object.freeze({
  CSE241: "https://drive.google.com/drive/folders/<owner-provided-folder-id>"
});
```

Do not invent URLs or copy local material paths. A course remains without an action until its folder URL is supplied.

- [ ] **Step 2: Update public copy and setup guidance**

Update README to state that material links are visible for configured courses, are for invited learners, and Google Drive controls access. State that the owner must share each folder with invited Google accounts before publishing its URL.

- [ ] **Step 3: Run static and browser checks**

Start the static server, then verify at 1600×1000 and 390×844:

1. district labels do not overlap;
2. header remains visible while scrolling;
3. a configured course displays the exact invited-learner copy and opens its configured Drive URL in a new tab;
4. an unconfigured course has no material section;
5. no course files or credentials appear in the page.

Run: `npm test; npm run validate:data; node scripts/validate-shell.mjs; npm run validate:visual; git diff --check`

Expected: all commands exit 0.

- [ ] **Step 4: Commit and update the delivery record**

```powershell
git add data/materials.js README.md docs/verification/2026-08-10-invited-learner-materials-and-atlas-ux.md
git commit -m "docs: verify invited learner material access" -m "Co-authored-by: Codex <codex@openai.com>"
```

Update GitHub Issue #4 so its scope and acceptance criteria use the invited-learner copy and Google Drive-only access model. Link Issue #6 as the Atlas UX dependency.

## Plan self-review

- Access-model coverage: Task 1 enforces optional Drive-folder URLs, clear invited-learner copy, safe links, and the no-files boundary.
- UX coverage: Task 2 directly fixes the overlapping filter layout and persistent-header behaviour from the user screenshots.
- End-to-end coverage: Task 3 requires actual owner-approved URLs and browser verification for configured and unconfigured courses.
- The only external input required is the owner-approved Google Drive folder URL for each course; the plan intentionally does not fabricate those links.
