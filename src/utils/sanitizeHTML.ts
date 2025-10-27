/**
 * Simple HTML sanitization utility
 * Removes potentially dangerous HTML tags and attributes
 */

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  'a': ['href', 'title', 'target', 'rel'],
  'img': ['src', 'alt', 'title', 'width', 'height'],
  '*': ['class', 'id']
};

export function sanitizeHTML(html: string): string {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Recursively clean nodes
  const cleanNode = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      // Remove disallowed tags
      if (!ALLOWED_TAGS.includes(tagName)) {
        return null;
      }

      // Clean attributes
      const allowedAttrs = [
        ...(ALLOWED_ATTRIBUTES[tagName] || []),
        ...(ALLOWED_ATTRIBUTES['*'] || [])
      ];

      Array.from(element.attributes).forEach(attr => {
        if (!allowedAttrs.includes(attr.name.toLowerCase())) {
          element.removeAttribute(attr.name);
        }
      });

      // Prevent javascript: and data: URLs
      if (element.hasAttribute('href')) {
        const href = element.getAttribute('href') || '';
        if (href.startsWith('javascript:') || href.startsWith('data:')) {
          element.removeAttribute('href');
        }
      }

      if (element.hasAttribute('src')) {
        const src = element.getAttribute('src') || '';
        if (src.startsWith('javascript:') || src.startsWith('data:')) {
          element.removeAttribute('src');
        }
      }

      // Clean children
      Array.from(element.childNodes).forEach(child => {
        const cleanedChild = cleanNode(child);
        if (!cleanedChild) {
          element.removeChild(child);
        }
      });

      return element;
    }

    return null;
  };

  Array.from(tempDiv.childNodes).forEach(child => {
    const cleanedChild = cleanNode(child);
    if (!cleanedChild) {
      tempDiv.removeChild(child);
    }
  });

  return tempDiv.innerHTML;
}

export function createSafeHTML(html: string): { __html: string } {
  return { __html: sanitizeHTML(html) };
}
