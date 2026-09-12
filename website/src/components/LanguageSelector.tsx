import { useState, useRef, useEffect } from 'react';
import { useWebLanguage } from '../context/LanguageContext';
import {
  NATIONAL_LANGUAGES,
  GLOBAL_LANGUAGES,
} from '../constants/languages';
import type { WebLanguage } from '../constants/languages';

export default function LanguageSelector() {
  const { currentLang, setLanguage } = useWebLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'national' | 'global'>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languageList = activeTab === 'national' ? NATIONAL_LANGUAGES : GLOBAL_LANGUAGES;
  const filteredLanguages = languageList.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (lang: WebLanguage) => {
    setLanguage(lang);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-amber-300/80 bg-amber-50/80 hover:bg-amber-100/90 text-amber-950 text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{currentLang.flag}</span>
        <span className="max-w-[70px] sm:max-w-[90px] truncate">{currentLang.nativeName}</span>
        <span className={`text-[10px] text-amber-700 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#FFFDF9] shadow-2xl border border-amber-200/90 ring-1 ring-black/5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Tabs: National vs Global */}
          <div className="grid grid-cols-2 p-1.5 bg-amber-100/60 border-b border-amber-200/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('national');
                setSearchQuery('');
              }}
              className={`py-1.5 px-2 rounded-xl transition-all ${
                activeTab === 'national'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-stone-600 hover:text-amber-900'
              }`}
            >
              🇮🇳 National (22)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('global');
                setSearchQuery('');
              }}
              className={`py-1.5 px-2 rounded-xl transition-all ${
                activeTab === 'global'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-stone-600 hover:text-amber-900'
              }`}
            >
              🌍 Global Export
            </button>
          </div>

          {/* Quick Filter Search */}
          <div className="p-2 border-b border-amber-100">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'national' ? 'खोजें / Search 22 Indic...' : 'Search global language...'}
              className="w-full px-3 py-1.5 text-xs bg-amber-50/50 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800"
            />
          </div>

          {/* Language Options List */}
          <div className="max-h-60 overflow-y-auto p-1 divide-y divide-amber-50">
            {filteredLanguages.map((lang) => {
              const isSelected = lang.code === currentLang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang)}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100/80 text-amber-950 font-bold'
                      : 'hover:bg-amber-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <div>
                      <div className="font-semibold">{lang.nativeName}</div>
                      <div className="text-[10px] text-stone-500">{lang.name}</div>
                    </div>
                  </div>
                  {isSelected && <span className="text-amber-700 font-bold">✓</span>}
                </button>
              );
            })}
            {filteredLanguages.length === 0 && (
              <div className="p-4 text-center text-xs text-stone-500">
                No language found matching "{searchQuery}"
              </div>
            )}
          </div>

          {/* Export / Heritage Footer note */}
          <div className="bg-amber-50/80 px-3 py-1.5 text-[10px] text-amber-800/80 text-center border-t border-amber-100 font-medium">
            {activeTab === 'national'
              ? '🇮🇳 Supporting All 22 Eighth Schedule Indian Languages'
              : '🌍 Cross-Border Direct Artisan Export Network'}
          </div>
        </div>
      )}
    </div>
  );
}
