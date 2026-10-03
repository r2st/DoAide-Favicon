import { useState } from 'react';
import { Search, Download, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';

import { extractFavicon } from '../../utils/url';

export default function UrlChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const check = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await extractFavicon(url);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch favicon. The site may block cross-origin requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') check();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">URL Favicon Checker</h2>
        <p className="text-sm text-gray-500 mb-6">Enter a URL to extract and display its current favicon.</p>

        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="example.com"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
          />
          <button
            onClick={check}
            disabled={loading || !url.trim()}
            className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            type="button"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Check
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-700">{error}</p>
              <p className="text-xs text-red-500 mt-1">Some sites block cross-origin requests. Try visiting the URL directly and using your browser's dev tools.</p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ExternalLink className="w-4 h-4" />
              <span className="truncate">{result.url}</span>
            </div>

            {result.favicons.length === 0 ? (
              <p className="text-sm text-gray-500">No favicons found for this URL.</p>
            ) : (
              <div className="space-y-3">
                {result.favicons.map((fav, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0 bg-white p-2 rounded border border-gray-200">
                      <img
                        src={fav.url.startsWith('data:') ? fav.url : `https://api.allorigins.win/raw?url=${encodeURIComponent(fav.url)}`}
                        alt="Favicon"
                        className="w-8 h-8"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate font-mono">{fav.url}</p>
                      <div className="flex gap-3 mt-1 text-xs text-gray-500">
                        {fav.sizes && <span>Sizes: {fav.sizes}</span>}
                        {fav.type && <span>Type: {fav.type}</span>}
                      </div>
                    </div>
                    <a
                      href={fav.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" /> Open
                    </a>
                  </div>
                ))}
              </div>
            )}

            {result.favicons.length > 0 && (
              <details className="mt-4">
                <summary className="text-sm text-gray-500 cursor-pointer">HTML Tags Found</summary>
                <div className="mt-2 space-y-1">
                  {result.favicons.map((fav, i) => (
                    <pre key={i} className="text-xs bg-gray-50 p-2 rounded border border-gray-200 overflow-x-auto">{fav.tag}</pre>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
