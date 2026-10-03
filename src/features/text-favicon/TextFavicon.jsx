import { useState } from 'react';
import ColorPicker from '../../components/ColorPicker';
import PreviewGrid from '../../components/PreviewGrid';
import { drawTextFavicon, generateAllSizes } from '../../utils/canvas';

const FONTS = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Impact', 'Comic Sans MS'];

export default function TextFavicon() {
  const [text, setText] = useState('D');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontScale, setFontScale] = useState(1);
  const [color, setColor] = useState('#FFFFFF');
  const [backgroundColor, setBackgroundColor] = useState('#F0B429');
  const [borderRadius, setBorderRadius] = useState(20);
  const [faviconData, setFaviconData] = useState(null);

  const generate = () => {
    if (!text.trim()) return;
    const data = generateAllSizes(drawTextFavicon, {
      text: text.slice(0, 2),
      fontFamily,
      fontScale,
      color,
      backgroundColor,
      borderRadius,
    });
    setFaviconData(data);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Text to Favicon</h2>
        <p className="text-sm text-gray-500 mb-6">Enter 1-2 characters to generate a text-based favicon.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text (1-2 characters)</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 2))}
                maxLength={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-2xl text-center"
                placeholder="D"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
              >
                {FONTS.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size ({Math.round(fontScale * 100)}%)
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={fontScale}
                onChange={(e) => setFontScale(parseFloat(e.target.value))}
                className="w-full accent-gold-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Corner Radius ({borderRadius}%)
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={borderRadius}
                onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                className="w-full accent-gold-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <ColorPicker label="Text Color" value={color} onChange={setColor} />
            <ColorPicker label="Background Color" value={backgroundColor} onChange={setBackgroundColor} showTransparent />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!text.trim()}
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
