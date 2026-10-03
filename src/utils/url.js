export function normalizeFaviconUrl(faviconHref, baseUrl) {
  if (!faviconHref) return null;
  try {
    if (faviconHref.startsWith('//')) {
      return 'https:' + faviconHref;
    }
    if (faviconHref.startsWith('http://') || faviconHref.startsWith('https://')) {
      return faviconHref;
    }
    if (faviconHref.startsWith('data:')) {
      return faviconHref;
    }
    const base = new URL(baseUrl);
    if (faviconHref.startsWith('/')) {
      return base.origin + faviconHref;
    }
    return new URL(faviconHref, baseUrl).href;
  } catch {
    return null;
  }
}

export async function extractFavicon(url) {
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(normalizedUrl)}`;

  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();
  const favicons = [];

  const linkRegex = /<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)[^"']*["'][^>]*>/gi;
  const matches = html.matchAll(linkRegex);

  for (const match of matches) {
    const hrefMatch = match[0].match(/href=["']([^"']+)["']/i);
    const sizesMatch = match[0].match(/sizes=["']([^"']+)["']/i);
    const typeMatch = match[0].match(/type=["']([^"']+)["']/i);

    if (hrefMatch) {
      const faviconUrl = normalizeFaviconUrl(hrefMatch[1], normalizedUrl);
      if (faviconUrl) {
        favicons.push({
          url: faviconUrl,
          sizes: sizesMatch ? sizesMatch[1] : null,
          type: typeMatch ? typeMatch[1] : null,
          tag: match[0],
        });
      }
    }
  }

  if (favicons.length === 0) {
    const base = new URL(normalizedUrl);
    favicons.push({
      url: base.origin + '/favicon.ico',
      sizes: null,
      type: 'image/x-icon',
      tag: '<link rel="icon" href="/favicon.ico">',
    });
  }

  return { url: normalizedUrl, favicons };
}
