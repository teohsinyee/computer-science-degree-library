import assert from "node:assert/strict";
import { CATEGORIES, COURSES, REQUIRED_COURSE_IDS } from "../data/courses.js";

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
  assert.equal(course.materialsUrl, null);
  for (const reference of course.references) {
    assert.ok(reference.id && reference.title && reference.authors.length);
    assert.equal(new URL(reference.bookUrl).protocol, "https:");
    assert.ok(!/[?&](utm_|ref=|tag=)/i.test(reference.bookUrl));
  }
}
assert.deepEqual([...ids].sort(), [...REQUIRED_COURSE_IDS].sort());

const serialisedCourses = JSON.stringify(COURSES);
assert.doesNotMatch(serialisedCourses, /[A-Z]:\\|drive\.google\.com|\.pdf|lecture notes/i);
