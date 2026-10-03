export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 40 40" className="w-9 h-9 flex-shrink-0" aria-hidden="true">
            <rect width="40" height="40" rx="8" fill="#F0B429" />
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="24" fill="#fff">D</text>
          </svg>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              DoAide <span className="text-gold-500">Favicon</span>
            </h1>
            <p className="text-xs text-gray-500 leading-tight hidden sm:block">
              Free Favicon Generator &amp; Manager
            </p>
          </div>
        </div>
        <div className="ml-auto">
          <a
            href="https://doaide.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gold-600 transition-colors"
          >
            doaide.com
          </a>
        </div>
      </div>
    </header>
  );
}
