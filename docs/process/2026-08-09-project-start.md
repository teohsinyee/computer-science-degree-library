# Project start — 2026-08-09

## Why this exists

The platform replaces searching local folders when someone needs to answer, “What did you learn in your Computer Science degree?” or needs to recover a concept for revision.

It has two audiences:

1. Public visitors who want to explore the course collection.
2. Learners who want to revisit chapters and continue their own progress.

## Decisions captured so far

| Area | Decision |
| --- | --- |
| Hosting | GitHub Pages |
| Course materials | One protected Google Drive folder link per course |
| Access control | Google Drive decides who can open materials |
| Learning progress | Start immediately in the browser; offer Google sign-in later for cross-device sync |
| Public progress | Each signed-in learner sees only their own progress |
| Reference books | Show the main `R##` reference books separately on every course page |
| Public interest | Show anonymous learner counts, e.g. `1,284 learners explored this course` |
| Course relationships | Backlog; relationship meaning has not been decided yet |
| Product identity | Neutral course-learning platform; no personal or university branding |
| Visual direction | Light map-inspired interface with coloured subject districts |
| Course-material button | `View All Course Materials ↗` with a small note that it opens the Google Drive folder |

## Visual work completed

Two visual explorations were created:

1. Dark map-inspired course explorer.
2. Light map-inspired course explorer.

The light version was chosen. The visual language may remain map-inspired, but the user-facing product must not use names such as “Computer Science Atlas” or “Knowledge City”.

## Current content state

The organised course collection has 33 courses in 8 subject categories. Lecture notes are flattened into each course folder, numbered by reading order. Reference books begin with `R##`.

## Open decisions

- Exact public product name, if one is needed at all.
- Course-relationship definitions and the visual map.
- Exact Firebase project and Google Drive folder URLs.
- Which course metadata from planners should be displayed publicly.
