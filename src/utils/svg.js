export function svgToCanvas(svgString, size) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };

    img.src = url;
  });
}

export function createSvgFavicon({ shapes = [], width = 512, height = 512, backgroundColor = '#F0B429' }) {
  const shapeElements = shapes.map((shape) => {
    switch (shape.type) {
      case 'rect':
        return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" rx="${shape.rx || 0}" fill="${shape.fill || '#ffffff'}"/>`;
      case 'circle':
        return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" fill="${shape.fill || '#ffffff'}"/>`;
      case 'text':
        return `<text x="${shape.x}" y="${shape.y}" font-family="${shape.fontFamily || 'Arial'}" font-size="${shape.fontSize || 200}" font-weight="${shape.fontWeight || 'bold'}" fill="${shape.fill || '#ffffff'}" text-anchor="middle" dominant-baseline="middle">${shape.text || ''}</text>`;
      default:
        return '';
    }
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
  ${shapeElements.join('\n  ')}
</svg>`;
}

export function validateSvgString(svgString) {
  if (!svgString || typeof svgString !== 'string') {
    return { valid: false, error: 'SVG string is empty' };
  }
  const trimmed = svgString.trim();
  if (!trimmed.startsWith('<svg') && !trimmed.startsWith('<?xml')) {
    return { valid: false, error: 'Not a valid SVG: must start with <svg' };
  }
  if (!trimmed.includes('</svg>')) {
    return { valid: false, error: 'Not a valid SVG: missing closing </svg> tag' };
  }
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmed, 'image/svg+xml');
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
      return { valid: false, error: 'SVG parse error: ' + errorNode.textContent.slice(0, 100) };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Failed to parse SVG' };
  }
}
