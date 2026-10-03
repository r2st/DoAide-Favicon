import { useState } from 'react';
import ColorPicker from '../../components/ColorPicker';
import PreviewGrid from '../../components/PreviewGrid';
import { drawEmojiFavicon, generateAllSizes } from '../../utils/canvas';

const POPULAR_EMOJIS = [
  '⭐', '❤️', '🔥', '🚀', '✅', '⚡', '🌍', '💡',
  '🎯', '💎', '🛡️', '📦', '🎨', '🔧', '📱', '💻',
  '🏠', '📝', '🎵', '📸', '🍕', '☕', '🌈', '🦄',
];

export default function EmojiFavicon() {
  const [emoji, setEmoji] = useState('🚀');
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [faviconData, setFaviconData] = useState(null);

  const generate = () => {
    if (!emoji.trim()) return;
    const data = generateAllSizes(drawEmojiFavicon, { emoji, backgroundColor });
    setFaviconData(data);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Emoji Favicon</h2>
        <p className="text-sm text-gray-500 mb-6">Pick any emoji and turn it into a favicon set.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-3xl text-center"
                placeholder="🚀"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Pick</label>
              <div className="grid grid-cols-8 gap-1.5">
                {POPULAR_EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`text-2xl p-1.5 rounded-lg border-2 transition-all hover:scale-110 ${
                      emoji === e ? 'border-gold-500 bg-gold-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    type="button"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <ColorPicker
              label="Background Color"
              value={backgroundColor}
              onChange={setBackgroundColor}
              showTransparent
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!emoji.trim()}
          className="mt-6 w-full px-4 py-3 bg-gold-500 hover:bg-gold-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
          type="button"
        >
          Generate Favicon
        </button>
      </div>

      <PreviewGrid faviconData={faviconData} />
    </div>
  );
}
