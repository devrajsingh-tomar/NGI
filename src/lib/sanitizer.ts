/**
 * Basic HTML Sanitizer to prevent XSS.
 * For production, it's highly recommended to use a library like 'dompurify'.
 */

const ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div'];
const ALLOWED_ATTR = ['href', 'target', 'class', 'style'];

export function sanitizeHtml(html: string): string {
    if (!html) return "";

    // Regular expression to match HTML tags
    const tagRegex = /<\/?([a-z0-9]+)(\s+[^>]*)?>/gi;

    return html.replace(tagRegex, (match, tagName, attributes) => {
        const lowerTagName = tagName.toLowerCase();
        
        // If tag is not allowed, remove it
        if (!ALLOWED_TAGS.includes(lowerTagName)) {
            return "";
        }

        // Keep the tag but sanitize attributes
        if (!attributes) {
            return match;
        }

        // Sanitize attributes to only allow specific ones and prevent javascript: URLs
        const sanitizedAttributes = attributes.replace(/([a-z-]+)\s*=\s*(['"])(.*?)\2/gi, (attrMatch, attrName, quote, attrValue) => {
            const lowerAttrName = attrName.toLowerCase();
            
            if (!ALLOWED_ATTR.includes(lowerAttrName)) {
                return "";
            }

            // Prevent javascript: links
            if (lowerAttrName === 'href' && attrValue.toLowerCase().startsWith('javascript:')) {
                return 'href="#"';
            }

            return attrMatch;
        });

        return `<${match.startsWith('</') ? '/' : ''}${tagName}${sanitizedAttributes}>`;
    });
}
