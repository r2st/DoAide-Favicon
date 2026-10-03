import { describe, it, expect } from 'vitest';
import { normalizeFaviconUrl } from '../url';

describe('normalizeFaviconUrl', () => {
  it('handles absolute URLs', () => {
    expect(normalizeFaviconUrl('https://example.com/favicon.ico', 'https://example.com'))
      .toBe('https://example.com/favicon.ico');
  });

  it('handles protocol-relative URLs', () => {
    expect(normalizeFaviconUrl('//cdn.example.com/icon.png', 'https://example.com'))
      .toBe('https://cdn.example.com/icon.png');
  });

  it('handles root-relative URLs', () => {
    expect(normalizeFaviconUrl('/assets/favicon.ico', 'https://example.com/page'))
      .toBe('https://example.com/assets/favicon.ico');
  });

  it('handles relative URLs', () => {
    expect(normalizeFaviconUrl('favicon.ico', 'https://example.com/page/'))
      .toBe('https://example.com/page/favicon.ico');
  });

  it('handles data URLs', () => {
    expect(normalizeFaviconUrl('data:image/png;base64,abc', 'https://example.com'))
      .toBe('data:image/png;base64,abc');
  });

  it('returns null for empty input', () => {
    expect(normalizeFaviconUrl('', 'https://example.com')).toBeNull();
    expect(normalizeFaviconUrl(null, 'https://example.com')).toBeNull();
  });
});
