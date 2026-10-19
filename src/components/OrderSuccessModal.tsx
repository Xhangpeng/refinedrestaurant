/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  Utensils,
  Clock,
  Printer,
  QrCode,
  Share2
} from 'lucide-react';
import { Order } from '../types/restaurant';

interface Props {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onViewAllOrders?: () => void;
}

export const OrderSuccessModal: React.FC<Props> = ({ order, isOpen, onClose, onViewAllOrders }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans-body">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-scale-up">
        {/* Header Badge */}
        <div className="p-6 text-center bg-gradient-to-b from-stone-900 to-stone-950 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-full bg-stone-800/60 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold font-mono uppercase tracking-wider inline-block mb-1">
            ✨ Automatic Kitchen Acceptance
          </span>
          <h3 className="text-xl font-serif-display font-bold text-white">
            Order Dispatched to Kitchen!
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            Order #{order.orderNumber} • {order.createdAt}
          </p>
          {order.tableNumber && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs">
              <Utensils className="w-3.5 h-3.5" />
              <span>Direct Service to {order.tableNumber}</span>
            </div>
          )}
        </div>

        {/* Live Kitchen Status */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Live Preparation Progress</span>
              <span className="text-emerald-700 font-mono">Est. ~{order.estimatedTimeMinutes || 18} mins</span>
            </div>
            {/* Stepper */}
            <div className="grid grid-cols-3 gap-1 pt-1">
              <div className="p-2 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-center">
                <span className="text-[10px] font-bold block">1. Accepted</span>
                <span className="text-[9px] text-emerald-700">Automatic</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-100 border border-amber-400 text-amber-950 text-center animate-pulse">
                <span className="text-[10px] font-bold block">2. In Tandoor</span>
                <span className="text-[9px] text-amber-800">Cooking Now</span>
              </div>
              <div className="p-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-500 text-center">
                <span className="text-[10px] font-bold block">3. Served</span>
                <span className="text-[9px] text-stone-400">At Your Table</span>
              </div>
            </div>
          </div>

          {/* Ordered Dishes List */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
                Kitchen Ticket Summary
              </h4>
              <div className="divide-y divide-stone-100 bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden">
                {order.items.map((item) => (
                  <div key={item.cartItemId} className="p-3 flex items-center justify-between text-xs">
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-stone-900 block truncate">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span className="text-[10px] text-stone-500 capitalize">
                        {item.portion} • Spice {item.spiceLevel}/3
                        {item.specialInstructions ? ` • "${item.specialInstructions}"` : ''}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-stone-900 ml-2">
                      ₹{item.itemTotal}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="p-3 bg-stone-100 rounded-2xl space-y-1 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Payment Mode</span>
              <span className="capitalize font-medium text-stone-900">
                {order.paymentMethod.replace('_', ' ')} ({order.paymentStatus})
              </span>
            </div>
            <div className="flex justify-between font-bold text-sm text-stone-950 pt-1 border-t border-stone-200">
              <span>Total Amount</span>
              <span className="font-mono text-base text-amber-900">₹{order.grandTotal}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 leading-relaxed">
            💡 <strong>No waiting required:</strong> Because orders reach the kitchen automatically, your food is already queued for cooking. Relax while your waiter brings the dishes to your table.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 shrink-0 flex flex-col sm:flex-row gap-2">
          {onViewAllOrders && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewAllOrders();
              }}
              className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
            >
              View All Orders (Grid View)
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Continue Dining & Menu
          </button>
        </div>
      </div>
    </div>
  );
};
