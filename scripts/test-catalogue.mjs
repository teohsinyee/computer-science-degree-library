import assert from "node:assert/strict";
import {
  filterCourses,
  formatReference,
  getCourseIdFromHash,
  normalise
} from "../assets/catalogue.js";

const courses = [{
  id: "CSE241", title: "Foundations of Software Engineering",
  category: "Software Engineering", summary: "Engineering practice",
  topics: ["Requirements"], chapters: [], references: [], materialsUrl: null
}];

assert.equal(normalise("  ReQuIrEmEnTs  "), "requirements");
assert.equal(filterCourses(courses, "requirements", "All").length, 1);
assert.equal(filterCourses(courses, "", "Software Engineering").length, 1);
assert.equal(getCourseIdFromHash("#course/CSE241"), "CSE241");
assert.equal(getCourseIdFromHash("#filters"), null);
assert.equal(
  formatReference({ id: "R01", authors: ["Ian Sommerville"], title: "Software Engineering", edition: "10th ed.", year: 2016 }),
  "R01 · Ian Sommerville — Software Engineering (10th ed., 2016)"
);
