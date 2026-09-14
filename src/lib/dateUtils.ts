import { parse, parseISO, isValid, compareAsc } from 'date-fns';

/**
 * Standard formats supported for event dates
 */
const DATE_FORMAT_PATTERNS = [
  'yyyy-MM-dd',
  'dd MMM yyyy',
  'd MMM yyyy',
  'dd MMMM yyyy',
  'd MMMM yyyy',
  'MMM d, yyyy',
  'MMMM d, yyyy',
  'MMM dd, yyyy',
  'MMMM dd, yyyy',
  'dd/MM/yyyy',
  'd/M/yyyy',
  'MM/dd/yyyy',
  'd MMM yy',
  'dd MMM yy',
  'd MMMM yy',
  'MMM d',
  'd MMM',
  'yyyy/MM/dd',
];

/**
 * Parses diverse event date strings using date-fns into a valid JavaScript Date object.
 */
export function parseEventDate(dateStr: string): Date {
  if (!dateStr || typeof dateStr !== 'string') return new Date(0);
  const trimmed = dateStr.trim();
  if (!trimmed) return new Date(0);

  // 1. Try ISO parsing
  const isoParsed = parseISO(trimmed);
  if (isValid(isoParsed) && !isNaN(isoParsed.getTime())) {
    return isoParsed;
  }

  // 2. Try date-fns pattern matches
  const currentYear = new Date().getFullYear();
  const baseDate = new Date(currentYear, 0, 1);

  for (const pattern of DATE_FORMAT_PATTERNS) {
    try {
      const parsed = parse(trimmed, pattern, baseDate);
      if (isValid(parsed) && !isNaN(parsed.getTime()) && parsed.getFullYear() > 1970) {
        return parsed;
      }
    } catch {
      // Continue to next format pattern
    }
  }

  // 3. Fallback to standard JavaScript Date
  const nativeParsed = new Date(trimmed);
  if (isValid(nativeParsed) && !isNaN(nativeParsed.getTime())) {
    return nativeParsed;
  }

  return new Date(0);
}

/**
 * Sorts an array of events chronologically using date-fns compareAsc.
 */
export function sortEventsChronologically<T extends { date: string; display_order?: number }>(
  events: T[]
): T[] {
  return [...events].sort((a, b) => {
    const dateA = parseEventDate(a.date);
    const dateB = parseEventDate(b.date);

    const validA = isValid(dateA) && dateA.getTime() > 0;
    const validB = isValid(dateB) && dateB.getTime() > 0;

    if (validA && validB) {
      const cmp = compareAsc(dateA, dateB);
      if (cmp !== 0) return cmp;
    } else if (validA && !validB) {
      return -1;
    } else if (!validA && validB) {
      return 1;
    }

    // Fallback to display_order
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });
}
