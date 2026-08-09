import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../assets/styles.css", import.meta.url), "utf8");

assert.match(html, /id=["']atlas["']/);
assert.match(html, /id=["']journal["']/);
assert.match(html, /id=["']pathways["']/);
assert.match(html, /class=["'][^"']*atlas-hero/);
assert.match(html, /class=["'][^"']*city-map/);
assert.match(html, /id=["']about["']/);
assert.match(css, /\.course-grid\s*{[\s\S]*display:\s*grid/);
assert.match(css, /\.course-card\s*{[\s\S]*border:/);
assert.match(css, /\.map-network/);
assert.match(css, /@media \(max-width: 899px\)/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /\.site-header\s*{[\s\S]*position:\s*sticky/, "Header must remain available while scrolling");
assert.match(css, /\.site-header\s*{[\s\S]*z-index:/, "Sticky header needs a stable stacking layer");
assert.match(css, /\.category-filters\s*{[\s\S]*display:\s*flex/, "District controls must use a non-overlapping flex layout");
assert.match(css, /\.district\s*{[\s\S]*flex:\s*0 0 auto/, "Each district control must retain its own width");
assert.match(css, /#atlas, #journal\s*{[\s\S]*scroll-margin-top:/, "Anchors must clear the sticky header");
