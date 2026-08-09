export const GUEST_PROGRESS_KEY = "knowledge-city.guest-progress.v1";

const EMPTY_PROGRESS = Object.freeze({ version: 1, courses: Object.freeze({}) });

function emptyProgress() {
  return { version: EMPTY_PROGRESS.version, courses: {} };
}

function isProgressRecord(value) {
  return value
    && value.version === 1
    && value.courses
    && typeof value.courses === "object"
    && !Array.isArray(value.courses);
}

export function loadGuestProgress(storage) {
  try {
    const value = storage?.getItem(GUEST_PROGRESS_KEY);
    if (!value) return emptyProgress();
    const parsed = JSON.parse(value);
    if (!isProgressRecord(parsed)) return emptyProgress();

    const courses = Object.fromEntries(Object.entries(parsed.courses)
      .filter(([, record]) => record
        && Array.isArray(record.completedChapterIds)
        && typeof record.updatedAt === "string")
      .map(([courseId, record]) => [courseId, {
        completedChapterIds: [...new Set(record.completedChapterIds.filter((chapterId) => typeof chapterId === "string"))],
        updatedAt: record.updatedAt
      }]));

    return { version: 1, courses };
  } catch {
    return emptyProgress();
  }
}

export function saveGuestProgress(storage, progress) {
  storage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));
}

export function toggleChapter(progress, courseId, chapterId, now) {
  const existing = progress.courses[courseId] ?? { completedChapterIds: [] };
  const completed = new Set(existing.completedChapterIds);
  if (completed.has(chapterId)) completed.delete(chapterId);
  else completed.add(chapterId);

  return {
    version: 1,
    courses: {
      ...progress.courses,
      [courseId]: {
        completedChapterIds: [...completed],
        updatedAt: now
      }
    }
  };
}

export function getCourseProgress(progress, course) {
  const chapterIds = new Set(course.chapters.map(({ id }) => id));
  const completedChapterIds = (progress.courses[course.id]?.completedChapterIds ?? [])
    .filter((chapterId) => chapterIds.has(chapterId));
  const nextChapter = course.chapters.find(({ id }) => !completedChapterIds.includes(id));

  return {
    completedCount: completedChapterIds.length,
    totalCount: course.chapters.length,
    nextChapterId: nextChapter?.id ?? null
  };
}

export function getJournalCourses(progress, courses) {
  return courses
    .map((course) => ({
      ...course,
      ...getCourseProgress(progress, course),
      updatedAt: progress.courses[course.id]?.updatedAt ?? ""
    }))
    .filter(({ completedCount, totalCount }) => completedCount > 0 && completedCount < totalCount)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}
