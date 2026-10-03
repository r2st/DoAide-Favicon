import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Copy, Check, X, FileText } from 'lucide-react';
import PreviewGrid from '../../components/PreviewGrid';
import { drawImageFavicon, generateAllSizes } from '../../utils/canvas';
import { downloadFaviconPackage, generateMetaTags, generateWebManifest } from '../../utils/download';

const FILE_TREE = [
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon-48x48.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'site.webmanifest',
  'meta-tags.html',
];

export default function FaviconPackage() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [faviconData, setFaviconData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImagePreview(e.target.result);
        setFaviconData(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const generate = () => {
    if (!image) return;
    const data = generateAllSizes(drawImageFavicon, { image });
    setFaviconData(data);
  };

  const copyMetaTags = () => {
    navigator.clipboard.writeText(generateMetaTags());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setImage(null);
    setImagePreview(null);
    setFaviconData(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Favicon Package</h2>
        <p className="text-sm text-gray-500 mb-6">Upload a source image (ideally 512x512+) to generate a complete favicon package.</p>

        {!image ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-gold-500 bg-gold-50' : 'border-gray-300 hover:border-gold-400'
            }`}
          >
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Drop your logo/image here</p>
            <p className="text-sm text-gray-400 mt-1">Recommended: 512x512px or larger, square</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} className="hidden" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={imagePreview} alt="Source" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                <button onClick={clear} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600" type="button">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Source Image</p>
                <p className="text-xs text-gray-500">{image.naturalWidth}x{image.naturalHeight}px</p>
              </div>
            </div>

            <button
              onClick={generate}
              className="w-full px-4 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors"
              type="button"
            >
              Generate All Sizes
            </button>
          </div>
        )}
      </div>

      {faviconData && (
        <>
          <PreviewGrid faviconData={faviconData} />

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Package Contents</h3>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              {FILE_TREE.map((f) => (
                <div key={f} className="flex items-center gap-2 py-0.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-700">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">HTML Meta Tags</h3>
              <button
                onClick={copyMetaTags}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                type="button"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto border border-gray-200">{generateMetaTags()}</pre>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">site.webmanifest</h3>
            <pre className="bg-gray-50 rounded-lg p-4 text-sm overflow-x-auto border border-gray-200">{generateWebManifest()}</pre>
          </div>

          <div className="text-center pb-4">
            <button
              onClick={() => downloadFaviconPackage(faviconData)}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              type="button"
            >
              <Download className="w-5 h-5" /> Download Complete Package
            </button>
          </div>
        </>
      )}
    </div>
  );
}
