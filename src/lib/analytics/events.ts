export type AnalyticsEventType =
  | 'calculation_computed'
  | 'passport_viewed'
  | 'share_link_copied'
  | 'pdf_printed'
  | 'feedback_opened'
  | 'feedback_submitted'
  | 'category_selected'
  | 'search_performed';

export interface AnalyticsEventPayload {
  toolName?: string;
  category?: string;
  formulaId?: string;
  source?: string;
  [key: string]: unknown;
}

/**
 * Privacy-preserving, zero-cookie event dispatcher for CalcWise.
 * Does not collect PII, IP addresses, or tracking identifiers.
 */
export function trackEvent(eventType: AnalyticsEventType, payload: AnalyticsEventPayload = {}): void {
  if (typeof window === 'undefined') return;

  // Respect Do Not Track (DNT) browser settings
  if (navigator.doNotTrack === '1' || (window as unknown as { doNotTrack?: string }).doNotTrack === '1') {
    return;
  }

  const enrichedPayload = {
    event: eventType,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
    ...payload,
  };

  // Dispatch custom browser event for optional third-party integrations (e.g., Cloudflare Web Analytics, Plausible)
  try {
    const customEvent = new CustomEvent('calcwise:telemetry', { detail: enrichedPayload });
    window.dispatchEvent(customEvent);
  } catch {
    // Graceful silent fallback
  }

  // Debug log in development environment
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug(`[CalcWise Telemetry] ${eventType}:`, enrichedPayload);
  }
}
