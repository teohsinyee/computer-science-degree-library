export const CHANGE_TYPES = Object.freeze(["Release", "Added", "Improved", "Corrected", "Retired"]);

export const CHANGELOG_ENTRIES = Object.freeze([
  {
    date: "2026-08-11",
    type: "Improved",
    title: "Data and Databases course detail enriched",
    summary: "Added planner-based chapters, subtopics, and main reference books across five Data and Databases courses.",
    category: "Data and Databases"
  },
  {
    date: "2026-08-10",
    type: "Added",
    title: "CMT425 Enterprise Architecture and Systems added",
    summary: "Added a course overview with its planner-based chapter structure and reference shelf.",
    courseId: "CMT425",
    category: "Software Engineering"
  },
  {
    date: "2026-08-10",
    type: "Added",
    title: "CSE442 Software Testing added",
    summary: "Added a course overview with a lecture-material-based study outline.",
    courseId: "CSE442",
    category: "Software Engineering"
  },
  {
    date: "2026-08-10",
    type: "Release",
    title: "Knowledge City course library launched",
    summary: "Published the searchable course atlas with course detail, reference books, invited-learner materials access, and local revision progress."
  }
]);
