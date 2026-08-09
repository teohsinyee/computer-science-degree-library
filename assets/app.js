import { CATEGORIES, COURSES } from "../data/courses.js";
import { filterCourses, formatReference, getCourseIdFromHash } from "./catalogue.js";

const searchInput = document.querySelector("#course-search");
const categoryFilters = document.querySelector("#category-filters");
const resultSummary = document.querySelector("#result-summary");
const courseGrid = document.querySelector("#course-grid");
const courseDetail = document.querySelector("#course-detail");

let selectedCategory = "All";

function appendTextElement(parent, tagName, text, className) {
  const element = document.createElement(tagName);
  element.textContent = text;
  if (className) element.className = className;
  parent.append(element);
  return element;
}

function renderCategories() {
  categoryFilters.replaceChildren();

  for (const category of ["All", ...CATEGORIES]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "district";
    button.textContent = category;
    button.setAttribute("aria-pressed", String(category === selectedCategory));
    button.addEventListener("click", () => {
      selectedCategory = category;
      renderCategories();
      renderCourses();
    });
    categoryFilters.append(button);
  }
}

function selectCourse(course) {
  window.location.hash = `course/${course.id}`;
}

function renderCourses() {
  const courses = filterCourses(COURSES, searchInput.value, selectedCategory);
  courseGrid.replaceChildren();

  if (courses.length === 0) {
    resultSummary.textContent = "No courses match this search.";
    return;
  }

  resultSummary.textContent = `${courses.length} course${courses.length === 1 ? "" : "s"} found.`;
  for (const course of courses) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "course-card";
    card.addEventListener("click", () => selectCourse(course));
    appendTextElement(card, "span", course.title, "course-card-title");
    appendTextElement(card, "span", course.id, "course-card-id");
    appendTextElement(card, "span", course.category, "course-card-category");
    courseGrid.append(card);
  }
}

function closeDetail() {
  if (getCourseIdFromHash(window.location.hash)) window.history.back();
}

function appendReference(referenceList, reference) {
  const item = document.createElement("li");
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

function renderDetail() {
  const courseId = getCourseIdFromHash(window.location.hash);
  const course = COURSES.find(({ id }) => id === courseId);
  courseDetail.replaceChildren();
  courseDetail.dataset.open = String(Boolean(course));

  if (!course) return;

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "Back to courses";
  closeButton.addEventListener("click", closeDetail);
  courseDetail.append(closeButton);
  appendTextElement(courseDetail, "p", course.id, "course-detail-id");
  appendTextElement(courseDetail, "h2", course.title);
  appendTextElement(courseDetail, "p", course.category);
  appendTextElement(courseDetail, "p", course.summary);

  appendTextElement(courseDetail, "h3", "Topics");
  const topics = document.createElement("ul");
  for (const topic of course.topics) appendTextElement(topics, "li", topic);
  courseDetail.append(topics);

  appendTextElement(courseDetail, "h3", "Chapters");
  const chapters = document.createElement("ol");
  for (const chapter of course.chapters) appendTextElement(chapters, "li", chapter.title);
  courseDetail.append(chapters);

  if (course.references.length > 0) {
    appendTextElement(courseDetail, "h3", "References");
    const references = document.createElement("ul");
    for (const reference of course.references) appendReference(references, reference);
    courseDetail.append(references);
  }
}

searchInput.addEventListener("input", renderCourses);
window.addEventListener("hashchange", renderDetail);

renderCategories();
renderCourses();
renderDetail();
