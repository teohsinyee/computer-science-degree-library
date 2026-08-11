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
