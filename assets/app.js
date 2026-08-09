import { CATEGORIES, COURSES } from "../data/courses.js";
import { CONNECTIONS } from "../data/connections.js";
import {
  filterCourses,
  formatReference,
  getConnectedCourseIds,
  getCourseIdFromHash
} from "./catalogue.js";
import {
  getCourseProgress,
  getJournalCourses,
  loadGuestProgress,
  saveGuestProgress,
  toggleChapter
} from "./progress.js";

const atlas = document.querySelector("#atlas");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#course-search");
const categoryFilters = document.querySelector("#category-filters");
const resultSummary = document.querySelector("#result-summary");
const courseGrid = document.querySelector("#course-grid");
const courseDetail = document.querySelector("#course-detail");
const journalContent = document.querySelector("#journal-content");
const pathwaysButton = document.querySelector("#pathways");
const aboutButton = document.querySelector("#about");
const aboutDialog = document.querySelector("#about-dialog");
const detailBreakpoint = window.matchMedia("(max-width: 899px)");

let selectedCategory = "All";
let detailInvoker = null;
let wasDetailOpen = false;
let pathwaysEnabled = false;
let progressSaveNotice = "";

function getBrowserStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const guestStorage = getBrowserStorage();
let guestProgress = loadGuestProgress(guestStorage);

function categoryKey(category) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function appendTextElement(parent, tagName, text, className) {
  const element = document.createElement(tagName);
  element.textContent = text;
  if (className) element.className = className;
  parent.append(element);
  return element;
}

function createCategoryControls() {
  categoryFilters.replaceChildren();
  for (const category of ["All", ...CATEGORIES]) {
    const button = document.createElement("button");
    const key = category === "All" ? "all" : categoryKey(category);
    button.type = "button";
    button.className = `district district-${key}`;
    button.dataset.category = category;
    button.dataset.count = String(category === "All" ? COURSES.length : COURSES.filter((course) => course.category === category).length);
    button.textContent = category === "All" ? "All districts" : category;
    button.addEventListener("click", () => {
      selectedCategory = category;
      updateCategoryControls();
      renderCourses();
    });
    categoryFilters.append(button);
  }
}

function updateCategoryControls() {
  for (const button of categoryFilters.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.category === selectedCategory));
  }
}

function selectedCourseId() {
  return getCourseIdFromHash(window.location.hash);
}

function selectCourse(course, invoker = null) {
  detailInvoker = invoker;
  const nextHash = `#course/${course.id}`;
  if (window.location.hash === nextHash) {
    renderCourses();
    renderDetail({ focusDetail: true });
  } else {
    window.location.hash = nextHash;
  }
}

function renderCourses() {
  const courses = filterCourses(COURSES, searchInput.value, selectedCategory);
  const activeCourseId = selectedCourseId();
  const connectedCourseIds = pathwaysEnabled && activeCourseId
    ? new Set(getConnectedCourseIds(activeCourseId, CONNECTIONS))
    : new Set();

  courseGrid.replaceChildren();
  atlas.classList.toggle("pathway-mode", pathwaysEnabled);

  if (courses.length === 0) {
    resultSummary.textContent = "No courses match this search. Try a different topic or district.";
    return;
  }

  resultSummary.textContent = `${courses.length} course${courses.length === 1 ? "" : "s"} in view.`;
  for (const course of courses) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `course-card category-${categoryKey(course.category)}`;
    card.dataset.selected = String(course.id === activeCourseId);
    card.dataset.connected = String(connectedCourseIds.has(course.id));
    card.setAttribute("aria-label", `${course.title}, ${course.id}, ${course.category}`);
    card.addEventListener("click", () => selectCourse(course, card));
    appendTextElement(card, "span", course.id, "course-card-id");
    appendTextElement(card, "span", course.title, "course-card-title");
    appendTextElement(card, "span", course.category, "course-card-category");
    courseGrid.append(card);
  }
}

function closeDetail() {
  if (selectedCourseId()) window.location.hash = "";
}

function isMobileDetail() {
  return detailBreakpoint.matches;
}

function appendReference(referenceList, reference) {
  const item = document.createElement("li");
  item.className = "reference-item";
  appendTextElement(item, "p", formatReference(reference));

  if (reference.bookUrl.startsWith("https://")) {
    const link = document.createElement("a");
    link.href = reference.bookUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Find this book ↗";
    item.append(link);
  }

  referenceList.append(item);
}

function appendMetric(metrics, value, label) {
  const metric = document.createElement("div");
  appendTextElement(metric, "strong", value);
  appendTextElement(metric, "span", label);
  metrics.append(metric);
}

function saveProgress() {
  try {
    saveGuestProgress(guestStorage, guestProgress);
    progressSaveNotice = "";
  } catch {
    progressSaveNotice = "Progress will remain for this tab, but this browser could not save it.";
  }
}

function appendChapters(course) {
  appendTextElement(courseDetail, "h3", "Chapters", "detail-section-title");
  const chapters = document.createElement("ol");
  chapters.className = "chapter-list";
  const completedChapterIds = new Set(guestProgress.courses[course.id]?.completedChapterIds ?? []);

  for (const chapter of course.chapters) {
    const item = document.createElement("li");
    const label = document.createElement("label");
    label.className = "chapter-label";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `chapter-${course.id}-${chapter.id}`;
    checkbox.checked = completedChapterIds.has(chapter.id);
    checkbox.addEventListener("change", () => {
      guestProgress = toggleChapter(guestProgress, course.id, chapter.id, new Date().toISOString());
      saveProgress();
      renderDetail({ focusSelector: `#chapter-${course.id}-${chapter.id}` });
      renderJournal();
    });
    const text = document.createElement("span");
    text.textContent = `${chapter.id} · ${chapter.title}`;
    label.append(checkbox, text);
    item.append(label);
    if (chapter.subtopics.length > 0) {
      const subtopics = document.createElement("ul");
      subtopics.className = "chapter-subtopics";
      for (const subtopic of chapter.subtopics) appendTextElement(subtopics, "li", subtopic);
      item.append(subtopics);
    }
    chapters.append(item);
  }
  courseDetail.append(chapters);

  if (progressSaveNotice) {
    const notice = appendTextElement(courseDetail, "p", progressSaveNotice, "progress-notice");
    notice.setAttribute("role", "status");
  }
}

function appendMaterials(course) {
  if (!course.materialsUrl) return;

  appendTextElement(courseDetail, "h3", "Course materials", "detail-section-title");
  appendTextElement(
    courseDetail,
    "p",
    "Available to invited learners through Google Drive. Sign in with the Google account that has been granted access.",
    "materials-copy"
  );
  const link = document.createElement("a");
  link.className = "materials-link";
  link.href = course.materialsUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View course materials ↗";
  courseDetail.append(link);
}

function renderJournal() {
  journalContent.replaceChildren();
  const courses = getJournalCourses(guestProgress, COURSES);
  if (courses.length === 0) {
    appendTextElement(journalContent, "p", "No revision in progress yet. Choose a course in Atlas and tick a chapter when you finish it.", "journal-empty");
    return;
  }

  for (const course of courses) {
    const entry = document.createElement("article");
    entry.className = "journal-entry";
    appendTextElement(entry, "p", course.id, "journal-course-id");
    appendTextElement(entry, "h3", course.title);
    appendTextElement(entry, "p", `${course.completedCount}/${course.totalCount} chapters complete · next: ${course.nextChapterId}`, "journal-progress");
    const continueButton = document.createElement("button");
    continueButton.type = "button";
    continueButton.textContent = "Continue revision";
    continueButton.addEventListener("click", () => {
      document.querySelector("#atlas").scrollIntoView({ behavior: "smooth" });
      selectCourse(course);
    });
    entry.append(continueButton);
    journalContent.append(entry);
  }
}

function renderDetail({ focusDetail = false, focusSelector = null } = {}) {
  const courseId = selectedCourseId();
  const course = COURSES.find(({ id }) => id === courseId);
  courseDetail.replaceChildren();
  courseDetail.dataset.open = String(Boolean(course));

  if (!course) {
    courseDetail.removeAttribute("role");
    courseDetail.removeAttribute("aria-modal");
    courseDetail.removeAttribute("aria-labelledby");
    if (wasDetailOpen) (detailInvoker?.isConnected ? detailInvoker : searchInput).focus();
    detailInvoker = null;
    wasDetailOpen = false;
    return;
  }

  wasDetailOpen = true;
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "detail-close";
  closeButton.setAttribute("aria-label", "Back to courses");
  closeButton.textContent = "×";
  closeButton.addEventListener("click", closeDetail);
  courseDetail.append(closeButton);

  const heading = document.createElement("div");
  heading.className = `detail-heading category-${categoryKey(course.category)}`;
  appendTextElement(heading, "p", course.id, "course-detail-id");
  const title = appendTextElement(heading, "h2", course.title);
  title.id = "course-detail-title";
  courseDetail.append(heading);
  appendTextElement(courseDetail, "p", course.summary, "course-summary");

  const metrics = document.createElement("div");
  metrics.className = "course-metrics";
  const progress = getCourseProgress(guestProgress, course);
  appendMetric(metrics, String(course.chapters.length), "chapters");
  appendMetric(metrics, String(course.references.length), "reference books");
  appendMetric(metrics, `${progress.completedCount}/${progress.totalCount}`, "revision");
  courseDetail.append(metrics);

  appendTextElement(courseDetail, "h3", "Topics", "detail-section-title");
  const topics = document.createElement("ul");
  topics.className = "topic-list";
  for (const topic of course.topics) appendTextElement(topics, "li", topic);
  courseDetail.append(topics);

  appendChapters(course);

  appendMaterials(course);

  if (course.references.length > 0) {
    appendTextElement(courseDetail, "h3", "Reference shelf", "detail-section-title");
    const references = document.createElement("ul");
    references.className = "reference-list";
    for (const reference of course.references) appendReference(references, reference);
    courseDetail.append(references);
  }

  if (isMobileDetail()) {
    courseDetail.setAttribute("role", "dialog");
    courseDetail.setAttribute("aria-modal", "true");
    courseDetail.setAttribute("aria-labelledby", title.id);
  } else {
    courseDetail.removeAttribute("role");
    courseDetail.removeAttribute("aria-modal");
    courseDetail.removeAttribute("aria-labelledby");
  }

  if (focusSelector) courseDetail.querySelector(focusSelector)?.focus();
  else if (isMobileDetail() || focusDetail) closeButton.focus();
}

courseDetail.addEventListener("keydown", (event) => {
  if (!isMobileDetail() || courseDetail.dataset.open !== "true") return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeDetail();
    return;
  }
  if (event.key !== "Tab") return;

  const focusable = [...courseDetail.querySelectorAll("button:not([disabled]), a[href]")];
  const first = focusable[0];
  const last = focusable.at(-1);
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

searchForm.addEventListener("submit", (event) => event.preventDefault());
searchInput.addEventListener("input", renderCourses);
window.addEventListener("hashchange", () => {
  renderCourses();
  renderDetail();
});
detailBreakpoint.addEventListener("change", () => {
  if (courseDetail.dataset.open === "true") renderDetail({ focusDetail: true });
});
pathwaysButton.addEventListener("click", () => {
  pathwaysEnabled = !pathwaysEnabled;
  pathwaysButton.setAttribute("aria-pressed", String(pathwaysEnabled));
  renderCourses();
});
aboutButton.addEventListener("click", () => aboutDialog.showModal());
aboutDialog.querySelector(".dialog-close").addEventListener("click", () => aboutDialog.close());
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

createCategoryControls();
updateCategoryControls();
renderCourses();
renderDetail();
renderJournal();
