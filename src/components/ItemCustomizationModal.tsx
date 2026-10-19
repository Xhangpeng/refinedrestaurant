import React, { useState } from 'react';
import { X, Flame, Plus, Minus, Check, Star } from 'lucide-react';
import { MenuItem, SpiceLevel } from '../types/restaurant';

interface Props {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    portion: 'full' | 'half',
    spiceLevel: SpiceLevel,
    quantity: number,
    specialInstructions?: string
  ) => void;
}

export const ItemCustomizationModal: React.FC<Props> = ({
  item,
  isOpen,
  onClose,
  onAddToCart
}) => {
  if (!isOpen || !item) return null;

  const [portion, setPortion] = useState<'full' | 'half'>('full');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>(item.spiceLevel ?? 1);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const currentPrice = portion === 'half' && item.halfPrice ? item.halfPrice : item.price;
  const itemTotal = currentPrice * quantity;

  const handleConfirm = () => {
    onAddToCart(item, portion, spiceLevel, quantity, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans-body">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Modal Header Image */}
        <div className="relative h-48 bg-stone-100 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs">
              <span className="capitalize">{item.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {item.rating}
              </span>
            </div>
            <h3 className="text-xl font-serif-display font-semibold">{item.name}</h3>
          </div>
        </div>

        {/* Customization Options */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Portion Selection (if half is available) */}
          {item.halfPrice && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider block">
                Select Serving Portion
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPortion('full')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    portion === 'full'
                      ? 'border-amber-900 bg-amber-50/60 text-stone-900'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Full Serving</span>
                    <span className="font-mono tabular-nums">₹{item.price}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Serves 1-2 persons</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPortion('half')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    portion === 'half'
                      ? 'border-amber-900 bg-amber-50/60 text-stone-900'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Half Serving</span>
                    <span className="font-mono tabular-nums">₹{item.halfPrice}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">Single appetite portion</p>
                </button>
              </div>
            </div>
          )}

          {/* Spice Level Adjuster */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-stone-800 uppercase tracking-wider">
                Custom Heat Level
              </label>
              <span className="text-amber-800 font-medium flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                {spiceLevel === 0
                  ? 'Mild / No Chili'
                  : spiceLevel === 1
                  ? 'Traditional Mild'
                  : spiceLevel === 2
                  ? 'Medium Authentic'
                  : 'Desi Royal Hot 🔥'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { level: 0, label: 'Mild' },
                { level: 1, label: 'Classic' },
                { level: 2, label: 'Spicy' },
                { level: 3, label: 'Desi Hot' }
              ].map((s) => (
                <button
                  key={s.level}
                  type="button"
                  onClick={() => setSpiceLevel(s.level as SpiceLevel)}
                  className={`py-2 px-1 text-xs font-medium rounded-lg border text-center transition-all ${
                    spiceLevel === s.level
                      ? 'border-amber-900 bg-amber-900 text-white'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cooking Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider block">
              Kitchen Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Less oil, extra green chutney, no onion garlic..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-800"
            />
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <span className="text-xs font-semibold text-stone-800">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-sm font-bold text-stone-900 tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-stone-500 block">Total Amount</span>
            <span className="text-lg font-bold font-mono text-stone-900 tabular-nums">
              ₹{itemTotal}
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Add to Order Bag
          </button>
        </div>
      </div>
    </div>
  );
};
