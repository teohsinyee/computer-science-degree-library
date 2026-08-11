import assert from "node:assert/strict";
import { CHANGELOG_ENTRIES } from "../data/changelog.js";
import {
  filterChangelogEntries,
  groupEntriesByMonth,
  isChangelogHash
} from "../assets/changelog.js";

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
