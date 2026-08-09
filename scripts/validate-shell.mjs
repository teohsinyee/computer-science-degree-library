import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../assets/styles.css", import.meta.url), "utf8");

const element = (id) => new RegExp(`<([\\w-]+)\\b[^>]*\\bid=["']${id}["'][^>]*>([\\s\\S]*?)<\\/\\1>`).exec(html);
const has = (pattern, message) => assert.match(html, pattern, message);

has(/<header\b/, "Missing header landmark");
has(/<main\b/, "Missing main landmark");
has(/<nav\b[^>]*\bid=["']category-filters["'][^>]*\baria-label=/, "Missing named category navigation");
has(/<label\b[^>]*\bfor=["']course-search["']/, "Missing search label");
has(/<input\b[^>]*\bid=["']course-search["'][^>]*\btype=["']search["']/, "Missing search input");
has(/<script\b[^>]*\btype=["']module["'][^>]*\bsrc=["']assets\/app\.js["']/, "Missing app module");
has(/<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']assets\/styles\.css["']/, "Missing stylesheet");

const summary = element("result-summary");
assert.ok(summary?.[0].match(/\baria-live=["']polite["']/), "Result summary must be polite live text");

const grid = element("course-grid");
assert.ok(grid?.[0].match(/\baria-label=["'][^"']+["']/), "Course grid needs an accessible name");
assert.ok(grid?.[0].match(/\btabindex=["']0["']/), "Course grid must be keyboard reachable");

const detail = element("course-detail");
assert.ok(detail?.[0].startsWith("<aside"), "Course detail must be an aside");
assert.ok(detail?.[0].match(/\baria-label=["'][^"']+["']/), "Course detail needs an accessible name");
assert.ok(detail?.[0].match(/\bdata-open=["']false["']/), "Course detail must start closed");
assert.equal(detail?.[2].trim(), "", "Course detail must start empty");
assert.ok(detail?.[0].match(/\btabindex=["']0["']/), "Course detail must be keyboard reachable");

assert.match(css, /:focus-visible\s*{[^}]*outline:/, "Missing visible focus styling");
assert.match(css, /@media \(min-width: 900px\)\s*{[\s\S]*?\.catalogue-layout\s*{\s*grid-template-columns: minmax\(0, 1fr\) minmax\(20rem, 28rem\);/, "Missing desktop layout rule");
assert.match(css, /@media \(max-width: 899px\)\s*{[\s\S]*?\.catalogue-layout\s*{\s*display: block;/, "Missing narrow layout rule");
assert.match(css, /#course-detail\[data-open="true"\]\s*{\s*position: fixed; inset: 0; overflow: auto;/, "Missing narrow detail overlay rule");
