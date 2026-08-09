import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { CATEGORIES, COURSES, REQUIRED_COURSE_IDS } from "../data/courses.js";
import { CONNECTIONS } from "../data/connections.js";
import { MATERIAL_URLS } from "../data/materials.js";

assert.equal(CATEGORIES.length, 8, "Expected eight categories");
assert.equal(COURSES.length, 33, "Expected 33 public courses");

const ids = new Set();
for (const course of COURSES) {
  assert.match(course.id, /^(?:[A-Z]+\d+|ACCOUNTING)$/);
  assert.ok(!ids.has(course.id), `Duplicate course id: ${course.id}`);
  ids.add(course.id);
  assert.ok(CATEGORIES.includes(course.category));
  assert.ok(course.title.trim() && course.summary.trim());
  assert.ok(course.topics.length > 0 && course.chapters.length > 0);
  assert.ok(course.materialsUrl === null || course.materialsUrl === MATERIAL_URLS[course.id]);
  for (const reference of course.references) {
    assert.ok(reference.id && reference.title && reference.authors.length);
    assert.equal(new URL(reference.bookUrl).protocol, "https:");
    assert.ok(!/[?&](utm_|ref=|tag=)/i.test(reference.bookUrl));
  }
}
assert.deepEqual([...ids].sort(), [...REQUIRED_COURSE_IDS].sort());

for (const [courseId, materialsUrl] of Object.entries(MATERIAL_URLS)) {
  assert.ok(ids.has(courseId), `Unknown materials course: ${courseId}`);
  assert.match(materialsUrl, /^https:\/\/drive\.google\.com\/drive\/folders\/[\w-]+/, `Invalid Google Drive folder URL for ${courseId}`);
}

const publicReferences = COURSES.flatMap(({ references }) => references);
assert.equal(publicReferences.length, 19, "Expected every identifiable source book to be publicly cited");

const connectionKeys = new Set();
for (const { fromId, toId, reason } of CONNECTIONS) {
  assert.ok(ids.has(fromId), `Unknown connection source: ${fromId}`);
  assert.ok(ids.has(toId), `Unknown connection target: ${toId}`);
  assert.notEqual(fromId, toId, "A course cannot connect to itself");
  assert.ok(reason.trim(), "Every connection needs a public reason");
  const key = [fromId, toId].sort().join("::");
  assert.ok(!connectionKeys.has(key), `Duplicate connection: ${key}`);
  connectionKeys.add(key);
}

const serialisedCourses = JSON.stringify(COURSES);
assert.doesNotMatch(serialisedCourses, /[A-Z]:\\|\.pdf|lecture notes|course planner/i);

const publicRuntimeSources = await Promise.all([
  "index.html",
  "assets/app.js",
  "data/courses.js",
  "data/connections.js"
].map((file) => readFile(new URL(`../${file}`, import.meta.url), "utf8")));
assert.doesNotMatch(
  publicRuntimeSources.join("\n"),
  /[A-Z]:\\|\.pdf|lecture notes|course planner/i,
  "Public runtime sources must not expose restricted material locations or names"
);
