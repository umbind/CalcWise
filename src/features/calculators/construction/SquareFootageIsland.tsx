import { useState } from 'react';
import { calculateSquareFootage, type RoomDimension } from '../../../lib/calculations/square_footage';

export default function SquareFootageIsland() {
  const [rooms, setRooms] = useState<RoomDimension[]>([
    { length: 12, width: 14, label: 'Living Room' },
    { length: 10, width: 12, label: 'Bedroom' },
  ]);
  const [pricePerSqFt, setPricePerSqFt] = useState<string>('4.50');
  const [showTrace, setShowTrace] = useState<boolean>(false);

  const updateRoom = (index: number, field: keyof RoomDimension, val: string) => {
    const updated = [...rooms];
    updated[index] = { ...updated[index], [field]: val };
    setRooms(updated);
  };

  const addRoom = () => {
    if (rooms.length < 8) {
      setRooms([...rooms, { length: 10, width: 10, label: `Room ${rooms.length + 1}` }]);
    }
  };

  const removeRoom = (index: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((_, i) => i !== index));
    }
  };

  const outcome = calculateSquareFootage({
    rooms,
    pricePerSqFt: pricePerSqFt || undefined,
  });

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs: Rooms List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">Room / Area Dimensions</span>
            <button
              type="button"
              onClick={addRoom}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>+ Add Another Room</span>
            </button>
          </div>

          <div className="space-y-3">
            {rooms.map((room, idx) => (
              <div key={idx} className="p-3 bg-brand-surface rounded-xl border border-gray-200 flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={room.label}
                    onChange={(e) => updateRoom(idx, 'label', e.target.value)}
                    placeholder="Room Name"
                    className="w-full text-xs font-bold text-brand-dark bg-transparent border-b border-gray-300 pb-1 mb-2 focus:outline-none focus:border-brand-primary"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-[10px] text-brand-muted">Length (ft)</span>
                      <input
                        type="number"
                        step="0.5"
                        value={room.length}
                        onChange={(e) => updateRoom(idx, 'length', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-brand-muted">Width (ft)</span>
                      <input
                        type="number"
                        step="0.5"
                        value={room.width}
                        onChange={(e) => updateRoom(idx, 'width', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                {rooms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRoom(idx)}
                    className="text-gray-400 hover:text-red-600 p-1 text-base"
                    title="Remove room"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Optional Material Cost */}
          <div className="pt-3 border-t border-gray-100">
            <label className="block text-xs font-semibold text-brand-dark mb-1">
              Optional Material / Flooring Cost ($ per sq ft)
            </label>
            <input
              type="number"
              step="0.25"
              value={pricePerSqFt}
              onChange={(e) => setPricePerSqFt(e.target.value)}
              placeholder="e.g. 4.50"
              className="w-full px-3 py-2 bg-brand-surface border border-gray-300 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Right Output: Total Area & Equivalents */}
        <div className="lg:col-span-6 bg-brand-surface border border-brand-primary/20 rounded-xl p-6 flex flex-col justify-between">
          {outcome.status === 'success' && outcome.value ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Total Measured Area
              </div>
              <div className="text-4xl font-extrabold text-brand-primary">
                {outcome.value.formattedSqFt}
              </div>

              {/* Equivalents */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-gray-200 text-xs">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Square Yards</span>
                  <span className="text-base font-bold text-brand-dark">{outcome.value.formattedSqYards}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="block text-brand-muted text-[11px]">Square Meters</span>
                  <span className="text-base font-bold text-brand-dark">{outcome.value.formattedSqMeters}</span>
                </div>
              </div>

              {outcome.value.formattedCost && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs flex justify-between items-center">
                  <span className="font-semibold text-emerald-900">Estimated Total Material Cost:</span>
                  <span className="font-extrabold text-base text-emerald-800">{outcome.value.formattedCost}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-red-700">Please provide valid room dimensions.</div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowTrace(!showTrace)}
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center space-x-1"
            >
              <span>{showTrace ? 'Hide' : 'Show'} Area Breakdown</span>
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
