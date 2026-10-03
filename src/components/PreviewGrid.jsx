import { Download } from 'lucide-react';
import { canvasToBlob } from '../utils/canvas';
import { downloadSingleFile, downloadFaviconPackage } from '../utils/download';

export default function PreviewGrid({ faviconData }) {
  if (!faviconData || faviconData.length === 0) return null;

  const handleDownloadSingle = async (item) => {
    const blob = await canvasToBlob(item.canvas);
    downloadSingleFile(blob, `favicon-${item.size}x${item.size}.png`);
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Preview</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {faviconData.map((item) => (
          <div key={item.size} className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col items-center gap-2">
            <div className="flex items-center justify-center" style={{ width: Math.min(item.size, 80), height: Math.min(item.size, 80) }}>
              <img
                src={item.dataURL}
                alt={`${item.size}x${item.size}`}
                width={Math.min(item.size, 80)}
                height={Math.min(item.size, 80)}
                className="pixelated"
                style={{ imageRendering: item.size <= 48 ? 'pixelated' : 'auto' }}
              />
            </div>
            <span className="text-xs text-gray-500">{item.size}x{item.size}</span>
            <button
              onClick={() => handleDownloadSingle(item)}
              className="text-xs text-gold-600 hover:text-gold-700 flex items-center gap-1"
              type="button"
            >
              <Download className="w-3 h-3" /> PNG
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => downloadFaviconPackage(faviconData)}
          className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          type="button"
        >
          <Download className="w-4 h-4" /> Download Package (.zip)
        </button>
      </div>
    </div>
  );
}
