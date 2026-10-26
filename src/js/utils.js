/** Format a number for UI display without changing the underlying value. */
export function formatNumber(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value) || 0);
}

export function formatCompact(value) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(Number(value) || 0);
}

export function formatPercent(value, digits = 1) {
  return `${(Number(value) || 0).toFixed(digits)}%`;
}

export function formatDate(dateString, options = { month: "short", day: "numeric" }) {
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function escapeCsvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(rows, columns) {
  if (!Array.isArray(rows) || rows.length === 0) return `${columns.map((column) => escapeCsvCell(column.label)).join(",")}\r\n`;
  const header = columns.map((column) => escapeCsvCell(column.label)).join(",");
  const body = rows.map((row) => columns.map((column) => escapeCsvCell(row[column.key])).join(","));
  return [header, ...body].join("\r\n") + "\r\n";
}

export function filterPosts(items, { query = "", platform = "all", status = "all" } = {}) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return items.filter((post) => {
    const matchesQuery = !normalizedQuery || [post.title, post.platform, post.id, post.type].some((value) => String(value).toLocaleLowerCase().includes(normalizedQuery));
    const matchesPlatform = platform === "all" || post.platform === platform;
    const matchesStatus = status === "all" || post.status === status;
    return matchesQuery && matchesPlatform && matchesStatus;
  });
}
