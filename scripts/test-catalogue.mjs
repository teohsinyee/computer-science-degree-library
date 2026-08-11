import assert from "node:assert/strict";
import {
  filterCourses,
  formatReference,
  getConnectedCourseIds,
  getConnectionsForCourse,
  getCourseIdFromHash,
  normalise
} from "../assets/catalogue.js";
import { CONNECTIONS } from "../data/connections.js";

const courses = [
  {
    id: "CSE241", title: "Foundations of Software Engineering",
    category: "Software Engineering", summary: "Engineering practice",
    topics: ["Requirements"], chapters: [], references: [], materialsUrl: null
  },
  {
    id: "CPT212", title: "Design and Analysis of Algorithms",
    category: "Programming and Algorithms", summary: "Complexity analysis",
    topics: ["Graph Algorithms"], chapters: [], references: [], materialsUrl: null
  }
];

assert.equal(normalise("  ReQuIrEmEnTs  "), "requirements");
for (const { name, query, category, expectedIds } of [
  { name: "id", query: "cse241", category: "All", expectedIds: ["CSE241"] },
  { name: "title", query: "foundations of software engineering", category: "All", expectedIds: ["CSE241"] },
  { name: "summary", query: "engineering practice", category: "All", expectedIds: ["CSE241"] },
  { name: "category text", query: "software engineering", category: "All", expectedIds: ["CSE241"] },
  { name: "topic", query: "requirements", category: "All", expectedIds: ["CSE241"] },
  { name: "case-insensitive category", query: "", category: "sOfTwArE eNgInEeRiNg", expectedIds: ["CSE241"] },
  { name: "explicit All", query: "", category: "All", expectedIds: ["CSE241", "CPT212"] }
]) {
  assert.deepEqual(filterCourses(courses, query, category).map(({ id }) => id), expectedIds, name);
}

assert.equal(getCourseIdFromHash("#course/CSE241"), "CSE241");
assert.equal(getCourseIdFromHash("#changelog"), null);
assert.equal(getCourseIdFromHash("#filters"), null);
assert.equal(
  formatReference({ id: "R01", authors: ["Ian Sommerville"], title: "Software Engineering", edition: "10th ed.", year: 2016 }),
  "R01 · Ian Sommerville — Software Engineering (10th ed., 2016)"
);
assert.equal(
  formatReference({ id: "R02", authors: ["Ada Lovelace"], title: "Notes" }),
  "R02 · Ada Lovelace — Notes"
);

assert.deepEqual(
  getConnectedCourseIds("CSE241", CONNECTIONS),
  ["CSE441", "CPT341"],
  "connections are available from the source course"
);
assert.deepEqual(
  getConnectedCourseIds("CSE441", CONNECTIONS),
  ["CSE241"],
  "connections are available from the target course"
);
assert.equal(
  getConnectionsForCourse("CSE241", CONNECTIONS)[0].reason,
  "Software processes and quality assurance share engineering practice."
);
