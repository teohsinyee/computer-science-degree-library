import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { CATEGORIES, COURSES, REQUIRED_COURSE_IDS } from "../data/courses.js";
import { CONNECTIONS } from "../data/connections.js";
import { MATERIAL_URLS } from "../data/materials.js";

assert.equal(CATEGORIES.length, 8, "Expected eight categories");
assert.equal(COURSES.length, 33, "CMT425 must appear in the public catalogue with its course materials");

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
assert.ok(!ids.has("CAT201") && !ids.has("CAT304"), "Planner-only courses must be excluded from the public catalogue");

const plannerChapterCounts = {
  CPT341: 7,
  CSE241: 14,
  CSE441: 8,
  CSE442: 7,
  CMT425: 14,
  CMT221: 11,
  CMT321: 11,
  CMT427: 11,
  CPC351: 8,
  CPC451: 8
};
for (const [courseId, expectedChapterCount] of Object.entries(plannerChapterCounts)) {
  const course = COURSES.find(({ id }) => id === courseId);
  assert.equal(course.chapters.length, expectedChapterCount, `${courseId} must use its course-planner topic count`);
  assert.ok(course.chapters.every(({ subtopics }) => Array.isArray(subtopics)), `${courseId} chapters must preserve planner subtopics`);
}
assert.deepEqual(
  COURSES.find(({ id }) => id === "CSE241").chapters[0].subtopics,
  ["Professional software development", "Software engineering ethics"],
  "CSE241 must preserve the subtopics from its course planner"
);
assert.deepEqual(
  COURSES.find(({ id }) => id === "CSE442").chapters[0].subtopics,
  ["Principles of testing", "Fundamental test process", "Test cases, expected results and test oracles", "Psychology of testing", "Ethics of testing"],
  "CSE442 must preserve the Fundamentals subtopics extracted from lecture materials"
);
assert.deepEqual(
  COURSES.find(({ id }) => id === "CMT425").chapters[0].subtopics,
  ["The importance of IT in business", "Modern organizations as socio-technical systems of business and IT", "Business and IT alignment", "Enterprise architecture as a solution to the alignment problem"],
  "CMT425 must preserve the first chapter outline from its course materials"
);
assert.deepEqual(
  COURSES.find(({ id }) => id === "CMT221").chapters[0].subtopics,
  ["Data vs. information", "Introducing the database", "Evolution of file system data processing", "Database systems"],
  "CMT221 must preserve the Database Systems subtopics from its course planner"
);
assert.deepEqual(
  COURSES.find(({ id }) => id === "CPC451").chapters[4].subtopics,
  ["MongoDB", "Cassandra", "Neo4j", "Amazon DynamoDB"],
  "CPC451 must consolidate repeated planner weeks into one Database for Big Data revision chapter"
);

for (const [courseId, materialsUrl] of Object.entries(MATERIAL_URLS)) {
  assert.ok(ids.has(courseId), `Unknown materials course: ${courseId}`);
  assert.match(materialsUrl, /^https:\/\/drive\.google\.com\/drive\/folders\/[\w-]+/, `Invalid Google Drive folder URL for ${courseId}`);
}

const publicReferences = COURSES.flatMap(({ references }) => references);
assert.equal(publicReferences.length, 30, "Expected all Data and Databases main reference books to be publicly cited");
for (const [courseId, expectedReferenceCount] of Object.entries({ CMT221: 1, CMT321: 3, CMT427: 3, CPC351: 2, CPC451: 4 })) {
  assert.equal(COURSES.find(({ id }) => id === courseId).references.length, expectedReferenceCount, `${courseId} must cite its planner main references`);
}

assert.equal(Object.keys(MATERIAL_URLS).length, 30, "CMT425 must expose its verified Drive materials link");
assert.ok(!MATERIAL_URLS.CAT201 && !MATERIAL_URLS.CAT304, "Planner-only courses must not expose Drive links");
assert.deepEqual(
  REQUIRED_COURSE_IDS.filter((courseId) => !MATERIAL_URLS[courseId]).sort(),
  ["ACCOUNTING", "WCC110", "WUS101"],
  "Only courses without a discovered Drive folder may omit a materials URL"
);

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
