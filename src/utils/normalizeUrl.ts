/**
 * Normalizes a URL by prepending https:// if it's missing.
 * Also validates if the string is a valid URL.
 */
export function normalizeUrl(url: string): string {
  if (!url) return '';
  
  let normalized = url.trim();
  
  // If it doesn't start with a protocol, prepend https://
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }
  
  return normalized;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(normalizeUrl(url));
    return true;
  } catch {
    return false;
  }
}
