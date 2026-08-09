export function normalise(value) {
  return value.trim().toLowerCase();
}

export function filterCourses(courses, query, category) {
  const searchText = normalise(query);
  const selectedCategory = normalise(category);

  return courses.filter((course) => {
    const matchesCategory = selectedCategory === "all" || normalise(course.category) === selectedCategory;
    const searchableText = [course.id, course.title, course.category, course.summary, ...course.topics].join(" ");

    return matchesCategory && normalise(searchableText).includes(searchText);
  });
}

export function getCourseIdFromHash(hash) {
  const match = /^#course\/([A-Z]+\d+|ACCOUNTING)$/.exec(hash);
  return match?.[1] ?? null;
}

export function formatReference(reference) {
  const details = [reference.edition, reference.year].filter(Boolean).join(", ");
  return `${reference.id} · ${reference.authors.join(", ")} — ${reference.title}${details ? ` (${details})` : ""}`;
}

export function getConnectionsForCourse(courseId, connections) {
  return connections.filter(({ fromId, toId }) => fromId === courseId || toId === courseId);
}

export function getConnectedCourseIds(courseId, connections) {
  return getConnectionsForCourse(courseId, connections)
    .map(({ fromId, toId }) => (fromId === courseId ? toId : fromId));
}
