import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { createIcoBlob, canvasToBlob } from './canvas';

export function downloadSingleFile(blob, filename) {
  saveAs(blob, filename);
}

export function generateMetaTags() {
  return `<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;
}

export function generateWebManifest(name = 'My Website') {
  return JSON.stringify({
    name,
    short_name: name,
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
  }, null, 2);
}

const SIZE_TO_FILENAME = {
  16: 'favicon-16x16.png',
  32: 'favicon-32x32.png',
  48: 'favicon-48x48.png',
  180: 'apple-touch-icon.png',
  192: 'android-chrome-192x192.png',
  512: 'android-chrome-512x512.png',
};

export async function downloadFaviconPackage(faviconData) {
  const zip = new JSZip();

  const icoCanvases = faviconData
    .filter((d) => [16, 32, 48].includes(d.size))
    .map((d) => d.canvas);

  if (icoCanvases.length > 0) {
    const icoBlob = await createIcoBlob(icoCanvases);
    zip.file('favicon.ico', icoBlob);
  }

  for (const item of faviconData) {
    const filename = SIZE_TO_FILENAME[item.size] || `favicon-${item.size}x${item.size}.png`;
    const blob = await canvasToBlob(item.canvas);
    zip.file(filename, blob);
  }

  zip.file('site.webmanifest', generateWebManifest());
  zip.file('meta-tags.html', generateMetaTags());

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'doaide-favicon-package.zip');
}
