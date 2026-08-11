# Knowledge City Motion System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Knowledge City navigation and content changes feel smooth, intentional, and readable without adding an animation dependency.

**Architecture:** Add a small DOM-safe motion module that owns feature detection, reduced-motion behavior, View Transition invocation, and cancellable content replacement. `assets/app.js` uses it for view changes and content updates; `assets/styles.css` supplies the shared timing tokens and visual states. Existing Node scripts validate the public motion contract without needing a browser test framework.

**Tech Stack:** Static HTML, native ES modules, CSS animations/transitions, View Transitions API with progressive fallback, Node `assert` scripts.

## Global Constraints

- Preserve the Knowledge City editorial/map visual language; motion is for reading flow, not decoration.
- Use native browser and CSS features only; do not add a third-party animation library.
- Use `140ms` feedback, `180ms` content change, `260ms` view change, and a maximum three-item `45ms` entrance stagger.
- Limit movement to opacity plus at most an `8px` vertical settle.
- `prefers-reduced-motion: reduce` must use immediate or near-immediate state changes and must not invoke View Transition animation.
- Do not animate layout dimensions, block input, hide focus, or change course, Changelog, Journal, or Google Drive content.

---

### Task 1: Build and test the progressive motion primitives

**Files:**
- Create: `assets/motion.js`
- Create: `scripts/test-motion.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `prefersReducedMotion(mediaQueryList)`, `canUseViewTransition(documentRef, mediaQueryList)`, `runViewTransition(documentRef, mediaQueryList, update)`, and `createContentTransition(options)` from `assets/motion.js`.
- Consumes: a browser `Document` only at runtime; tests supply plain fake objects.
- Produces: `npm test` executes `scripts/test-motion.mjs` after the existing catalogue, progress, and Changelog checks.

- [ ] **Step 1: Write the failing motion-unit test**

Create `scripts/test-motion.mjs` with tests for native support, fallback, reduced motion, and newest-request-wins behavior:

```js
import assert from "node:assert/strict";
import {
  canUseViewTransition,
  createContentTransition,
  prefersReducedMotion,
  runViewTransition
} from "../assets/motion.js";

const reduced = { matches: true };
const normal = { matches: false };
assert.equal(prefersReducedMotion(reduced), true);
assert.equal(canUseViewTransition({ startViewTransition() {} }, normal), true);
assert.equal(canUseViewTransition({ startViewTransition() {} }, reduced), false);

let fallbackUpdates = 0;
await runViewTransition({}, normal, () => { fallbackUpdates += 1; });
assert.equal(fallbackUpdates, 1);

let nativeUpdates = 0;
let nativeCalls = 0;
await runViewTransition({ startViewTransition(update) {
  nativeCalls += 1;
  update();
  return { finished: Promise.resolve() };
} }, normal, () => { nativeUpdates += 1; });
assert.deepEqual({ nativeCalls, nativeUpdates }, { nativeCalls: 1, nativeUpdates: 1 });

const state = { dataset: {} };
const waits = [];
const transition = createContentTransition({
  prefersReducedMotion: () => false,
  wait: () => new Promise((resolve) => waits.push(resolve)),
  nextFrame: (callback) => callback()
});
const first = transition(state, () => { state.value = "first"; });
const second = transition(state, () => { state.value = "second"; });
assert.equal(state.dataset.motionState, "leaving");
waits[0]();
waits[1]();
await Promise.all([first, second]);
assert.equal(state.value, "second");
assert.equal(state.dataset.motionState, undefined);
```

- [ ] **Step 2: Run the new test and verify it fails because the module is absent**

Run: `node scripts/test-motion.mjs`

Expected: a module-not-found failure for `assets/motion.js`.

- [ ] **Step 3: Implement the smallest motion module that satisfies the test**

Create `assets/motion.js` with this public shape. `runViewTransition` must call `update` once and return a promise whether it uses the native API or fallback. `createContentTransition` must discard stale updates after its leave wait, render only the newest update, run the next-frame cleanup, and bypass waiting when reduced motion is requested.

```js
export function prefersReducedMotion(mediaQueryList) {
  return Boolean(mediaQueryList?.matches);
}

export function canUseViewTransition(documentRef, mediaQueryList) {
  return !prefersReducedMotion(mediaQueryList)
    && typeof documentRef?.startViewTransition === "function";
}

export function runViewTransition(documentRef, mediaQueryList, update) {
  if (!canUseViewTransition(documentRef, mediaQueryList)) return Promise.resolve(update());
  const transition = documentRef.startViewTransition(update);
  return transition.finished.catch(() => undefined);
}

export function createContentTransition({ prefersReducedMotion: isReduced, wait, nextFrame }) {
  let latestRequest = 0;
  return async (element, update) => {
    const request = ++latestRequest;
    if (isReduced()) return update();
    element.dataset.motionState = "leaving";
    await wait(120);
    if (request !== latestRequest) return;
    update();
    element.dataset.motionState = "entering";
    nextFrame(() => {
      if (request === latestRequest) delete element.dataset.motionState;
    });
  };
}
```

- [ ] **Step 4: Add the new test to the repository test command**

Change the `test` script in `package.json` to:

```json
"test": "node scripts/test-catalogue.mjs && node scripts/test-progress.mjs && node scripts/test-changelog.mjs && node scripts/test-motion.mjs"
```

- [ ] **Step 5: Run the motion test and complete test suite**

Run: `node scripts/test-motion.mjs && npm test`

Expected: exit code `0`; the native, fallback, reduced-motion, and superseded-update assertions pass.

- [ ] **Step 6: Commit the tested motion primitives**

```powershell
git add assets/motion.js scripts/test-motion.mjs package.json
git commit -m "feat(motion): add progressive transition primitives" -m "Co-authored-by: Codex <codex@openai.com>"
```

### Task 2: Connect navigation and content updates to the motion module

**Files:**
- Modify: `assets/app.js`
- Modify: `scripts/validate-visual-contract.mjs`

**Interfaces:**
- Consumes: `runViewTransition` and `createContentTransition` from `assets/motion.js`.
- Produces: `renderView()` delegates the existing synchronous DOM update to `runViewTransition`.
- Produces: `renderCourses()`, `renderChangelog()`, `renderJournal()`, and course-detail updates can request a content transition without changing their existing output or ARIA behavior.

- [ ] **Step 1: Write the failing integration-contract checks**

Add these assertions to `scripts/validate-visual-contract.mjs` after reading `assets/app.js` into an `app` string:

```js
const app = await readFile(new URL("../assets/app.js", import.meta.url), "utf8");
assert.match(app, /from "\.\/motion\.js"/, "The app must use the shared motion module");
assert.match(app, /runViewTransition\(/, "Primary view changes must use progressive View Transitions");
assert.match(app, /createContentTransition\(/, "Content replacements need a cancellable transition");
assert.match(app, /window\.matchMedia\("\(prefers-reduced-motion: reduce\)"\)/, "The app must honour the learner motion preference");
```

- [ ] **Step 2: Run the visual contract check and verify it fails for the missing integration**

Run: `node scripts/validate-visual-contract.mjs`

Expected: assertion failure saying the app must use the shared motion module.

- [ ] **Step 3: Add the motion dependencies and runtime helpers to `assets/app.js`**

Import the four motion functions, create one media-query list, and create reusable helpers near the current module state:

```js
import {
  createContentTransition,
  prefersReducedMotion,
  runViewTransition
} from "./motion.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const animateContent = createContentTransition({
  prefersReducedMotion: () => prefersReducedMotion(reducedMotion),
  wait: (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds)),
  nextFrame: (callback) => window.requestAnimationFrame(callback)
});
```

- [ ] **Step 4: Refactor view switching into a synchronous updater and progressive wrapper**

Keep the current visibility, `aria-current`, and renderer logic together in `updateView()`. Make `renderView()` delegate to it:

```js
function renderView() {
  return runViewTransition(document, reducedMotion, updateView);
}
```

After `updateView()` makes the destination visible, apply an entrance marker to the visible primary section only when reduced motion is not requested. Remove the marker on `animationend` so the marker can be replayed on a later page visit.

- [ ] **Step 5: Apply cancellable content transitions at learner-visible change points**

Refactor the renderers so their current DOM-writing bodies stay synchronous and can be passed to `animateContent`:

```js
function updateChangelogContent() {
  // existing filter rendering, result count, and entry rendering
}

function renderChangelog({ animate = false } = {}) {
  return animate
    ? animateContent(changelogContent, updateChangelogContent)
    : updateChangelogContent();
}
```

Use `renderChangelog({ animate: true })` from filter buttons. Apply the same pattern to the Atlas results for search input, district selection, pathways toggling, course detail open/close, and Journal refresh after chapter completion. Keep initial rendering immediate. Do not delay a selected filter's `aria-pressed` update or keyboard focus behavior.

- [ ] **Step 6: Run integration and regression checks**

Run: `node scripts/validate-visual-contract.mjs && npm test && npm run validate:data`

Expected: exit code `0`; all existing catalogue, progress, Changelog, and data checks remain green.

- [ ] **Step 7: Commit the application integration**

```powershell
git add assets/app.js scripts/validate-visual-contract.mjs
git commit -m "feat(motion): animate library navigation and updates" -m "Co-authored-by: Codex <codex@openai.com>"
```

### Task 3: Add the restrained Knowledge City visual motion language

**Files:**
- Modify: `assets/styles.css`
- Modify: `scripts/validate-visual-contract.mjs`

**Interfaces:**
- Consumes: visible primary sections, `[data-motion-state]`, and the entrance marker added by `assets/app.js`.
- Produces: CSS custom properties and keyframes for feedback, content change, view change, and a reduced-motion override.

- [ ] **Step 1: Write failing CSS motion-contract checks**

Append the following assertions to `scripts/validate-visual-contract.mjs`:

```js
assert.match(css, /--motion-feedback:\s*140ms/, "Shared feedback timing must be explicit");
assert.match(css, /--motion-content:\s*180ms/, "Shared content timing must be explicit");
assert.match(css, /--motion-view:\s*260ms/, "Shared view timing must be explicit");
assert.match(css, /@keyframes motion-enter/, "Primary views need an entrance animation");
assert.match(css, /\[data-motion-state="leaving"\]/, "Content changes need an exit state");
assert.match(css, /\[data-motion-state="entering"\]/, "Content changes need an enter state");
assert.match(css, /::view-transition-old\(root\)/, "Native view transitions need an outgoing rule");
assert.match(css, /::view-transition-new\(root\)/, "Native view transitions need an incoming rule");
```

- [ ] **Step 2: Run the visual contract check and verify it fails for absent motion tokens**

Run: `node scripts/validate-visual-contract.mjs`

Expected: assertion failure saying shared feedback timing must be explicit.

- [ ] **Step 3: Add shared tokens and entrance/keyframe styles**

Add the motion properties to the existing `:root`, then add `motion-enter` using only opacity and a maximum `translateY(8px)`. Apply it to the JavaScript entrance marker with at most three stagger selectors for orientation, controls, and content. Use `--motion-view` and `ease-out`.

- [ ] **Step 4: Style view, content, and feedback states without layout animation**

Add these contracts:

```css
::view-transition-old(root) { animation: motion-fade-out var(--motion-view) ease-out both; }
::view-transition-new(root) { animation: motion-enter var(--motion-view) ease-out both; }

[data-motion-state="leaving"] { opacity: 0; transition: opacity 120ms ease-out; }
[data-motion-state="entering"] { animation: motion-enter var(--motion-content) ease-out both; }
```

Use `--motion-feedback` for navigation links, Changelog filters, district controls, tags, Journal buttons, course cards, and the course-detail panel. Keep the existing focus outlines visible and avoid transition declarations that affect width, height, grid, flex, margins, or padding.

- [ ] **Step 5: Make the reduced-motion override complete**

Extend the existing `@media (prefers-reduced-motion: reduce)` rule so View Transition pseudo-elements have no animation, entrance markers do not animate, and content-change state changes remain immediate. Do not remove focus or state colour/border differences.

- [ ] **Step 6: Run full automated verification**

Run: `npm test && npm run validate:data && npm run validate:visual && node scripts/validate-shell.mjs && git diff --check`

Expected: every command exits `0` and `git diff --check` prints no whitespace errors.

- [ ] **Step 7: Perform manual browser checks**

At desktop and a 390px mobile viewport, verify:

1. Atlas → Changelog → Journal switches with a brief fade/settle and remains usable while it runs.
2. Atlas search, district filters, course selection, and course detail updates do not jump or cause overflow.
3. Changelog type/category filters fade old entries then reveal the new list; rapid filter selections finish on the newest choice.
4. Checking and unchecking a chapter gives restrained progress feedback and Journal reflects the changed state.
5. Tab focus stays visible throughout; `prefers-reduced-motion: reduce` removes meaningful animation.

- [ ] **Step 8: Commit the visual system**

```powershell
git add assets/styles.css scripts/validate-visual-contract.mjs
git commit -m "feat(motion): add smooth reading feedback" -m "Co-authored-by: Codex <codex@openai.com>"
```

## Self-Review

### Spec coverage

- Page transitions: Task 2 uses native View Transitions with fallback; Task 3 styles both directions.
- First entrance: Task 2 adds the marker; Task 3 applies a three-level entrance sequence.
- Atlas, Changelog, and Journal feedback: Task 2 identifies each render path; Task 3 styles the shared states and controls.
- Timing and movement limits: Global Constraints and Task 3 enforce the approved values.
- Accessibility, performance, and fallback: Task 1 prevents native animation for reduced motion; Task 2 keeps updates synchronous and cancellable; Task 3 completes the CSS override; Task 3 manual checks verify focus and overflow.
- No new library: stated as a global constraint and implemented with native APIs/CSS only.

### Placeholder scan

The plan contains no deferred-work markers, vague test instruction, or undefined function reference. Every new public function is named in Task 1 and every integration call is named in Task 2.

### Type consistency

`runViewTransition(documentRef, mediaQueryList, update)` and `createContentTransition(options)` have the same argument shapes in Tasks 1 and 2. `data-motion-state` is the CSS selector contract used consistently by Tasks 1–3.
