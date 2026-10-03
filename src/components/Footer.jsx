export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
            <rect width="24" height="24" rx="5" fill="#F0B429" />
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontFamily="system-ui" fontWeight="700" fontSize="14" fill="#fff">D</text>
          </svg>
          <span>Made with care by <a href="https://doaide.com" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700 font-medium">DoAide</a></span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
          <span>&copy; {new Date().getFullYear()} DoAide</span>
        </div>
      </div>
    </footer>
  );
}
