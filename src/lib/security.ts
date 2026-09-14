import DOMPurify from 'dompurify';

/**
 * Security and sanitization utility functions
 */

/**
 * Computes a cryptographic SHA-256 hex string for a given text input.
 * Compatible with modern browser crypto and fallback environments.
 */
export async function hashString(input: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback simple numeric hash if crypto.subtle is unavailable
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Validates whether a given URL string is safe to render in href or src attributes.
 * Rejects javascript:, vbscript:, data: (except safe data:image), and malformed pseudo-protocols.
 */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();

  // Allow relative URLs
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true;
  }

  try {
    const parsed = new URL(trimmed, 'https://placeholder.internal');
    const protocol = parsed.protocol.toLowerCase();
    
    // Allow standard secure protocols
    if (['https:', 'http:', 'mailto:', 'tel:'].includes(protocol)) {
      return true;
    }

    // Allow safe data images if needed
    if (protocol === 'data:' && /^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,/i.test(trimmed)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Normalizes and returns a safe URL or a fallback if the URL is invalid or unsafe.
 */
export function sanitizeUrl(url: string | null | undefined, fallback: string = ''): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (isSafeUrl(trimmed)) {
    return trimmed;
  }
  return fallback;
}

/**
 * Sanitizes rich text / HTML content to prevent Cross-Site Scripting (XSS).
 * Uses DOMPurify with strict permitted tags and attributes.
 */
export function sanitizeHtml(dirtyHtml: string | null | undefined): string {
  if (!dirtyHtml) return '';
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      'b',
      'i',
      'em',
      'strong',
      'a',
      'p',
      'br',
      'ul',
      'ol',
      'li',
      'code',
      'pre',
      'blockquote',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'span',
      'hr',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'title'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target', 'rel'],
  });
}

/**
 * Strips HTML tags and normalizes raw text input.
 */
export function sanitizePlainText(text: string | null | undefined): string {
  if (!text) return '';
  const stripped = text.replace(/<[^>]*>/g, '');
  return Array.from(stripped)
    .filter((char) => {
      const code = char.charCodeAt(0);
      // Keep printable characters and standard whitespace (tab, LF, CR)
      return (code >= 32 && code !== 127) || code === 9 || code === 10 || code === 13;
    })
    .join('')
    .trim();
}
