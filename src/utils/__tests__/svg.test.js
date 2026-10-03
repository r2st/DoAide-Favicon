import { describe, it, expect } from 'vitest';
import { createSvgFavicon, validateSvgString } from '../svg';

describe('createSvgFavicon', () => {
  it('creates SVG with background', () => {
    const svg = createSvgFavicon({ shapes: [], backgroundColor: '#FF0000' });
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('fill="#FF0000"');
    expect(svg).toContain('viewBox="0 0 512 512"');
  });

  it('includes rect shape', () => {
    const svg = createSvgFavicon({
      shapes: [{ type: 'rect', x: 10, y: 10, width: 100, height: 100, fill: '#00FF00' }],
    });
    expect(svg).toContain('<rect x="10" y="10" width="100" height="100"');
    expect(svg).toContain('fill="#00FF00"');
  });

  it('includes circle shape', () => {
    const svg = createSvgFavicon({
      shapes: [{ type: 'circle', cx: 256, cy: 256, r: 100, fill: '#0000FF' }],
    });
    expect(svg).toContain('<circle cx="256" cy="256" r="100"');
  });

  it('includes text shape', () => {
    const svg = createSvgFavicon({
      shapes: [{ type: 'text', x: 256, y: 256, text: 'AB', fontSize: 200, fill: '#FFF' }],
    });
    expect(svg).toContain('>AB</text>');
    expect(svg).toContain('font-size="200"');
  });

  it('handles multiple shapes', () => {
    const svg = createSvgFavicon({
      shapes: [
        { type: 'rect', x: 0, y: 0, width: 512, height: 512, fill: '#000' },
        { type: 'circle', cx: 256, cy: 256, r: 100, fill: '#FFF' },
      ],
    });
    expect(svg).toContain('<rect');
    expect(svg).toContain('<circle');
  });
});

describe('validateSvgString', () => {
  it('validates correct SVG', () => {
    const result = validateSvgString('<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>');
    expect(result.valid).toBe(true);
  });

  it('rejects empty string', () => {
    expect(validateSvgString('')).toEqual({ valid: false, error: 'SVG string is empty' });
  });

  it('rejects non-SVG string', () => {
    const result = validateSvgString('<div>not svg</div>');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Not a valid SVG');
  });

  it('rejects SVG without closing tag', () => {
    const result = validateSvgString('<svg><rect/>');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('missing closing');
  });

  it('rejects null input', () => {
    expect(validateSvgString(null)).toEqual({ valid: false, error: 'SVG string is empty' });
  });
});
