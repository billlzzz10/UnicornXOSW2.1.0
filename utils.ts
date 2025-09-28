export function calculateCharacterCount(text: string): number {
  return text.length;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getSafeHtml(html: string): { __html: string } {
  // Basic HTML sanitization - in a real app, use a proper library like DOMPurify or sanitize-html
  let sanitized = html;
  let previous;
  do {
    previous = sanitized;
    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+="[^"]*"/gi, '');
  } while (sanitized !== previous);
  
  return { __html: sanitized };
}
