# Invited Learner Materials and Atlas UX Design

## Goal

Let any visitor use the public Knowledge City Atlas to understand a course, while giving invited learners a direct, clearly described path to that course's Google Drive materials. Google Drive remains the only authority that grants or denies material access.

## Access model

The public site shows a course-material section only when the course has an owner-configured Google Drive folder URL. It contains this copy:

> **Course materials**  
> Available to invited learners through Google Drive. Sign in with the Google account that has been granted access.

The action reads **View course materials ↗** and opens the exact course folder in a new tab.

The URL may be visible in the public static site. It is a navigation convenience, not a credential or security boundary. A person without Drive permission may reach a Drive access-denied or access-request page; the site must not claim the person has access or implement a duplicate permission system.

The site must never publish material files, lecture-note filenames, planner contents, Drive credentials, or direct downloads.

## Data

`Course.materialsUrl` is either `null` or one approved HTTPS Google Drive folder URL. It must be a folder link, not a file download link. Course data still contains only public metadata, chapter titles, reference citations, and the optional folder URL.

When `materialsUrl` is null, the detail panel shows no materials action and does not show an unavailable or broken button.

## Atlas UX corrections

The district controls must remain readable and individually selectable at 320px, 768px, and wide desktop widths. A deliberate horizontal scroll row is acceptable on small screens, but filters may not overlap or conceal one another.

The site header remains pinned while the visitor scrolls. Its height is accounted for by anchor targets, detail panels, and the mobile dialog so it never covers active content or keyboard focus.

## Out of scope

- Firebase authentication, website allowlists, and website-based Drive permission checks.
- Hosting or proxying course material files from GitHub Pages.
- Changing Google Drive permissions from the website.

## Acceptance criteria

- A course with an approved folder URL displays the invited-learner explanation and `View course materials ↗`.
- A course without a folder URL displays neither a material action nor a broken state.
- The material action opens the configured HTTPS folder URL in a new tab with safe external-link attributes.
- The public runtime contains no course files, notes, planners, credentials, or direct downloads.
- No district filter overlaps another at 320px, 768px, or 1440px+.
- The header stays visible while scrolling without obscuring anchors, focus, or mobile detail content.
