import { useState, useRef, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import PreviewGrid from '../../components/PreviewGrid';
import { drawImageFavicon, generateAllSizes } from '../../utils/canvas';

export default function ImageFavicon() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [faviconData, setFaviconData] = useState(null);
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
        setOffsetX(0);
        setOffsetY(0);
        setFaviconData(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const generate = () => {
    if (!image) return;
    const data = generateAllSizes(drawImageFavicon, {
      image,
      cropX: offsetX,
      cropY: offsetY,
    });
    setFaviconData(data);
  };

  const clear = () => {
    setImage(null);
    setImagePreview(null);
    setFaviconData(null);
    setOffsetX(0);
    setOffsetY(0);
  };

  const maxOffset = image ? Math.max(0, Math.abs((image.naturalWidth || image.width) - (image.naturalHeight || image.height)) / 2) : 100;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Image to Favicon</h2>
        <p className="text-sm text-gray-500 mb-6">Upload an image and convert it to a complete favicon set.</p>

        {!image ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-gold-500 bg-gold-50' : 'border-gray-300 hover:border-gold-400 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Drop an image here or click to browse</p>
            <p className="text-sm text-gray-400 mt-1">PNG, JPG, GIF, SVG, WebP</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files[0])}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <img
                  src={imagePreview}
                  alt="Uploaded"
                  className="w-40 h-40 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={clear}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  type="button"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horizontal Offset ({offsetX})
                  </label>
                  <input
                    type="range"
                    min={-maxOffset}
                    max={maxOffset}
                    value={offsetX}
                    onChange={(e) => setOffsetX(parseInt(e.target.value))}
                    className="w-full accent-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vertical Offset ({offsetY})
                  </label>
                  <input
                    type="range"
                    min={-maxOffset}
                    max={maxOffset}
                    value={offsetY}
                    onChange={(e) => setOffsetY(parseInt(e.target.value))}
                    className="w-full accent-gold-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={generate}
              className="w-full px-4 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors"
              type="button"
            >
              Generate Favicon
            </button>
          </div>
        )}
      </div>

      <PreviewGrid faviconData={faviconData} />
    </div>
  );
}
