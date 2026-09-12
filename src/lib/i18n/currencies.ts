import { useState, useEffect } from 'react';

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
];

export const DEFAULT_CURRENCY = SUPPORTED_CURRENCIES[0];

export function getCurrency(symbolOrCode: string): CurrencyOption {
  return (
    SUPPORTED_CURRENCIES.find((c) => c.symbol === symbolOrCode || c.code === symbolOrCode) ||
    DEFAULT_CURRENCY
  );
}

export function setGlobalCurrency(currency: CurrencyOption) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('calcwise_currency_symbol', currency.symbol);
    localStorage.setItem('calcwise_currency_code', currency.code);
    window.dispatchEvent(
      new CustomEvent('calcwise_currency_changed', {
        detail: { currency },
      })
    );
  }
}

/**
 * React hook to reactively track active currency in any calculator
 */
export function useCurrency(defaultSymbol = '$'): {
  symbol: string;
  code: string;
  currency: CurrencyOption;
} {
  const [curr, setCurr] = useState<CurrencyOption>(() => {
    if (typeof window !== 'undefined') {
      const savedCode = localStorage.getItem('calcwise_currency_code');
      if (savedCode) {
        return getCurrency(savedCode);
      }
      const savedSymbol = localStorage.getItem('calcwise_currency_symbol');
      if (savedSymbol) {
        return getCurrency(savedSymbol);
      }
    }
    return getCurrency(defaultSymbol);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check localStorage on mount
    const savedCode = localStorage.getItem('calcwise_currency_code');
    const savedSymbol = localStorage.getItem('calcwise_currency_symbol');
    const saved = savedCode ? getCurrency(savedCode) : (savedSymbol ? getCurrency(savedSymbol) : null);
    if (saved && saved.code !== curr.code) {
      setCurr(saved);
    }

    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ currency: CurrencyOption }>;
      if (custom.detail?.currency) {
        setCurr(custom.detail.currency);
      }
    };

    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'calcwise_currency_code' || e.key === 'calcwise_currency_symbol') {
        const code = localStorage.getItem('calcwise_currency_code');
        const sym = localStorage.getItem('calcwise_currency_symbol');
        const found = code ? getCurrency(code) : (sym ? getCurrency(sym) : null);
        if (found) setCurr(found);
      }
    };

    window.addEventListener('calcwise_currency_changed', handler);
    window.addEventListener('storage', storageHandler);
    return () => {
      window.removeEventListener('calcwise_currency_changed', handler);
      window.removeEventListener('storage', storageHandler);
    };
  }, []);

  return {
    symbol: curr.symbol,
    code: curr.code,
    currency: curr,
  };
}
