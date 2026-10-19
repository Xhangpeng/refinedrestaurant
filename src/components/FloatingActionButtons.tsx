import React from 'react';
import { Phone, ShoppingBag, ArrowRight } from 'lucide-react';

interface Props {
  cartCount: number;
  cartTotal: number;
  isCartBouncing: boolean;
  onOpenCallToOrder: () => void;
  onOpenOrderNow: () => void;
}

export const FloatingActionButtons: React.FC<Props> = ({
  cartCount,
  cartTotal,
  isCartBouncing,
  onOpenCallToOrder,
  onOpenOrderNow
}) => {
  return (
    <aside aria-label="Quick Actions" className="fixed bottom-5 right-5 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
      {/* 1. Call to Order popup CTA */}
      <button
        onClick={onOpenCallToOrder}
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-stone-900/95 text-stone-100 hover:text-white border border-amber-500/40 shadow-xl hover:shadow-amber-500/10 hover:border-amber-400 backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95"
        title="Call Shankar Restaurant Directly"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <Phone className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-semibold tracking-wide">Call to Order</span>
      </button>

      {/* 2. Order Now popup CTA */}
      <button
        onClick={onOpenOrderNow}
        className={`group flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 text-stone-950 font-bold shadow-xl hover:bg-amber-300 transition-all duration-200 cursor-pointer active:scale-95 ${
          isCartBouncing ? 'scale-110 ring-4 ring-amber-300/50 shadow-2xl' : 'scale-100'
        }`}
        title="Order Food Items Online"
      >
        <ShoppingBag
          className={`w-4 h-4 text-stone-950 transition-transform ${
            isCartBouncing ? '-rotate-12 scale-125' : 'group-hover:scale-110'
          }`}
        />
        <span className="text-xs tracking-wide">Order Now</span>

        {cartCount > 0 ? (
          <span className="flex items-center gap-1.5 ml-1 pl-2 border-l border-stone-900/20 text-xs font-mono font-black">
            <span className="w-5 h-5 rounded-full bg-stone-950 text-amber-300 flex items-center justify-center text-[10px]">
              {cartCount}
            </span>
            {cartTotal > 0 && <span>₹{cartTotal}</span>}
          </span>
        ) : (
          <ArrowRight className="w-3.5 h-3.5 text-stone-900 group-hover:translate-x-0.5 transition-transform" />
        )}
      </button>
    </aside>
  );
};
