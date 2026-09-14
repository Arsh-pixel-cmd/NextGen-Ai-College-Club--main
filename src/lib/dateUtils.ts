/**
 * Robust date parser and sorting utilities for Events and Content management.
 */

const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

/**
 * Parses diverse event date strings (e.g. "15 sep 26", "Nov 5, 2026", "Oct 26", "2026-09-15")
 * into a valid JavaScript Date object for reliable chronological comparison.
 */
export function parseEventDate(dateStr: string): Date {
  if (!dateStr) return new Date(0);
  const currentYear = new Date().getFullYear();
  const str = String(dateStr).trim();

  // 1. Text with month name (e.g. "15 sep 26", "Nov 5, 2026", "Oct 26", "Sep 15")
  const words = str.toLowerCase().match(/[a-z]+/g);
  const numbers = str.match(/\d+/g);

  if (words && words.length > 0 && numbers && numbers.length > 0) {
    const monthWord = words[0];
    const month = MONTH_MAP[monthWord] ?? MONTH_MAP[monthWord.slice(0, 3)];
    if (month !== undefined) {
      let day = 1;
      let year = currentYear;

      if (numbers.length >= 2) {
        const n1 = parseInt(numbers[0], 10);
        const n2 = parseInt(numbers[1], 10);

        if (n1 > 31) {
          year = n1 < 100 ? n1 + 2000 : n1;
          day = n2;
        } else if (n2 > 31) {
          year = n2 < 100 ? n2 + 2000 : n2;
          day = n1;
        } else {
          // Both <= 31 (e.g., "15 sep 26" -> n1=15, n2=26)
          day = n1;
          year = n2 < 100 ? n2 + 2000 : n2;
        }

        if (numbers[2]) {
          const y = parseInt(numbers[2], 10);
          year = y < 100 ? y + 2000 : y;
        }
      } else {
        day = parseInt(numbers[0], 10);
        year = currentYear;
      }

      return new Date(year, month, day);
    }
  }

  // 2. ISO format YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (isoMatch) {
    return new Date(
      parseInt(isoMatch[1], 10),
      parseInt(isoMatch[2], 10) - 1,
      parseInt(isoMatch[3], 10)
    );
  }

  // 3. DD/MM/YYYY or MM/DD/YYYY
  const slashMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/);
  if (slashMatch) {
    let y = parseInt(slashMatch[3], 10);
    if (y < 100) y += 2000;
    return new Date(y, parseInt(slashMatch[2], 10) - 1, parseInt(slashMatch[1], 10));
  }

  // 4. Standard Date fallback
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) return parsed;

  return new Date(0);
}

/**
 * Sorts an array of events chronologically in ascending order (earliest date first).
 */
export function sortEventsChronologically<T extends { date: string; display_order?: number }>(
  events: T[]
): T[] {
  return [...events].sort((a, b) => {
    const timeA = parseEventDate(a.date).getTime();
    const timeB = parseEventDate(b.date).getTime();

    // If both dates are valid, sort by date ascending
    if (timeA > 0 && timeB > 0 && timeA !== timeB) {
      return timeA - timeB;
    }
    // If one has valid date and other does not
    if (timeA > 0 && timeB === 0) return -1;
    if (timeB > 0 && timeA === 0) return 1;

    // Fallback to display_order
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });
}
