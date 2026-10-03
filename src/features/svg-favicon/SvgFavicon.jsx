import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import PreviewGrid from '../../components/PreviewGrid';
import ColorPicker from '../../components/ColorPicker';
import { createSvgFavicon, svgToCanvas, validateSvgString } from '../../utils/svg';
import { FAVICON_SIZES, canvasToDataURL } from '../../utils/canvas';

export default function SvgFavicon() {
  const [mode, setMode] = useState('builder');
  const [shapes, setShapes] = useState([]);
  const [bgColor, setBgColor] = useState('#F0B429');
  const [customSvg, setCustomSvg] = useState('');
  const [faviconData, setFaviconData] = useState(null);
  const [error, setError] = useState('');

  const addShape = (type) => {
    const base = { fill: '#ffffff' };
    let shape;
    if (type === 'rect') shape = { ...base, type: 'rect', x: 100, y: 100, width: 300, height: 300, rx: 0 };
    else if (type === 'circle') shape = { ...base, type: 'circle', cx: 256, cy: 256, r: 150 };
    else shape = { ...base, type: 'text', x: 256, y: 270, text: 'A', fontSize: 300, fontFamily: 'Arial', fontWeight: 'bold' };
    setShapes([...shapes, shape]);
  };

  const updateShape = (index, field, value) => {
    const updated = [...shapes];
    updated[index] = { ...updated[index], [field]: value };
    setShapes(updated);
  };

  const removeShape = (index) => {
    setShapes(shapes.filter((_, i) => i !== index));
  };

  const getSvgString = () => {
    if (mode === 'paste') return customSvg;
    return createSvgFavicon({ shapes, backgroundColor: bgColor });
  };

  const generate = async () => {
    setError('');
    const svgString = getSvgString();

    if (mode === 'paste') {
      const result = validateSvgString(svgString);
      if (!result.valid) { setError(result.error); return; }
    }

    try {
      const data = await Promise.all(
        FAVICON_SIZES.map(async (size) => {
          const canvas = await svgToCanvas(svgString, size);
          return { size, canvas, dataURL: canvasToDataURL(canvas) };
        })
      );
      setFaviconData(data);
    } catch {
      setError('Failed to render SVG. Please check your SVG code.');
    }
  };

  const previewSvg = getSvgString();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">SVG Favicon</h2>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('builder')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'builder' ? 'bg-gold-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            type="button"
          >
            Shape Builder
          </button>
          <button
            onClick={() => setMode('paste')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'paste' ? 'bg-gold-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            type="button"
          >
            Paste SVG
          </button>
        </div>

        {mode === 'builder' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ColorPicker label="Background" value={bgColor} onChange={setBgColor} showTransparent />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Shape</label>
                <div className="flex gap-2">
                  {['rect', 'circle', 'text'].map((t) => (
                    <button
                      key={t}
                      onClick={() => addShape(t)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                      type="button"
                    >
                      <Plus className="w-3 h-3" /> {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {shapes.map((shape, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{shape.type}</span>
                      <button onClick={() => removeShape(i)} className="text-red-400 hover:text-red-600" type="button">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {shape.type === 'text' && (
                        <input
                          value={shape.text}
                          onChange={(e) => updateShape(i, 'text', e.target.value)}
                          className="col-span-2 px-2 py-1 border rounded text-sm"
                          placeholder="Text"
                        />
                      )}
                      <label className="flex items-center gap-1">
                        Fill:
                        <input type="color" value={shape.fill} onChange={(e) => updateShape(i, 'fill', e.target.value)} className="w-6 h-6" />
                      </label>
                      {shape.type === 'rect' && (
                        <>
                          <label>X: <input type="number" value={shape.x} onChange={(e) => updateShape(i, 'x', +e.target.value)} className="w-16 px-1 border rounded" /></label>
                          <label>Y: <input type="number" value={shape.y} onChange={(e) => updateShape(i, 'y', +e.target.value)} className="w-16 px-1 border rounded" /></label>
                          <label>W: <input type="number" value={shape.width} onChange={(e) => updateShape(i, 'width', +e.target.value)} className="w-16 px-1 border rounded" /></label>
                          <label>H: <input type="number" value={shape.height} onChange={(e) => updateShape(i, 'height', +e.target.value)} className="w-16 px-1 border rounded" /></label>
                        </>
                      )}
                      {shape.type === 'circle' && (
                        <>
                          <label>CX: <input type="number" value={shape.cx} onChange={(e) => updateShape(i, 'cx', +e.target.value)} className="w-16 px-1 border rounded" /></label>
                          <label>CY: <input type="number" value={shape.cy} onChange={(e) => updateShape(i, 'cy', +e.target.value)} className="w-16 px-1 border rounded" /></label>
                          <label>R: <input type="number" value={shape.r} onChange={(e) => updateShape(i, 'r', +e.target.value)} className="w-16 px-1 border rounded" /></label>
                        </>
                      )}
                      {shape.type === 'text' && (
                        <>
                          <label>X: <input type="number" value={shape.x} onChange={(e) => updateShape(i, 'x', +e.target.value)} className="w-16 px-1 border rounded" /></label>
                          <label>Y: <input type="number" value={shape.y} onChange={(e) => updateShape(i, 'y', +e.target.value)} className="w-16 px-1 border rounded" /></label>
                          <label>Size: <input type="number" value={shape.fontSize} onChange={(e) => updateShape(i, 'fontSize', +e.target.value)} className="w-16 px-1 border rounded" /></label>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {shapes.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">Add shapes to build your favicon</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview (512x512)</label>
              <div className="bg-gray-100 rounded-lg border border-gray-200 p-4 flex items-center justify-center" style={{ minHeight: 200 }}>
                <div dangerouslySetInnerHTML={{ __html: previewSvg }} style={{ width: 200, height: 200 }} />
              </div>
              <details className="mt-3">
                <summary className="text-sm text-gray-500 cursor-pointer">SVG Source</summary>
                <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto border border-gray-200">{previewSvg}</pre>
              </details>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paste your SVG code</label>
            <textarea
              value={customSvg}
              onChange={(e) => setCustomSvg(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
              placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">...</svg>'
            />
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={generate}
          className="mt-6 w-full px-4 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors"
          type="button"
        >
          Generate Favicon
        </button>
      </div>

      <PreviewGrid faviconData={faviconData} />
    </div>
  );
}
