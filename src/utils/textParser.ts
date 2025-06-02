/**
 * Parses custom markup in text and converts it to HTML with appropriate styling.
 *
 * Supported syntax:
 * - **bold text** -> <strong class="font-bold">bold text</strong>
 * - //italic text// -> <em class="italic">italic text</em>
 * - __underlined text__ -> <span class="underline">underlined text</span>
 * - [[text with primary-400]] -> <span class="text-primary-light">text with primary-400</span>
 * - \n -> <br />
 *
 * @param text - The text string containing custom markup
 * @returns - HTML string with appropriate styling
 */

// Cache regex patterns for better performance
const MARKUP_PATTERNS = [
  {
    regex: /\*\*(.*?)\*\*/g,
    replacement: '<strong class="font-bold">$1</strong>',
  },
  {
    regex: /\/\/(.*?)\/\//g,
    replacement: '<em class="italic">$1</em>',
  },
  {
    regex: /__(.*?)__/g,
    replacement: '<span class="underline">$1</span>',
  },
  {
    regex: /\[\[(.*?)\]\]/g,
    replacement: '<span class="text-accent-light">$1</span>',
  },
] as const;

const NEWLINE_PATTERNS = {
  doubleNewline: /\\n\\n/g,
  singleNewline: /\\n/g,
} as const;

export function parseText(text: string): string {
  if (!text || typeof text !== 'string') return '';

  // Handle newlines first (most common operation)
  let result = text
    .replace(NEWLINE_PATTERNS.doubleNewline, '<br /><br />')
    .replace(NEWLINE_PATTERNS.singleNewline, '<br />');

  // Apply markup patterns in a single loop
  for (const pattern of MARKUP_PATTERNS) {
    result = result.replace(pattern.regex, pattern.replacement);
  }

  return result;
}

/**
 * Alternative high-performance version using string scanning
 * Use this for very large texts or high-frequency parsing
 */
export function parseTextOptimized(text: string): string {
  if (!text || typeof text !== 'string') return '';

  const result: string[] = [];
  let i = 0;
  const len = text.length;

  while (i < len) {
    const char = text[i];
    const next = text[i + 1];

    // Handle newlines
    if (char === '\\' && next === 'n') {
      const afterNext = text[i + 2];
      if (afterNext === '\\' && text[i + 3] === 'n') {
        result.push('<br /><br />');
        i += 4;
        continue;
      }
      result.push('<br />');
      i += 2;
      continue;
    }

    // Handle markup patterns
    if (char === '*' && next === '*') {
      const closeIndex = text.indexOf('**', i + 2);
      if (closeIndex !== -1) {
        const content = text.slice(i + 2, closeIndex);
        result.push(`<strong class="font-bold">${content}</strong>`);
        i = closeIndex + 2;
        continue;
      }
    } else if (char === '/' && next === '/') {
      const closeIndex = text.indexOf('//', i + 2);
      if (closeIndex !== -1) {
        const content = text.slice(i + 2, closeIndex);
        result.push(`<em class="italic">${content}</em>`);
        i = closeIndex + 2;
        continue;
      }
    } else if (char === '_' && next === '_') {
      const closeIndex = text.indexOf('__', i + 2);
      if (closeIndex !== -1) {
        const content = text.slice(i + 2, closeIndex);
        result.push(`<span class="underline">${content}</span>`);
        i = closeIndex + 2;
        continue;
      }
    } else if (char === '[' && next === '[') {
      const closeIndex = text.indexOf(']]', i + 2);
      if (closeIndex !== -1) {
        const content = text.slice(i + 2, closeIndex);
        result.push(`<span class="text-primary-light">${content}</span>`);
        i = closeIndex + 2;
        continue;
      }
    }

    // Regular character
    result.push(char);
    i++;
  }

  return result.join('');
}
