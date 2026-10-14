import { useEffect, useRef } from 'react';

export interface ParamConfig {
  default: string;
  aliases?: string[];
}

export type ParamConfigs = Record<string, ParamConfig>;

/**
 * Custom React Hook to sync calculator inputs with URL query parameters.
 * - Reads query params on mount (supporting aliases like ?p= or ?principal=)
 * - Updates window.history.replaceState seamlessly when values change
 * - Removes params when equal to default values to maintain clean URLs
 * - Safe for Server-Side Rendering (SSR) & Static Site Generation (SSG)
 */
export function useUrlSync(
  currentValues: Record<string, string>,
  config: ParamConfigs,
  onLoad: (parsed: Record<string, string>) => void
) {
  const isInitialized = useRef<boolean>(false);

  // 1. Mount effect: read search params from URL and initialize component state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const loaded: Record<string, string> = {};
      let hasCustomParam = false;

      for (const [key, conf] of Object.entries(config)) {
        let val = searchParams.get(key);

        if ((val === null || val === '') && conf.aliases && conf.aliases.length > 0) {
          for (const alias of conf.aliases) {
            val = searchParams.get(alias);
            if (val !== null && val !== '') break;
          }
        }

        if (val !== null && val.trim() !== '') {
          loaded[key] = val.trim();
          hasCustomParam = true;
        }
      }

      if (hasCustomParam) {
        onLoad(loaded);
      }
    } catch {
      // Graceful fallback if window.location is unavailable
    }

    const timer = setTimeout(() => {
      isInitialized.current = true;
    }, 60);

    return () => clearTimeout(timer);
  }, []);

  // Serialize currentValues so effect only triggers on actual value changes
  const valuesKey = Object.entries(currentValues)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');

  // 2. Change effect: sync current values back to URL parameters via replaceState
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized.current) return;

    try {
      const currentUrl = new URL(window.location.href);
      let isModified = false;

      for (const [key, conf] of Object.entries(config)) {
        const val = currentValues[key];
        const defaultVal = conf.default;

        // Clean up legacy aliases if present
        if (conf.aliases) {
          for (const alias of conf.aliases) {
            if (currentUrl.searchParams.has(alias)) {
              currentUrl.searchParams.delete(alias);
              isModified = true;
            }
          }
        }

        if (val !== undefined && val !== null && val.trim() !== '' && val.trim() !== defaultVal) {
          if (currentUrl.searchParams.get(key) !== val.trim()) {
            currentUrl.searchParams.set(key, val.trim());
            isModified = true;
          }
        } else {
          if (currentUrl.searchParams.has(key)) {
            currentUrl.searchParams.delete(key);
            isModified = true;
          }
        }
      }

      if (isModified) {
        window.history.replaceState(null, '', currentUrl.toString());
      }
    } catch {
      // Ignore navigation errors
    }
  }, [valuesKey]);
}
