import { useState } from 'react';
import { Type, Smile, Image, Pen, Eye, Package, Globe } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import TabNav from './components/TabNav';
import TextFavicon from './features/text-favicon/TextFavicon';
import EmojiFavicon from './features/emoji-favicon/EmojiFavicon';
import ImageFavicon from './features/image-favicon/ImageFavicon';
import SvgFavicon from './features/svg-favicon/SvgFavicon';
import FaviconPreview from './features/favicon-preview/FaviconPreview';
import FaviconPackage from './features/favicon-package/FaviconPackage';
import UrlChecker from './features/url-checker/UrlChecker';

const TABS = [
  { id: 'text', label: 'Text', icon: Type },
  { id: 'emoji', label: 'Emoji', icon: Smile },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'svg', label: 'SVG', icon: Pen },
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'package', label: 'Package', icon: Package },
  { id: 'url', label: 'URL Checker', icon: Globe },
];

const TAB_COMPONENTS = {
  text: TextFavicon,
  emoji: EmojiFavicon,
  image: ImageFavicon,
  svg: SvgFavicon,
  preview: FaviconPreview,
  package: FaviconPackage,
  url: UrlChecker,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('text');
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <ActiveComponent />
      </main>
      <Footer />
    </div>
  );
}
