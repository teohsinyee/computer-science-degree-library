import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
for (const fragment of [
  '<input id="course-search"',
  'id="category-filters"',
  'id="result-summary"',
  'id="course-grid"',
  '<aside id="course-detail"'
]) assert.ok(html.includes(fragment), `Missing ${fragment}`);
