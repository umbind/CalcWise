import React, { useState, useEffect, useRef } from 'react';
import { SUPPORTED_CURRENCIES, type CurrencyOption, setGlobalCurrency, useCurrency } from '../lib/i18n/currencies';

interface CurrencySelectorProps {
  className?: string;
}

export default function CurrencySelector({ className = '' }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currency } = useCurrency();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (curr: CurrencyOption) => {
    setGlobalCurrency(curr);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition duration-150 shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
        aria-label="Select currency"
        aria-expanded={isOpen}
      >
        <span className="font-bold text-brand-primary">{currency.symbol}</span>
        <span className="hidden sm:inline text-slate-700">{currency.code}</span>
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
        <div className="absolute right-0 mt-1.5 w-52 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Choose Currency
          </div>
          {SUPPORTED_CURRENCIES.map((curr) => {
            const isSelected = curr.code === currency.code;
            return (
              <button
                key={curr.code}
                type="button"
                onClick={() => handleSelect(curr)}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition ${
                  isSelected
                    ? 'bg-blue-50 text-brand-primary font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{curr.flag}</span>
                  <div>
                    <div className="leading-tight font-bold">
                      <span className="text-brand-primary mr-1">{curr.symbol}</span>
                      {curr.code}
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">{curr.name}</div>
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
