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
  const sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
  
  return { __html: sanitized };
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function generateToc(markdown: string): { tocMarkdown: string; newContent: string } {
  const headings: { level: number; text: string; slug: string }[] = [];
  const slugCounts: Record<string, number> = {};

  const newContent = markdown.replace(/^(#+)\s+(.*)/gm, (match, hashes, text) => {
    const level = hashes.length;
    let slug = slugify(text);

    if (slugCounts[slug]) {
      slugCounts[slug]++;
      slug = `${slug}-${slugCounts[slug]}`;
    } else {
      slugCounts[slug] = 1;
    }

    headings.push({ level, text, slug });
    return `${hashes} ${text} {#${slug}}`;
  });

  const tocMarkdown = headings
    .map(h => `${'  '.repeat(h.level - 1)}- [${h.text}](#${h.slug})`)
    .join('\n');

  return { tocMarkdown, newContent };
}

export function correctMarkdown(markdown: string): string {
  let lines = markdown.split('\n');

  // 1. Trim trailing whitespace from each line
  lines = lines.map(line => line.trimEnd());

  // 2. Standardize unordered list markers to '-'
  lines = lines.map(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('+ ')) {
      return line.replace(/^\s*[\*\+]/, ' -');
    }
    return line;
  });

  return lines.join('\n');
}
