import { describe, it, expect } from 'vitest';
import { generateMetaTags, generateWebManifest } from '../download';

describe('generateMetaTags', () => {
  it('includes all required link tags', () => {
    const tags = generateMetaTags();
    expect(tags).toContain('rel="icon"');
    expect(tags).toContain('rel="apple-touch-icon"');
    expect(tags).toContain('rel="manifest"');
    expect(tags).toContain('favicon-32x32.png');
    expect(tags).toContain('favicon-16x16.png');
    expect(tags).toContain('site.webmanifest');
  });
});

describe('generateWebManifest', () => {
  it('generates valid JSON', () => {
    const manifest = generateWebManifest('Test');
    const parsed = JSON.parse(manifest);
    expect(parsed.name).toBe('Test');
    expect(parsed.icons).toHaveLength(2);
    expect(parsed.icons[0].sizes).toBe('192x192');
    expect(parsed.icons[1].sizes).toBe('512x512');
  });

  it('uses default name', () => {
    const parsed = JSON.parse(generateWebManifest());
    expect(parsed.name).toBe('My Website');
  });
});
