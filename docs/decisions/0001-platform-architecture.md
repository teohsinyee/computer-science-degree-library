# ADR 0001: Static public frontend with Firebase learning state

**Status:** Accepted on 2026-08-09

## Context

The platform must be public and hosted on GitHub Pages. Anyone should be able to browse courses and begin tracking chapter progress without an account. Learners who want cross-device progress must be able to sign in later. Course pages also need a public, privacy-preserving learner-view count.

## Decision

- Use GitHub Pages for the static course catalogue and interface.
- Use Firebase Authentication with Google sign-in for optional learner accounts.
- Keep unsigned-in progress in the browser first.
- Merge local completed chapters into the learner's private cloud progress after sign-in.
- Use Firebase-backed server-side logic for public learner-view counts.
- Store only course metadata and Google Drive folder URLs in the site catalogue.
- Keep all course files and access decisions in Google Drive.

## Consequences

- The public site remains fast and inexpensive to host.
- Learners can start without signup friction.
- Firebase setup and security rules are required before progress syncing and counts can go live.
- Public counts are approximate anonymous-browser counts, not identity-based analytics.
- A Drive permission error is handled by Google Drive, not by the website.
