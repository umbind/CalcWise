import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CALCULATOR_REGISTRY, type CalculatorMetadata } from '../lib/calculations/registry';

interface GlobalSearchProps {
  className?: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  finance: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  health: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  math: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  construction: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  everyday: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  converters: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

const POPULAR_SLUGS = [
  'percentage-calculator',
  'emi-calculator',
  'bmi-calculator',
  'age-calculator',
  'compound-interest-calculator',
  'concrete-calculator',
  'unit-converter',
  'mortgage-calculator',
];

export default function GlobalSearch({ className = '' }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Filtered calculators
  const filteredCalculators = useMemo(() => {
    let list = CALCULATOR_REGISTRY;

    if (selectedCategory !== 'all') {
      list = list.filter((c) => c.category === selectedCategory);
    }

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // Default to popular calculators if no query
      return list.filter((c) => POPULAR_SLUGS.includes(c.slug));
    }

    return list.filter((c) => {
      const matchName = c.name.toLowerCase().includes(trimmed);
      const matchDesc = c.description.toLowerCase().includes(trimmed);
      const matchCategory = c.categoryLabel.toLowerCase().includes(trimmed);
      const matchKeywords = c.keywords.some((k) => k.toLowerCase().includes(trimmed));
      return matchName || matchDesc || matchCategory || matchKeywords;
    });
  }, [query, selectedCategory]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCalculators]);

  // Arrow key navigation inside modal
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredCalculators.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCalculators.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredCalculators[selectedIndex];
      if (target) {
        window.location.href = target.route;
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <>
      {/* Desktop Search Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100/90 text-slate-500 hover:text-slate-800 text-xs transition duration-150 shadow-2xs group focus:outline-none focus:ring-2 focus:ring-brand-primary ${className}`}
        aria-label="Search calculators"
      >
        <svg
          className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-primary transition"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="font-medium text-slate-600 group-hover:text-slate-900">Search 50+ tools...</span>
        <kbd className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-white border border-slate-200 text-slate-400 group-hover:text-slate-600 shadow-2xs">
          Ctrl K
        </kbd>
      </button>

      {/* Mobile Search Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="sm:hidden p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-brand-primary hover:bg-slate-100 transition"
        aria-label="Search calculators"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleModalKeyDown}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-slate-100 bg-white">
              <svg className="w-5 h-5 text-brand-primary shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search calculators by name, category, or keyword..."
                className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none font-medium"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 mr-2"
                  title="Clear input"
                >
                  ✕
                </button>
              )}
              <kbd
                onClick={() => setIsOpen(false)}
                className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-500 cursor-pointer hover:bg-slate-200"
              >
                ESC
              </kbd>
            </div>

            {/* Category Quick Filter Chips */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100 bg-slate-50/70 overflow-x-auto text-xs no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-brand-primary text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
                }`}
              >
                All Tools
              </button>
              {(['finance', 'health', 'math', 'construction', 'everyday', 'converters'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold capitalize transition shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-brand-primary text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1 divide-y-0">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>{query.trim() ? `Matching Calculators (${filteredCalculators.length})` : 'Popular & Frequently Used'}</span>
                <span className="font-normal lowercase">↑↓ to navigate • ↵ to select</span>
              </div>

              {filteredCalculators.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="text-3xl mb-2">🔍</div>
                  <div className="text-sm font-bold text-slate-800">No calculators found</div>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try searching for terms like "EMI", "BMI", "concrete", "percentage", "loan", or "calories".
                  </p>
                </div>
              ) : (
                filteredCalculators.map((calc, idx) => {
                  const isSelected = idx === selectedIndex;
                  const catStyle = CATEGORY_COLORS[calc.category] || {
                    bg: 'bg-slate-50',
                    text: 'text-slate-700',
                    border: 'border-slate-200',
                  };

                  return (
                    <a
                      key={calc.id}
                      href={calc.route}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`group flex items-center justify-between p-2.5 rounded-xl transition duration-100 ${
                        isSelected
                          ? 'bg-blue-50/80 border border-blue-200 text-brand-dark'
                          : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 pr-2">
                        <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-sm shrink-0">
                          {calc.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-brand-primary truncate">
                              {calc.name}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                            >
                              {calc.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5 leading-normal">
                            {calc.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-slate-400 group-hover:text-brand-primary text-xs font-bold shrink-0 ml-2">
                        →
                      </span>
                    </a>
                  );
                })
              )}
            </div>

            {/* Footer Tip */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>50 Verifiable Math Calculators Indexed</span>
              </span>
              <span>CalcWise Math Engine</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
