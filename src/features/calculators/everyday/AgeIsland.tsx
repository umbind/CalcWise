import { useState, useId } from 'react';
import { calculateAge } from '../../../lib/calculations/age';

export default function AgeIsland() {
  const [birthDate, setBirthDate] = useState<string>('1998-05-15');
  const [asOfDate, setAsOfDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const bdayId = useId();
  const asOfId = useId();

  const outcome = calculateAge({ birthDate, asOfDate });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label htmlFor={bdayId} className="block text-sm font-semibold text-brand-dark mb-1">
              Date of Birth
            </label>
            <input
              id={bdayId}
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
            />
          </div>

          <div>
            <label htmlFor={asOfId} className="block text-sm font-semibold text-brand-dark mb-1">
              Age as of Date
            </label>
            <input
              id={asOfId}
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-surface border border-gray-300 rounded-lg text-brand-dark font-medium"
            />
            <button
              type="button"
              onClick={() => setAsOfDate(new Date().toISOString().split('T')[0])}
              className="mt-1 text-xs text-brand-primary hover:underline font-medium"
            >
              Reset to Today
            </button>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Your Exact Chronological Age
              </div>
              <div className="text-3xl sm:text-4xl font-black text-brand-primary">
                {outcome.value.years} <span className="text-xl font-bold text-brand-dark">Years</span>,{' '}
                {outcome.value.months} <span className="text-xl font-bold text-brand-dark">Months</span>,{' '}
                {outcome.value.days} <span className="text-xl font-bold text-brand-dark">Days</span>
              </div>

              <div className="text-xs text-brand-muted mt-2">
                Born on a <strong className="text-brand-dark">{outcome.value.birthDayOfWeek}</strong>. Next birthday in{' '}
                <strong className="text-brand-primary">{outcome.value.daysUntilNextBirthday} days</strong>.
              </div>

              {/* Lifetime Units Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-6 pt-5 border-t border-gray-200 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Total Days</span>
                  <span className="font-bold text-sm text-brand-dark">{outcome.value.totalDays.toLocaleString()}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Total Weeks</span>
                  <span className="font-bold text-sm text-brand-dark">{outcome.value.totalWeeks.toLocaleString()}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Total Hours</span>
                  <span className="font-bold text-sm text-brand-dark">{outcome.value.totalHours.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-700">{outcome.warnings[0]?.message || 'Please select a valid date.'}</div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Calendar Math Trace</span>
              <span>{showTrace ? '▲' : '▼'}</span>
            </button>
            {showTrace && outcome.trace && (
              <div className="mt-3 bg-white p-3 rounded-lg border border-gray-200 text-xs space-y-1.5">
                {outcome.trace.map((s) => (
                  <div key={s.stepNumber} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
                    <span className="text-brand-dark font-medium">{s.label}</span>
                    <span className="font-mono text-brand-primary font-bold">{s.result}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
