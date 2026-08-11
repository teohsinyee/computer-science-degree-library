export function isChangelogHash(hash) {
  return hash === "#changelog";
}

export function filterChangelogEntries(entries, type, category) {
  return entries.filter((entry) => {
    const matchesType = type === "All" || entry.type === type;
    const matchesCategory = category === "All" || entry.category === category;
    return matchesType && matchesCategory;
  });
}

export function groupEntriesByMonth(entries) {
  const sortedEntries = [...entries].sort((left, right) => right.date.localeCompare(left.date));
  const groups = new Map();

  for (const entry of sortedEntries) {
    const key = entry.date.slice(0, 7);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label: new Intl.DateTimeFormat("en", {
          month: "long",
          year: "numeric",
          timeZone: "UTC"
        }).format(new Date(`${key}-01T00:00:00Z`)),
        entries: []
      });
    }
    groups.get(key).entries.push(entry);
  }

  return [...groups.values()];
}
