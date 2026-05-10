import { format, formatDistanceToNow, differenceInDays, parseISO } from "date-fns";

/**
 * Format a date string for display (e.g., "Jan 15, 2026")
 */
export function formatDate(dateString: string): string {
  return format(parseISO(dateString), "MMM d, yyyy");
}

/**
 * Format a date string for short display (e.g., "Jan 15")
 */
export function formatDateShort(dateString: string): string {
  return format(parseISO(dateString), "MMM d");
}

/**
 * Format a date string for input fields (e.g., "2026-01-15")
 */
export function formatDateForInput(dateString: string): string {
  return format(parseISO(dateString), "yyyy-MM-dd");
}

/**
 * Format a date range for display (e.g., "Jan 15 - 20, 2026")
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, "MMM d")} - ${format(end, "d, yyyy")}`;
    }
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  }
  return `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`;
}


/**
 * Get relative time (e.g., "2 hours ago")
 */
export function timeAgo(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
}

/**
 * Calculate the number of days between two dates
 */
export function daysBetween(startDate: string, endDate: string): number {
  return differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Merge class names, filtering out falsy values
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Truncate text to a given length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Generate a random slug-safe string
 */
export function generateSlug(length: number = 12): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
