import "server-only";

import sanitizeHtml from "sanitize-html";

/**
 * Blog content is authored by trusted staff, but it is still stored HTML that
 * gets rendered with dangerouslySetInnerHTML. Sanitising on write means a
 * compromised or careless editor account cannot plant a script tag that runs
 * for every visitor.
 */
export function sanitizePostHtml(dirty: string) {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "h2", "h3", "h4", "p", "blockquote", "ul", "ol", "li",
      "strong", "em", "u", "s", "code", "pre", "br", "hr",
      "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    // Force every outbound link to be safe to click.
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const external = /^https?:\/\//i.test(href);
        return {
          tagName,
          attribs: {
            ...attribs,
            ...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {}),
          },
        };
      },
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: "lazy" },
      }),
    },
  });
}

/** Strips all markup — used for excerpts, meta descriptions and reading time. */
export function toPlainText(html: string) {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

/** Rounded up, minimum 1. Based on 200 words per minute. */
export function readingMinutes(html: string) {
  const words = toPlainText(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
