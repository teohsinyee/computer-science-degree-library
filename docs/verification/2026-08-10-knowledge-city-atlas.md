# Knowledge City Atlas verification — 2026-08-10

## Automated checks

```text
npm test
npm run validate:data
node scripts/validate-shell.mjs
npm run validate:visual
git diff --check
```

All commands passed after the guest-progress implementation.

## Browser checks

Using a local static server at `http://localhost:4173`:

- The desktop Atlas loaded 33 courses across 8 districts.
- Selecting CSE241 opened the course detail with topics, two labelled learning connections, three chapters, and four cited reference books.
- Marking Chapter 01 complete wrote `knowledge-city.guest-progress.v1` to browser local storage.
- After a reload, CSE241 still showed `1/3` revision and Journal showed `Continue revision` for Chapter 02.
- At 390px wide, the course detail became a usable modal dialog with a visible close button and retained the checked chapter state.

## Privacy boundary checked

- Runtime source validation rejects Drive links, Windows paths, PDFs, lecture-note labels, and course-planner labels.
- The visible reference shelf contains citation metadata and external book-detail links, not source files.
- Guest progress is local to the browser and has no network sync in this release.
