# Motion System Design

**Issue:** #14  
**Status:** Proposed  
**Date:** 2026-08-11

## Purpose

Motion is part of the reading experience and first impression of Knowledge City. It should make a change of place, filter, or learning state understandable without competing with the course content.

The result should feel editorial and responsive: restrained, quick, and calm rather than decorative or game-like.

## Design Principles

1. **Explain change.** Animate only when it helps a learner understand what changed or where content went.
2. **Keep the content primary.** No looping decoration, parallax, or animation that asks for attention while reading.
3. **Use one visual language.** Small movement, soft opacity changes, and the existing paper-map character should work together.
4. **Never delay learning.** Motion must not block clicks, keyboard use, scrolling, or the arrival of useful content.
5. **Respect learner preference.** Reduced-motion users receive the same information and interactions immediately.

## Shared Motion Tokens

| Role | Duration | Easing | Use |
| --- | --- | --- | --- |
| Feedback | 140ms | ease-out | Buttons, tags, hover/focus state |
| Content change | 180ms | ease-out | Filter results, panels, progress state |
| View change | 260ms | ease-out | Atlas, Changelog, and Journal navigation |
| Entrance stagger | 45ms, maximum 3 items | ease-out | Heading, controls, then primary content |

The motion distance is small: an opacity change with at most an 8px vertical settle. Shadows, borders, and colour may transition with the same timing where useful.

## Experience Contracts

### View navigation

Atlas, Changelog, and Journal use a short cross-fade and upward settle when switching views. When supported, the browser-native View Transitions API coordinates the outgoing and incoming views. Browsers without it still switch correctly with the CSS fallback.

The destination view reveals hierarchy in this order:

1. page heading or primary orientation;
2. navigation or filter controls; and
3. primary course, update, or journal content.

This is a single restrained sequence, not a repeated animation whenever a learner scrolls.

### Atlas

- Search and district filters briefly fade the outgoing visible course results, then reveal the updated result set.
- Course cards respond to hover, focus, and press with subtle border, shadow, and position feedback.
- Opening or closing a course detail panel softens the state change without moving the entire map abruptly.
- Empty search and filter states appear with the same content-change motion.

### Changelog

- Selecting a change-type or category filter fades the previous entries quickly, then fades and settles the replacement entries.
- The active filter uses a short colour, border, and shadow transition.
- Month headings and entries do not reanimate during unrelated control feedback.

### Journal

- Completed chapter and progress updates use a short state transition that makes the changed completion state noticeable.
- Journal entries use the content-change motion when their visible state changes.

### Shared controls

Navigation links, buttons, search controls, tags, filters, checkboxes, and course links share the feedback timing. Keyboard focus remains clear and immediate; no animated effect may conceal the focus indicator.

## Accessibility and Performance

- `prefers-reduced-motion: reduce` disables View Transition animation, entrances, movement, and stagger. State changes remain immediate or near-immediate.
- Motion uses `opacity` and `transform` where possible; it does not animate layout dimensions or force a horizontal or vertical layout shift.
- Interactive elements remain usable while a transition is active. A new action supersedes an unfinished visual transition.
- No third-party animation library is introduced unless native browser and CSS features demonstrably cannot meet this specification.

## Verification

1. Test Atlas, Changelog, and Journal navigation in a browser that supports View Transitions and a browser/fallback mode that does not.
2. Test Atlas search, district filtering, card interaction, and course panel opening/closing.
3. Test Changelog type and category filters, including rapid consecutive selections.
4. Test Journal completion feedback.
5. Test keyboard navigation and focus visibility during interaction.
6. Test `prefers-reduced-motion: reduce` and confirm no meaningful animation remains.
7. Check desktop and mobile layouts for overflow, layout shift, and readable timing.

## Out of Scope

- Decorative looping animation, scroll parallax, gamification, or attention tracking.
- Changes to course content, Google Drive access, or the site information architecture.
