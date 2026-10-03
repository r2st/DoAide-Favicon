export const FAVICON_SIZES = [16, 32, 48, 180, 192, 512];

export function createFaviconCanvas(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

export function drawTextFavicon(canvas, { text, fontFamily = 'Arial', fontScale = 1, color = '#ffffff', backgroundColor = '#F0B429', borderRadius = 0 }) {
  const ctx = canvas.getContext('2d');
  const size = canvas.width;

  ctx.clearRect(0, 0, size, size);

  if (backgroundColor && backgroundColor !== 'transparent') {
    if (borderRadius > 0) {
      const r = (borderRadius / 100) * size * 0.5;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(size - r, 0);
      ctx.quadraticCurveTo(size, 0, size, r);
      ctx.lineTo(size, size - r);
      ctx.quadraticCurveTo(size, size, size - r, size);
      ctx.lineTo(r, size);
      ctx.quadraticCurveTo(0, size, 0, size - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fillStyle = backgroundColor;
      ctx.fill();
      ctx.clip();
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, size, size);
    }
  }

  const baseFontSize = size * 0.65 * fontScale;
  ctx.font = `bold ${baseFontSize}px "${fontFamily}", sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2 + size * 0.03);

  return canvas;
}

export function drawEmojiFavicon(canvas, { emoji, backgroundColor = 'transparent' }) {
  const ctx = canvas.getContext('2d');
  const size = canvas.width;

  ctx.clearRect(0, 0, size, size);

  if (backgroundColor && backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);
  }

  const fontSize = size * 0.75;
  ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size / 2 + size * 0.05);

  return canvas;
}

export function drawImageFavicon(canvas, { image, cropX = 0, cropY = 0, cropSize = null }) {
  const ctx = canvas.getContext('2d');
  const size = canvas.width;

  ctx.clearRect(0, 0, size, size);

  const imgW = image.naturalWidth || image.width;
  const imgH = image.naturalHeight || image.height;
  const minDim = Math.min(imgW, imgH);
  const cs = cropSize || minDim;
  const sx = cropX + (imgW - cs) / 2;
  const sy = cropY + (imgH - cs) / 2;

  ctx.drawImage(image, Math.max(0, sx), Math.max(0, sy), cs, cs, 0, 0, size, size);

  return canvas;
}

export function canvasToBlob(canvas, type = 'image/png') {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type);
  });
}

export function canvasToDataURL(canvas, type = 'image/png') {
  return canvas.toDataURL(type);
}

export function generateAllSizes(drawFn, options) {
  return FAVICON_SIZES.map((size) => {
    const canvas = createFaviconCanvas(size);
    drawFn(canvas, options);
    return { size, canvas, dataURL: canvasToDataURL(canvas) };
  });
}

export async function createIcoBlob(canvases) {
  const images = [];
  for (const canvas of canvases) {
    const blob = await canvasToBlob(canvas, 'image/png');
    const buffer = await blob.arrayBuffer();
    images.push({ width: canvas.width, height: canvas.height, data: new Uint8Array(buffer) });
  }

  const headerSize = 6;
  const entrySize = 16;
  const numImages = images.length;
  let offset = headerSize + entrySize * numImages;

  const totalSize = offset + images.reduce((sum, img) => sum + img.data.length, 0);
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, numImages, true);

  let entryOffset = headerSize;
  for (const img of images) {
    view.setUint8(entryOffset, img.width >= 256 ? 0 : img.width);
    view.setUint8(entryOffset + 1, img.height >= 256 ? 0 : img.height);
    view.setUint8(entryOffset + 2, 0);
    view.setUint8(entryOffset + 3, 0);
    view.setUint16(entryOffset + 4, 1, true);
    view.setUint16(entryOffset + 6, 32, true);
    view.setUint32(entryOffset + 8, img.data.length, true);
    view.setUint32(entryOffset + 12, offset, true);
    entryOffset += entrySize;
    offset += img.data.length;
  }

  let dataOffset = headerSize + entrySize * numImages;
  const uint8 = new Uint8Array(buffer);
  for (const img of images) {
    uint8.set(img.data, dataOffset);
    dataOffset += img.data.length;
  }

  return new Blob([buffer], { type: 'image/x-icon' });
}
