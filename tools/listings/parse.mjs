// Pure parsers for listing pages and feeds. No network here: tests run these on saved fixtures.
// Each parser returns [{ title, url, published }]. `published` is an ISO string or null (PIB and PRS carry no date).

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', ndash: '–', mdash: '—' };

export function decode(s = '') {
  return String(s)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
      if (e[0] === '#') {
        const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(n) ? String.fromCodePoint(n) : m;
      }
      return NAMED[e.toLowerCase()] ?? m;
    })
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Absolute https URL or null. Relative links are resolved against the listing's origin.
export function absolute(href, base) {
  try {
    const u = new URL(href, base);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null;
  } catch (_) { return null; }
}

export function isoFromRfc822(s) {
  if (!s) return null;
  const t = Date.parse(decode(s));
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

// RSS 2.0 feed (PIB, Bar and Bench). Items without a title or link are dropped.
export function parseRss(xml, base) {
  const out = [];
  for (const [, block] of String(xml).matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)) {
    const title = decode((block.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '');
    const link = decode((block.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i) || [])[1] || '');
    const date = (block.match(/<pubDate\b[^>]*>([\s\S]*?)<\/pubDate>/i) || [])[1];
    const url = absolute(link, base);
    if (title && url) out.push({ title, url, published: isoFromRfc822(date) });
  }
  return out;
}

// PRS bill tracker: links of the form href="/billtrack/<slug>">Bill title<. Duplicate slugs are kept once.
export function parsePrsBills(html, base = 'https://prsindia.org/') {
  const seen = new Set();
  const out = [];
  for (const [, href, label] of String(html).matchAll(/href="(\/billtrack\/[^"#?]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const title = decode(label);
    const url = absolute(href, base);
    if (!title || !url || seen.has(url)) continue;
    seen.add(url);
    out.push({ title, url, published: null });
  }
  return out;
}

// Validate a parsed list before it is trusted: titles must be short and links must be http(s).
export function validItems(items) {
  return items.filter(i => i.title.length >= 8 && i.title.length <= 300 && /^https?:\/\//.test(i.url));
}

// Supreme Court homepage, "latest judgements": links to view-pdf with type=j. Label text looks like
// "CASE NAME VS. OTHER - Crl.A. No. 4988/2026 - Diary Number 38471 / 2025 - 16-Oct-2026 (Uploaded On ...)".
// Only judgments (type=j) are kept; interim orders (type=o) are left out on purpose.
export function parseScHome(html, base = 'https://www.sci.gov.in/') {
  const out = [];
  const seen = new Set();
  for (const [, href, inner] of String(html).matchAll(/<a\s[^>]*href="([^"]*view-pdf[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const url = absolute(href.replace(/&amp;/g, '&'), base);
    if (!url || !/[?&]type=j\b/.test(url) || seen.has(url)) continue;
    const label = decode(inner).replace(/\(Uploaded On[^)]*\)/i, '').trim();
    const parts = label.split(/\s+-\s+/);
    const caseName = parts[0] || '';
    const caseNo = (parts.find(p => /\bNo\.\s*\d/.test(p)) || '').trim();
    const orderDate = (url.match(/order_date=(\d{4}-\d{2}-\d{2})/) || [])[1];
    const title = caseNo ? `${caseName} (${caseNo})` : caseName;
    if (!caseName) continue;
    seen.add(url);
    out.push({ title, url, published: orderDate ? `${orderDate}T00:00:00+05:30` : null });
  }
  return out;
}
