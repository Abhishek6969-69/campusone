// ✅ Merge multiple classNames conditionally (for Tailwind)
export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

// ✅ Capitalize first letter of a string
export function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ✅ Format date nicely (DD/MM/YYYY or Month Day, Year)
export function formatDate(date: string | Date, locale: string = "en-US") {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ✅ Truncate long text (e.g. for note titles)
export function truncate(text: string, maxLength: number) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// ✅ Generate initials (for avatar placeholders)
export function getInitials(name: string) {
  if (!name) return "";
  const parts = name.split(" ");
  return parts.map(p => p.charAt(0).toUpperCase()).join("");
}
