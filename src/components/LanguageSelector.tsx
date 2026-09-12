import React, { useState, useEffect, useRef } from 'react';
import { SUPPORTED_LANGUAGES, type LanguageOption } from '../lib/i18n/translations';
import { triggerPageTranslation } from '../lib/i18n/translator';
import { getCurrency, setGlobalCurrency } from '../lib/i18n/currencies';

interface LanguageSelectorProps {
  className?: string;
}

const LANGUAGE_DEFAULT_CURRENCY: Record<string, string> = {
  hi: '₹',
  es: '€',
  fr: '€',
  de: '€',
  pt: '€',
  ja: '¥',
  zh: '¥',
  ar: '﷼',
  en: '$',
};

export default function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>('en');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize language from localStorage or cookies
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('calcwise_lang');
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        setCurrentLang(saved);
      }
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: LanguageOption) => {
    setCurrentLang(lang.code);
    localStorage.setItem('calcwise_lang', lang.code);
    document.documentElement.lang = lang.code;
    document.documentElement.dir = lang.dir || 'ltr';

    // Auto-sync currency if user hasn't explicitly locked one
    const defaultCurrSymbol = LANGUAGE_DEFAULT_CURRENCY[lang.code];
    if (defaultCurrSymbol) {
      setGlobalCurrency(getCurrency(defaultCurrSymbol));
    }

    // Trigger full-page content translation
    triggerPageTranslation(lang.code);

    // Dispatch global event for local reactive components
    window.dispatchEvent(
      new CustomEvent('calcwise_language_changed', {
        detail: { lang: lang.code, langObj: lang },
      })
    );

    setIsOpen(false);
  };

  const activeOption = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition duration-150 shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-sm">{activeOption.flag}</span>
        <span className="hidden md:inline text-slate-700">{activeOption.code.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Choose Language
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang)}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition ${
                  isSelected
                    ? 'bg-blue-50 text-brand-primary font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{lang.flag}</span>
                  <div>
                    <div className="leading-tight">{lang.nativeName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{lang.name}</div>
                  </div>
                </div>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-brand-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
