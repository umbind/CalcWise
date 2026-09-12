import { useState } from 'react';
import FeedbackModal from './FeedbackModal';
import { trackEvent } from '../lib/analytics/events';

interface CalculatorActionsProps {
  toolName?: string;
  onReset?: () => void;
}

export default function CalculatorActions({ toolName = 'Calculation', onReset }: CalculatorActionsProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        trackEvent('share_link_copied', { toolName });
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    trackEvent('pdf_printed', { toolName });
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleOpenFeedback = () => {
    trackEvent('feedback_opened', { toolName });
    setIsFeedbackOpen(true);
  };

  return (
    <>
      <div className="no-print flex flex-wrap items-center justify-end gap-2 py-2 text-xs font-semibold">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-brand-muted hover:text-brand-dark hover:border-gray-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer"
            title="Reset calculation inputs to defaults"
          >
            <span>↺</span>
            <span>Reset</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleOpenFeedback}
          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-brand-muted hover:text-amber-600 hover:border-amber-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer"
          title="Report discrepancy or suggest improvement"
        >
          <span>💬</span>
          <span className="hidden sm:inline">Report / Feedback</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-brand-muted hover:text-brand-primary hover:border-brand-primary/40 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer"
          aria-live="polite"
        >
          <span>{copied ? '✓' : '🔗'}</span>
          <span>{copied ? 'Copied!' : 'Share'}</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-brand-primary/20 bg-brand-surface text-brand-primary hover:bg-brand-primary hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer"
          title={`Print or save ${toolName} report as PDF`}
        >
          <span>🖨️</span>
          <span>Print / PDF</span>
        </button>
      </div>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        toolName={toolName}
      />
    </>
  );
}
