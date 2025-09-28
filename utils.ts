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
  // Basic HTML sanitization - in a real app, use a proper library like DOMPurify
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '');
  // Remove event handlers repeatedly until none are left
  let prevSanitized;
  do {
    prevSanitized = sanitized;
    sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '');
  } while (sanitized !== prevSanitized);
  
  return { __html: sanitized };
}
