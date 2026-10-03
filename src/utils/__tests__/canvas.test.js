import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FAVICON_SIZES, createFaviconCanvas, drawTextFavicon, drawEmojiFavicon, canvasToDataURL, generateAllSizes, createIcoBlob } from '../canvas';

function mockCanvas(size) {
  const ctx = {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    clip: vi.fn(),
    drawImage: vi.fn(),
    font: '',
    fillStyle: '',
    textAlign: '',
    textBaseline: '',
  };
  return {
    width: size,
    height: size,
    getContext: vi.fn(() => ctx),
    toDataURL: vi.fn(() => 'data:image/png;base64,test'),
    toBlob: vi.fn((cb) => cb(new Blob(['test'], { type: 'image/png' }))),
    _ctx: ctx,
  };
}

beforeEach(() => {
  vi.spyOn(document, 'createElement').mockImplementation((tag) => {
    if (tag === 'canvas') return mockCanvas(64);
    return document.createElement(tag);
  });
});

describe('FAVICON_SIZES', () => {
  it('contains expected sizes', () => {
    expect(FAVICON_SIZES).toEqual([16, 32, 48, 180, 192, 512]);
  });
});

describe('createFaviconCanvas', () => {
  it('creates canvas with correct dimensions', () => {
    const canvas = createFaviconCanvas(32);
    expect(canvas.width).toBe(32);
    expect(canvas.height).toBe(32);
  });
});

describe('drawTextFavicon', () => {
  it('draws text on canvas', () => {
    const canvas = mockCanvas(64);
    drawTextFavicon(canvas, { text: 'A', color: '#fff', backgroundColor: '#000' });
    expect(canvas._ctx.clearRect).toHaveBeenCalledWith(0, 0, 64, 64);
    expect(canvas._ctx.fillText).toHaveBeenCalled();
    expect(canvas._ctx.fillStyle).toBe('#fff');
  });

  it('handles rounded corners', () => {
    const canvas = mockCanvas(64);
    drawTextFavicon(canvas, { text: 'B', borderRadius: 20, backgroundColor: '#000' });
    expect(canvas._ctx.beginPath).toHaveBeenCalled();
    expect(canvas._ctx.clip).toHaveBeenCalled();
  });

  it('handles transparent background', () => {
    const canvas = mockCanvas(64);
    drawTextFavicon(canvas, { text: 'C', backgroundColor: 'transparent' });
    expect(canvas._ctx.fillRect).not.toHaveBeenCalled();
  });
});

describe('drawEmojiFavicon', () => {
  it('draws emoji on canvas', () => {
    const canvas = mockCanvas(64);
    drawEmojiFavicon(canvas, { emoji: '🚀' });
    expect(canvas._ctx.fillText).toHaveBeenCalledWith('🚀', 32, expect.any(Number));
  });

  it('fills background when specified', () => {
    const canvas = mockCanvas(64);
    drawEmojiFavicon(canvas, { emoji: '⭐', backgroundColor: '#ff0000' });
    expect(canvas._ctx.fillRect).toHaveBeenCalledWith(0, 0, 64, 64);
  });
});

describe('canvasToDataURL', () => {
  it('returns data URL', () => {
    const canvas = mockCanvas(32);
    const result = canvasToDataURL(canvas);
    expect(result).toBe('data:image/png;base64,test');
  });
});

describe('generateAllSizes', () => {
  it('generates favicons for all sizes', () => {
    const drawFn = vi.fn((canvas) => canvas);
    const result = generateAllSizes(drawFn, { text: 'A' });
    expect(result).toHaveLength(FAVICON_SIZES.length);
    expect(drawFn).toHaveBeenCalledTimes(FAVICON_SIZES.length);
    result.forEach((item, i) => {
      expect(item.size).toBe(FAVICON_SIZES[i]);
      expect(item.dataURL).toBeDefined();
      expect(item.canvas).toBeDefined();
    });
  });
});

describe('createIcoBlob', () => {
  it('creates ICO blob from canvases', async () => {
    const canvases = [mockCanvas(16), mockCanvas(32), mockCanvas(48)];
    const blob = await createIcoBlob(canvases);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/x-icon');
  });
});
