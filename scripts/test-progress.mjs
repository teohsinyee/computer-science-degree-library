import assert from "node:assert/strict";
import {
  GUEST_PROGRESS_KEY,
  getCourseProgress,
  getJournalCourses,
  loadGuestProgress,
  saveGuestProgress,
  toggleChapter
} from "../assets/progress.js";

const storage = new Map();
const browserStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value)
};

const courses = [
  { id: "CSE241", chapters: [{ id: "01" }, { id: "02" }, { id: "03" }] },
  { id: "CPT212", chapters: [{ id: "01" }, { id: "02" }] }
];

assert.equal(GUEST_PROGRESS_KEY, "knowledge-city.guest-progress.v1");
assert.deepEqual(loadGuestProgress(browserStorage), { version: 1, courses: {} });

const onceComplete = toggleChapter({ version: 1, courses: {} }, "CSE241", "01", "2026-08-10T10:00:00.000Z");
assert.deepEqual(onceComplete.courses.CSE241.completedChapterIds, ["01"]);
assert.deepEqual(getCourseProgress(onceComplete, courses[0]), { completedCount: 1, totalCount: 3, nextChapterId: "02" });

const undone = toggleChapter(onceComplete, "CSE241", "01", "2026-08-10T10:01:00.000Z");
assert.deepEqual(undone.courses.CSE241.completedChapterIds, []);

const retained = toggleChapter(undone, "CSE241", "01", "2026-08-10T10:02:00.000Z");
saveGuestProgress(browserStorage, retained);
assert.deepEqual(loadGuestProgress(browserStorage), retained);

storage.set(GUEST_PROGRESS_KEY, "not valid JSON");
assert.deepEqual(loadGuestProgress(browserStorage), { version: 1, courses: {} });

const journal = getJournalCourses({ version: 1, courses: {
  CSE241: { completedChapterIds: ["01"], updatedAt: "2026-08-10T10:00:00.000Z" },
  CPT212: { completedChapterIds: ["01"], updatedAt: "2026-08-10T11:00:00.000Z" }
}}, courses);
assert.deepEqual(journal.map(({ id }) => id), ["CPT212", "CSE241"]);
assert.equal(journal[0].nextChapterId, "02");
