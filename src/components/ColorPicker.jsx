const PRESET_COLORS = [
  '#F0B429', '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#3B82F6', '#6366F1', '#A855F7', '#EC4899', '#000000',
  '#FFFFFF', '#6B7280', '#1F2937', '#7C3AED', '#059669',
  '#DC2626',
];

export default function ColorPicker({ value, onChange, label, showTransparent = false }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {showTransparent && (
          <button
            onClick={() => onChange('transparent')}
            className={`w-7 h-7 rounded border-2 flex items-center justify-center text-xs ${
              value === 'transparent' ? 'border-gold-500 ring-2 ring-gold-200' : 'border-gray-300'
            }`}
            style={{ background: 'repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 50% / 10px 10px' }}
            title="Transparent"
            type="button"
          >
            <span className="sr-only">Transparent</span>
          </button>
        )}
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-7 h-7 rounded border-2 transition-all ${
              value === color ? 'border-gold-500 ring-2 ring-gold-200 scale-110' : 'border-gray-300 hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            title={color}
            type="button"
          >
            <span className="sr-only">{color}</span>
          </button>
        ))}
      </div>
      <input
        type="color"
        value={value === 'transparent' ? '#ffffff' : value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 rounded cursor-pointer border border-gray-300"
      />
    </div>
  );
}
