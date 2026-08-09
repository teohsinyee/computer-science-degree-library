# ADR 0002: Public course map, restricted materials

**Status:** Accepted on 2026-08-09

## Context

The site helps anyone understand the degree's course topics and key readings. The underlying course materials are for a known group of people and will be stored in Google Drive.

## Decision

- Keep each course code as a secondary historical label. Show the course title as the primary public label.
- Describe the site as a personal historical course library, not an official university catalogue.
- Publish course titles, categories, high-level topics, ordered chapter titles, and bibliographic reference entries.
- Cite every reference book by author and title, with edition and year when known. `R##` is an internal reading-order identifier, not the citation itself.
- Do not publish course files, raw file listings, lecture slides, scans, planner contents, textbook PDFs, or direct public downloads.
- Keep one restricted Google Drive folder link per course. Access remains controlled by the folder's Google Drive permissions.

## Consequences

- Public visitors can discover what was studied and which books support deeper learning without gaining access to the material collection.
- People granted access by the owner can use the same course page to open the protected Drive folder.
- A link alone does not make materials public: the Drive folder must remain restricted to specific people and be reviewed after uploads.
- This boundary reduces accidental public disclosure, but it does not replace checking the ownership, licence, and university terms for each uploaded file.
