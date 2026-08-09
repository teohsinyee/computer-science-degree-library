import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../assets/styles.css", import.meta.url), "utf8");
const app = await readFile(new URL("../assets/app.js", import.meta.url), "utf8");

const has = (pattern, message) => assert.match(html, pattern, message);

has(/<header\b[^>]*class=["'][^"']*site-header/, "Missing site header");
has(/<main\b/, "Missing main landmark");
has(/<nav\b[^>]*aria-label=["']Primary["']/, "Missing named primary navigation");
has(/<nav\b[^>]*\bid=["']category-filters["'][^>]*aria-label=["']Course districts["']/, "Missing named district navigation");
has(/<label\b[^>]*\bfor=["']course-search["']/, "Missing search label");
has(/<form\b[^>]*\bid=["']search-form["'][^>]*\brole=["']search["']/, "Missing named search form");
has(/<input\b[^>]*\bid=["']course-search["'][^>]*\btype=["']search["']/, "Missing search input");
has(/<section\b[^>]*\bid=["']course-grid["'][^>]*\baria-label=["']Courses["']/, "Course grid needs an accessible name");
has(/<aside\b[^>]*\bid=["']course-detail["'][^>]*\baria-label=["']Course details["']/, "Course detail must be a named aside");
has(/<section\b[^>]*\bid=["']journal["']/, "Missing private Journal section");
has(/<dialog\b[^>]*\bid=["']about-dialog["']/, "Missing About dialog");
has(/<script\b[^>]*\btype=["']module["'][^>]*\bsrc=["']assets\/app\.js["']/, "Missing app module");

assert.match(css, /:focus-visible\s*{[^}]*outline:/, "Missing visible focus styling");
assert.match(css, /\.atlas-hero\s*{[\s\S]*grid-template-columns:/, "Missing desktop atlas composition");
assert.match(css, /\.atlas-layout\s*{[\s\S]*grid-template-columns:/, "Missing desktop map and detail layout");
assert.match(css, /\.course-grid\s*{[\s\S]*display:\s*grid/, "Course grid must be a visual grid");
assert.match(css, /\.course-detail-panel\[data-open="true"\]\s*{[\s\S]*position:\s*fixed/, "Missing mobile detail dialog rule");
assert.match(css, /\.course-detail-panel\[data-open="true"\]\s*{[\s\S]*margin:\s*0/, "Mobile detail must not retain desktop margin");
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/, "Missing reduced-motion support");
assert.match(app, /searchForm\.addEventListener\(["']submit["'], \(event\) => event\.preventDefault\(\)\)/, "Search must not submit and clear the query");
assert.match(app, /button\.className = `district district-\$\{key\}`/, "District buttons need visual category modifiers");
assert.match(app, /card\.setAttribute\(["']aria-label["']/, "Course cards need a separated accessible name");
assert.match(app, /Related learning connections/, "Course detail must expose connection text");
assert.match(app, /link\.rel = ["']noopener noreferrer["']/, "External book links need safe attributes");
assert.match(app, /from "\.\/progress\.js"/, "App must use the private guest-progress module");
assert.match(app, /checkbox\.type = ["']checkbox["']/, "Chapters need checkboxes");
assert.match(app, /saveGuestProgress/, "Chapter changes must attempt browser-local persistence");
assert.match(app, /Continue revision/, "Journal needs a continuation action");
assert.doesNotMatch(app, /materialsUrl/, "App must not render material links");
