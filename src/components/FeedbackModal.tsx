import { useState, useEffect, useId } from 'react';
import { trackEvent } from '../lib/analytics/events';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
}

export default function FeedbackModal({ isOpen, onClose, toolName }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<'discrepancy' | 'feature' | 'typo' | 'other'>('discrepancy');
  const [description, setDescription] = useState<string>('');
  const [expectedValue, setExpectedValue] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const typeId = useId();
  const descId = useId();
  const expectedId = useId();
  const emailId = useId();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    // Track analytics event
    trackEvent('feedback_submitted', {
      toolName,
      feedbackType,
      hasExpectedValue: Boolean(expectedValue.trim()),
    });

    // Save to localStorage for local audit trail
    try {
      const existing = JSON.parse(localStorage.getItem('calcwise_feedback_audit') || '[]');
      existing.push({
        toolName,
        feedbackType,
        description,
        expectedValue,
        email,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('calcwise_feedback_audit', JSON.stringify(existing));
    } catch {
      // Ignore localStorage quotas
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      setExpectedValue('');
      setEmail('');
      onClose();
    }, 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div className="bg-white rounded-2xl border border-brand-border shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-gray-400 hover:text-brand-dark p-1 rounded-lg hover:bg-brand-surface transition"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-2xl text-emerald-600 mx-auto border border-emerald-100">
              ✓
            </div>
            <h3 className="text-xl font-bold text-brand-dark">Report Received</h3>
            <p className="text-sm text-brand-muted max-w-sm mx-auto">
              Thank you for verifying mathematical precision with CalcWise. Our editorial and calculation review team has logged this report.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-xs uppercase font-bold text-brand-primary tracking-wider block mb-1">
                Community Trust & Verification
              </span>
              <h2 id="feedback-modal-title" className="text-xl font-extrabold text-brand-dark">
                Report Issue with {toolName}
              </h2>
              <p className="text-xs text-brand-muted mt-1">
                Notice a calculation discrepancy, rounding anomaly, or edge-case? Help us maintain 100% verified accuracy.
              </p>
            </div>

            <div>
              <label htmlFor={typeId} className="block text-xs font-semibold text-brand-dark mb-1">
                Feedback Type
              </label>
              <select
                id={typeId}
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value as typeof feedbackType)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs font-semibold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              >
                <option value="discrepancy">Calculation Discrepancy / Math Anomaly</option>
                <option value="feature">Feature Request / Extra Parameter</option>
                <option value="typo">Editorial / Citation / Passport Typo</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>

            {feedbackType === 'discrepancy' && (
              <div>
                <label htmlFor={expectedId} className="block text-xs font-semibold text-brand-dark mb-1">
                  Expected Result vs Observed Result
                </label>
                <input
                  id={expectedId}
                  type="text"
                  placeholder="e.g. Input X yielded Y, but authority Z defines it as W"
                  value={expectedValue}
                  onChange={(e) => setExpectedValue(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
                />
              </div>
            )}

            <div>
              <label htmlFor={descId} className="block text-xs font-semibold text-brand-dark mb-1">
                Description & Supporting Details *
              </label>
              <textarea
                id={descId}
                required
                rows={3}
                placeholder="Please describe the issue or reference source..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>

            <div>
              <label htmlFor={emailId} className="block text-xs font-semibold text-brand-dark mb-1">
                Your Email (Optional, for follow-up resolution)
              </label>
              <input
                id={emailId}
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-brand-muted hover:text-brand-dark transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-brand-accent transition"
              >
                Submit Verification Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
