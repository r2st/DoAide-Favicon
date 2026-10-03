import { useState, useRef, useCallback } from 'react';
import { Upload, Globe, Star, Smartphone, Search } from 'lucide-react';

export default function FaviconPreview() {
  const [faviconSrc, setFaviconSrc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setFaviconSrc(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Favicon Preview</h2>
        <p className="text-sm text-gray-500 mb-6">See how your favicon looks in different contexts.</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-6 ${
            isDragging ? 'border-gold-500 bg-gold-50' : 'border-gray-300 hover:border-gold-400'
          }`}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Drop a favicon image here or click to upload</p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} className="hidden" />
        </div>

        {faviconSrc && (
          <div className="space-y-6">
            {/* Browser Tab */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Browser Tab
              </h3>
              <div className="bg-gray-100 rounded-t-lg border border-gray-300 overflow-hidden">
                <div className="flex items-center bg-gray-200 px-2 pt-2">
                  <div className="flex items-center gap-2 bg-white rounded-t-lg px-3 py-2 max-w-xs border-t border-x border-gray-300">
                    <img src={faviconSrc} alt="" className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">My Website — Home</span>
                    <span className="text-gray-400 text-xs ml-2">×</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 text-gray-400 text-sm">+</div>
                </div>
                <div className="bg-white px-3 py-2 flex items-center gap-2 border-t border-gray-200">
                  <div className="flex gap-1 text-gray-400">
                    <span>←</span> <span>→</span> <span>↻</span>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-500 flex items-center gap-1.5">
                    <img src={faviconSrc} alt="" className="w-3.5 h-3.5" />
                    mywebsite.com
                  </div>
                </div>
              </div>
            </div>

            {/* Bookmarks Bar */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                <Star className="w-4 h-4" /> Bookmarks Bar
              </h3>
              <div className="bg-white rounded-lg border border-gray-300 px-3 py-2 flex items-center gap-4">
                {['My Website', 'Gmail', 'GitHub'].map((name, i) => (
                  <div key={name} className="flex items-center gap-1.5 text-sm text-gray-600">
                    {i === 0 ? (
                      <img src={faviconSrc} alt="" className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 bg-gray-300 rounded" />
                    )}
                    {name}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Home Screen */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" /> Mobile Home Screen
              </h3>
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-6 max-w-xs mx-auto">
                <div className="grid grid-cols-4 gap-4">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      {i === 0 ? (
                        <img src={faviconSrc} alt="" className="w-12 h-12 rounded-xl shadow-md" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur" />
                      )}
                      <span className="text-[10px] text-white truncate w-full text-center">
                        {i === 0 ? 'My Site' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Google Search Result */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                <Search className="w-4 h-4" /> Search Result
              </h3>
              <div className="bg-white rounded-lg border border-gray-300 p-4 max-w-lg">
                <div className="flex items-center gap-2 mb-1">
                  <img src={faviconSrc} alt="" className="w-5 h-5 rounded-full" />
                  <div>
                    <span className="text-sm text-gray-700">mywebsite.com</span>
                    <span className="text-xs text-gray-400 ml-1"> › Home</span>
                  </div>
                </div>
                <h4 className="text-lg text-blue-700 hover:underline cursor-pointer">My Website — Welcome</h4>
                <p className="text-sm text-gray-600 mt-1">A brief description of your website and what visitors can expect to find here.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
